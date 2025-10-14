import React, { useState } from 'react';
import Loader from './Loader';
import { SocialMediaPost } from '../services/geminiService';
import TTSButton from './TTSButton';

interface SocialMediaPostDisplayProps {
  posts: SocialMediaPost[] | null;
  isLoading: boolean;
  onGenerateImageClick: (postText: string, platform: string) => void;
}

const SocialMediaPostDisplay: React.FC<SocialMediaPostDisplayProps> = ({ posts, isLoading, onGenerateImageClick }) => {
  const [copiedPostIndex, setCopiedPostIndex] = useState<number | null>(null);

  const handleCopy = (post: SocialMediaPost, index: number) => {
    const textToCopy = `${post.post_text}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedPostIndex(index);
      setTimeout(() => setCopiedPostIndex(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Crafting social media posts..." />
        </div>
      ) : posts ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 whitespace-pre-wrap">{post.post_text}</p>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.hashtags.map(tag => (
                    <span key={tag} className="text-indigo-400 text-sm">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-700/50">
                <TTSButton textToSpeak={`${post.post_text} ${post.hashtags.map(h => `#${h}`).join(' ')}`} className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors" />
                <button
                  onClick={() => handleCopy(post, index)}
                  className="flex-grow flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 text-sm font-semibold rounded-md hover:bg-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" /></svg>
                  {copiedPostIndex === index ? 'Copied!' : 'Copy Post'}
                </button>
                <button
                  onClick={() => onGenerateImageClick(`${post.post_text}`, post.platform)}
                  className="flex-grow flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2.586l-1.707-1.707a1 1 0 00-1.414 0L7 14.586V9a1 1 0 00-2 0v6.586l-1.293-1.293a1 1 0 00-1.414 1.414L4.586 17H5V5zm10 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                  Generate Image
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h4M9 12h6" />
            </svg>
            <p className="mt-2 text-lg font-semibold">Your generated social media posts will appear here</p>
            <p className="text-sm">Fill out the details and click "Generate Posts" to start.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaPostDisplay;