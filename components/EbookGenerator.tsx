import React, { useState } from 'react';
import { BLOG_TONES } from '../constants';

interface EbookGeneratorProps {
  onSubmit: (title: string, chapterTopic: string, outline: string, tone: string, audience: string) => void;
  isLoading: boolean;
}

const EbookGenerator: React.FC<EbookGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [chapterTopic, setChapterTopic] = useState('');
  const [outline, setOutline] = useState('');
  const [tone, setTone] = useState(BLOG_TONES[0]);
  const [audience, setAudience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chapterTopic.trim() && outline.trim() && !isLoading) {
      onSubmit(title, chapterTopic, outline, tone, audience);
    }
  };

  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";
  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ebook-title" className="block text-sm font-semibold text-gray-400 mb-1">Ebook Title (optional)</label>
          <input id="ebook-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., The Alchemy of Code" className={commonInputClasses} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="ebook-chapter-topic" className="block text-sm font-semibold text-gray-400 mb-1">Chapter Title/Topic</label>
          <input id="ebook-chapter-topic" type="text" value={chapterTopic} onChange={(e) => setChapterTopic(e.target.value)} placeholder="e.g., Chapter 1: The First Spark" className={commonInputClasses} disabled={isLoading} required />
        </div>
      </div>
      <div>
        <label htmlFor="ebook-outline" className="block text-sm font-semibold text-gray-400 mb-1">Chapter Outline / Synopsis</label>
        <textarea
          id="ebook-outline"
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
          placeholder="Provide a detailed outline of what this chapter should cover. Include key points, characters involved, and plot progression."
          className={`${commonInputClasses} h-40 resize-none`}
          disabled={isLoading}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ebook-tone" className="block text-sm font-semibold text-gray-400 mb-1">Tone of Voice</label>
          <select id="ebook-tone" value={tone} onChange={(e) => setTone(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {BLOG_TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ebook-audience" className="block text-sm font-semibold text-gray-400 mb-1">Target Audience (optional)</label>
          <input id="ebook-audience" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Young adult fantasy readers" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !chapterTopic.trim() || !outline.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Writing Chapter...' : 'Generate Ebook Chapter'}
      </button>
    </form>
  );
};

export default EbookGenerator;
