import React, { useState } from 'react';

interface TitleToImageGeneratorProps {
  onSubmit: (title: string, synopsis: string) => void;
  isLoading: boolean;
}

const TitleToImageGenerator: React.FC<TitleToImageGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && !isLoading) {
      onSubmit(title, synopsis);
    }
  };

  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-gray-400">Generate a cover art style image for a book, movie, or song. The AI will create artwork without text, which you can add later.</p>
      <div>
        <label htmlFor="image-title" className="block text-sm font-semibold text-gray-400 mb-1">Title</label>
        <input id="image-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., The Last Martian" className={commonInputClasses} disabled={isLoading} required />
      </div>
      <div>
        <label htmlFor="image-synopsis" className="block text-sm font-semibold text-gray-400 mb-1">Synopsis / Keywords (Optional)</label>
        <textarea
          id="image-synopsis"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          placeholder="e.g., A sci-fi mystery about a detective on Mars investigating a missing scientist..."
          className={`${commonInputClasses} h-32 resize-none`}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Generating...' : 'Generate Image from Title'}
      </button>
    </form>
  );
};

export default TitleToImageGenerator;
