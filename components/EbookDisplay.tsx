import React, { useState } from 'react';
import Loader from './Loader';
import TTSButton from './TTSButton';

interface EbookDisplayProps {
  content: string | null;
  isLoading: boolean;
}

const EbookDisplay: React.FC<EbookDisplayProps> = ({ content, isLoading }) => {
  const [copyState, setCopyState] = useState<'idle' | 'html' | 'text'>('idle');

  const handleCopy = (type: 'html' | 'text') => {
    if (!content) return;
    
    let textToCopy = content;
    if (type === 'text') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      textToCopy = tempDiv.textContent || tempDiv.innerText || '';
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyState(type);
      setTimeout(() => setCopyState('idle'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Writing your chapter..." />
        </div>
      ) : content ? (
        <>
          <div className="absolute top-3 right-3 flex gap-2">
            <TTSButton textToSpeak={content} isHtml={true} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors" />
            <button
              onClick={() => handleCopy('html')}
              className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors"
            >
              {copyState === 'html' ? 'Copied!' : 'Copy HTML'}
            </button>
            <button
              onClick={() => handleCopy('text')}
              className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors"
            >
              {copyState === 'text' ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none w-full h-full overflow-y-auto pr-2 pb-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <p className="mt-2 text-lg font-semibold">Your ebook chapter will appear here</p>
            <p className="text-sm">Fill out the details to get started.</p>
          </div>
        </div>
      )}
      
      <style>{`
        .prose h1 {
            color: #a78bfa; /* violet-400 */
        }
        .prose h2 {
            color: #818cf8; /* indigo-400 */
            border-bottom: 1px solid #4b5563; /* gray-600 */
            padding-bottom: 0.25em;
        }
        .prose a {
            color: #60a5fa; /* blue-400 */
        }
        .prose a:hover {
            color: #93c5fd; /* blue-300 */
        }
        .prose strong {
            color: #f9fafb; /* gray-50 */
        }
      `}</style>
    </div>
  );
};

export default EbookDisplay;
