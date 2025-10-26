import React, { useState } from 'react';
import Loader from './Loader';
import TTSButton from './TTSButton';

interface PoemDisplayProps {
  content: string | null;
  isLoading: boolean;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ content, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Summoning the muse..." />
        </div>
      ) : content ? (
        <>
          <div className="absolute top-3 right-3 flex gap-2">
            <TTSButton textToSpeak={content} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors" />
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors"
            >
              {isCopied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
          <div className="w-full h-full overflow-y-auto pr-2">
            <pre className="text-gray-200 whitespace-pre-wrap font-sans text-base leading-relaxed">
              {content}
            </pre>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="mt-2 text-lg font-semibold">Your poem will appear here</p>
            <p className="text-sm">Describe a topic to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemDisplay;
