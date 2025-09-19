import React, { useState } from 'react';
import Loader from './Loader';

interface BlogPostDisplayProps {
  content: string | null;
  isLoading: boolean;
}

const BlogPostDisplay: React.FC<BlogPostDisplayProps> = ({ content, isLoading }) => {
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
          <Loader message="Writing your blog post..." />
        </div>
      ) : content ? (
        <>
          <div className="absolute top-3 right-3 flex gap-2">
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
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none w-full h-full overflow-y-auto pr-2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-lg font-semibold">Your generated blog post will appear here</p>
            <p className="text-sm">Fill out the details and click "Generate" to start.</p>
          </div>
        </div>
      )}
      
      {/* Basic prose styling for the generated HTML */}
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

export default BlogPostDisplay;