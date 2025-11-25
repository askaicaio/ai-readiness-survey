import React from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: number, answer: string | number) => void;
  currentAnswer?: string | number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, currentAnswer }) => {
  const renderInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswer(question.id, option)}
                className={`w-full p-4 text-left text-2xl rounded-lg border-2 transition-all duration-200 ${
                  currentAnswer === option
                    ? 'bg-cyan-600 border-cyan-400 shadow-lg scale-105'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'scale':
        const firstLabel = question.options?.[0]?.split(':')[1]?.trim();
        const lastLabel = question.options?.[question.options?.length - 1]?.split(':')[1]?.trim();
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center items-center gap-2 md:gap-4">
              {question.options?.map((option, index) => {
                const value = index + 1;
                const numericLabel = option.split(':')[0];
                return (
                  <button
                    key={value}
                    onClick={() => onAnswer(question.id, value)}
                    className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-full border-2 transition-all duration-200 ${
                      currentAnswer === value
                        ? 'bg-cyan-600 border-cyan-400 scale-110'
                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    {numericLabel}
                  </button>
                );
              })}
            </div>
            {(firstLabel || lastLabel) && (
              <div className="flex justify-between w-full max-w-md px-2 mt-1">
                <span className="text-base text-slate-400 text-left">{firstLabel}</span>
                <span className="text-base text-slate-400 text-right">{lastLabel}</span>
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <textarea
            rows={4}
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-2xl"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-semibold mb-6 text-slate-100">{question.text}</h2>
      {renderInput()}
    </div>
  );
};

export default QuestionCard;
