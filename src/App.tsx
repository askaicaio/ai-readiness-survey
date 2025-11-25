import React, { useState, useCallback, useEffect } from 'react';
import { SURVEY_QUESTIONS } from './constants';
import { getAiRecommendation } from './services/geminiService';
import type { Answers, Recommendation } from './types';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import ResultsCard from './components/ResultsCard';
import { ArrowLeft, ArrowRight, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Embed Support: Broadcast height changes to parent window (e.g., Circle, Webflow)
  useEffect(() => {
    const sendHeight = () => {
      // Only send if we are actually in an iframe
      if (window.location !== window.parent.location) {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'setHeight', height }, '*');
      }
    };

    // Create observers to detect size changes
    const resizeObserver = new ResizeObserver(sendHeight);
    const mutationObserver = new MutationObserver(sendHeight);

    if (document.body) {
      resizeObserver.observe(document.body);
      mutationObserver.observe(document.body, { attributes: true, childList: true, subtree: true });
    }
    
    // Initial send
    sendHeight();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentQuestionIndex, surveyCompleted, recommendation, isLoading]); // Re-run setup if major state changes

  const handleAnswer = useCallback((questionId: number, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex]);

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleSubmit = useCallback(async () => {
    // Safeguard to ensure all questions are answered before submitting.
    if (Object.keys(answers).length !== SURVEY_QUESTIONS.length) return;

    setIsLoading(true);
    setError(null);
    setSurveyCompleted(true);
    try {
      const result = await getAiRecommendation(answers, SURVEY_QUESTIONS);
      setRecommendation(result);
    } catch (err) {
      setError('Sorry, we couldn\'t generate your recommendation. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [answers]);

  useEffect(() => {
    const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
    if (!currentQuestion) return;

    const isAnswered = answers[currentQuestion.id] !== undefined;
    const isAutoAdvanceQuestion = currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'scale';

    if (isAnswered && isAutoAdvanceQuestion) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
          handleNext();
        } else {
          handleSubmit();
        }
      }, 300); // A small delay for UX so the user can see their selection.

      return () => clearTimeout(timer);
    }
  }, [answers, currentQuestionIndex, handleNext, handleSubmit]);

  const isCurrentQuestionAnswered = answers[SURVEY_QUESTIONS[currentQuestionIndex].id] !== undefined;
  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === SURVEY_QUESTIONS.length - 1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BrainCircuit className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold tracking-tight text-white">AI Readiness Survey</h1>
          </div>
          <p className="text-slate-400">Discover your starting point in the world of Generative AI.</p>
        </header>

        <main className="bg-slate-800 rounded-xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8 transition-all duration-500">
          {!surveyCompleted ? (
            <>
              <ProgressBar current={currentQuestionIndex + 1} total={SURVEY_QUESTIONS.length} />
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                currentAnswer={answers[currentQuestion.id]}
              />
              <div className="mt-8 flex justify-between items-center min-h-[40px]">
                <button
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                {currentQuestion.type === 'text' &&
                  (isLastQuestion ? (
                    <button
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length !== SURVEY_QUESTIONS.length}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Get My Recommendation
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={!isCurrentQuestionAnswered}
                      className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Next
                      <ArrowRight size={16} />
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <ResultsCard isLoading={isLoading} recommendation={recommendation} error={error} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
