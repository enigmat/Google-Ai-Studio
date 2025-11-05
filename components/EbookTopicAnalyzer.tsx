import React, { useState } from 'react';

interface EbookTopicAnalyzerProps {
  onSubmit: (keyword: string) => void;
  isLoading: boolean;
}

const EbookTopicAnalyzer: React.FC<EbookTopicAnalyzerProps> = ({ onSubmit, isLoading }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim() && !isLoading) {
      onSubmit(keyword);
    }
  };
  
  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="ebook-keyword" className="block text-sm font-semibold text-gray-400 mb-1">
          Keyword or Broad Topic
        </label>
        <p className="text-xs text-gray-500 mb-2">
            Enter a keyword to discover trending ebook topics from across the web.
        </p>
        <input
            id="ebook-keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., Digital Marketing, Healthy Cooking, Sci-Fi Worlds"
            className={commonInputClasses}
            disabled={isLoading}
            required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !keyword.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Searching...' : 'Find Trending Topics'}
      </button>
    </form>
  );
};

export default EbookTopicAnalyzer;