import React, { useState } from 'react';

interface AIContentAnalyzerProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const AIContentAnalyzer: React.FC<AIContentAnalyzerProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="ai-text-content" className="block text-sm font-semibold text-gray-400 mb-1">
          Paste your text here (e.g., an ebook chapter)
        </label>
        <textarea
          id="ai-text-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text you want to analyze and humanize..."
          className="w-full h-80 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
          disabled={isLoading}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Text'}
      </button>
    </form>
  );
};

export default AIContentAnalyzer;
