import React from 'react';
import type { Recommendation } from '../types';
import { Award, Zap, Lightbulb } from 'lucide-react';

interface ResultsCardProps {
  isLoading: boolean;
  recommendation: Recommendation | null;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mb-4"></div>
    <h3 className="text-4xl font-semibold text-slate-100 mb-2">Analyzing Your Responses...</h3>
    <p className="text-2xl text-slate-400">Our AI is crafting your personalized recommendation.</p>
  </div>
);

const ResultsDisplay: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
  const getIcon = (level: string) => {
    if (level.includes('Starter')) return <Lightbulb className="w-12 h-12 text-yellow-400" />;
    if (level.includes('Growth')) return <Zap className="w-12 h-12 text-cyan-400" />;
    if (level.includes('Leadership / VIP')) return <Award className="w-12 h-12 text-emerald-400" />;
    return null;
  };

  const ctaText = recommendation.level === 'Leadership / VIP' ? 'Learn More' : 'Enroll Now';
  const ctaLink = '#'; // Placeholder link
  
  return (
     <div className="text-center animate-fade-in">
      <div className="mb-4 inline-block p-4 bg-slate-700 rounded-full">
         {getIcon(recommendation.level)}
      </div>
      <p className="text-2xl font-medium text-slate-400">Our Recommendation for You:</p>
      <h2 className="text-6xl font-bold text-cyan-400 mt-2">{recommendation.level}</h2>
      <p className="text-3xl font-semibold text-slate-300 mb-2">{recommendation.price}</p>
      <div className="mt-6 text-left bg-slate-900/50 p-6 rounded-lg border border-slate-700">
        <p className="text-2xl text-slate-300 leading-relaxed whitespace-pre-wrap">{recommendation.explanation}</p>
      </div>
      <div className="mt-8">
        <a 
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-md font-semibold text-white text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/20"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};


const ResultsCard: React.FC<ResultsCardProps> = ({ isLoading, recommendation, error }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        <h3 className="text-4xl font-semibold mb-2">An Error Occurred</h3>
        <p className="text-2xl">{error}</p>
      </div>
    );
  }

  if (recommendation) {
    return <ResultsDisplay recommendation={recommendation} />;
  }

  return null;
};

export default ResultsCard;
