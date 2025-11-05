import React, { useState } from 'react';
import Loader from './Loader';
import TTSButton from './TTSButton';

export interface AIAnalysisResult {
    ai_percentage: number;
    rationale: string;
}

interface AIContentAnalysisDisplayProps {
  analysis: AIAnalysisResult | null;
  humanizedText: string | null;
  onHumanize: () => void;
  isLoading: boolean;
  isHumanizing: boolean;
}

const AIGauge: React.FC<{ percentage: number }> = ({ percentage }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage > 75 ? 'text-red-500' : percentage > 50 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
        <span className="text-4xl font-bold">{percentage}%</span>
        <span className="text-sm font-semibold">AI Likelihood</span>
      </div>
    </div>
  );
};

const AIContentAnalysisDisplay: React.FC<AIContentAnalysisDisplayProps> = ({ analysis, humanizedText, onHumanize, isLoading, isHumanizing }) => {
    const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

    const handleCopy = () => {
      if (!humanizedText) return;
      navigator.clipboard.writeText(humanizedText).then(() => {
        setCopyState('copied');
        setTimeout(() => setCopyState('idle'), 2000);
      });
    };

    if (isLoading) {
        return (
            <div className="w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                <Loader message="Analyzing content..." />
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    <p className="mt-2 text-lg font-semibold">Your analysis results will appear here</p>
                    <p className="text-sm">Paste your text and click "Analyze" to start.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full min-h-[500px] bg-gray-800 border-2 border-gray-700 rounded-lg flex flex-col p-4 gap-6 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex-shrink-0">
                    <AIGauge percentage={analysis.ai_percentage} />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-indigo-400 mb-2">Analysis Rationale</h3>
                    <p className="text-sm text-gray-300">{analysis.rationale}</p>
                </div>
            </div>

            <div className="flex-grow flex flex-col gap-4">
                 <button
                    onClick={onHumanize}
                    disabled={isHumanizing}
                    className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-green-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                    {isHumanizing ? 'Humanizing...' : 'Rewrite to Sound More Human'}
                </button>

                {isHumanizing && !humanizedText && (
                     <div className="flex-grow flex items-center justify-center rounded-lg bg-gray-900/50 border border-gray-700">
                        <Loader message="Rewriting text..." />
                    </div>
                )}
                
                {humanizedText && (
                    <div className="relative flex-grow flex flex-col p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold text-green-400 mb-2">Humanized Version</h3>
                        <div className="absolute top-3 right-3 flex gap-2">
                             <TTSButton textToSpeak={humanizedText} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors" />
                             <button onClick={handleCopy} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors">
                                {copyState === 'copied' ? 'Copied!' : 'Copy Text'}
                             </button>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2">
                            <p className="text-gray-200 whitespace-pre-wrap">{humanizedText}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIContentAnalysisDisplay;
