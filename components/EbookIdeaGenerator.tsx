import React, { useState } from 'react';
import { EBOOK_GENRES, EBOOK_AUDIENCES } from '../constants';

interface EbookIdeaGeneratorProps {
  onSubmit: (genre: string, audience: string, themes: string, setting: string, protagonist: string) => void;
  isLoading: boolean;
}

const EbookIdeaGenerator: React.FC<EbookIdeaGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [genre, setGenre] = useState(EBOOK_GENRES[0]);
  const [audience, setAudience] = useState(EBOOK_AUDIENCES[1]);
  const [themes, setThemes] = useState('');
  const [setting, setSetting] = useState('');
  const [protagonist, setProtagonist] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(genre, audience, themes, setting, protagonist);
    }
  };

  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";
  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ebook-genre" className="block text-sm font-semibold text-gray-400 mb-1">Genre</label>
          <select id="ebook-genre" value={genre} onChange={(e) => setGenre(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {EBOOK_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ebook-audience" className="block text-sm font-semibold text-gray-400 mb-1">Target Audience</label>
          <select id="ebook-audience" value={audience} onChange={(e) => setAudience(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {EBOOK_AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="ebook-themes" className="block text-sm font-semibold text-gray-400 mb-1">Key Themes/Tropes (optional)</label>
        <input id="ebook-themes" type="text" value={themes} onChange={(e) => setThemes(e.target.value)} placeholder="e.g., Found family, betrayal, redemption" className={commonInputClasses} disabled={isLoading} />
      </div>

      <div>
        <label htmlFor="ebook-setting" className="block text-sm font-semibold text-gray-400 mb-1">Setting (optional)</label>
        <input id="ebook-setting" type="text" value={setting} onChange={(e) => setSetting(e.target.value)} placeholder="e.g., A floating city, a magical library" className={commonInputClasses} disabled={isLoading} />
      </div>

      <div>
        <label htmlFor="ebook-protagonist" className="block text-sm font-semibold text-gray-400 mb-1">Protagonist (optional)</label>
        <input id="ebook-protagonist" type="text" value={protagonist} onChange={(e) => setProtagonist(e.target.value)} placeholder="e.g., A cynical detective, a young mage" className={commonInputClasses} disabled={isLoading} />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Generating Idea...' : 'Generate Ebook Idea'}
      </button>
    </form>
  );
};

export default EbookIdeaGenerator;