import React, { useState } from 'react';
import { THUMBNAIL_STYLES } from '../constants';

interface ThumbnailGeneratorProps {
  onSubmit: (mainTitle: string, subtitle: string, iconDesc: string, backgroundDesc: string, style: string, color: string) => void;
  isLoading: boolean;
}

const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [mainTitle, setMainTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [iconDesc, setIconDesc] = useState('');
  const [backgroundDesc, setBackgroundDesc] = useState('');
  const [style, setStyle] = useState(THUMBNAIL_STYLES[0].name);
  const [color, setColor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mainTitle.trim() && !isLoading) {
      onSubmit(mainTitle, subtitle, iconDesc, backgroundDesc, style, color);
    }
  };

  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="thumb-main-title" className="block text-sm font-semibold text-gray-400 mb-1">Main Title</label>
        <input id="thumb-main-title" type="text" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} placeholder="e.g., AI FOR BEGINNERS" className={commonInputClasses} disabled={isLoading} required />
      </div>
      <div>
        <label htmlFor="thumb-subtitle" className="block text-sm font-semibold text-gray-400 mb-1">Subtitle (Optional)</label>
        <input id="thumb-subtitle" type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g., Part 1: The Basics" className={commonInputClasses} disabled={isLoading} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="thumb-icon" className="block text-sm font-semibold text-gray-400 mb-1">Icon/Image Description (Optional)</label>
            <input id="thumb-icon" type="text" value={iconDesc} onChange={(e) => setIconDesc(e.target.value)} placeholder="e.g., a glowing brain icon" className={commonInputClasses} disabled={isLoading} />
        </div>
        <div>
            <label htmlFor="thumb-background" className="block text-sm font-semibold text-gray-400 mb-1">Background Description (Optional)</label>
            <input id="thumb-background" type="text" value={backgroundDesc} onChange={(e) => setBackgroundDesc(e.target.value)} placeholder="e.g., a futuristic server room" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-1">Visual Style</label>
          <div className="flex flex-wrap gap-2">
            {THUMBNAIL_STYLES.map(s => (
                <button
                    type="button"
                    key={s.name}
                    title={s.description}
                    onClick={() => setStyle(s.name)}
                    disabled={isLoading}
                    className={`
                        px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${style === s.name
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                    `}
                >
                    {s.name}
                </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="thumb-color" className="block text-sm font-semibold text-gray-400 mb-1">Color Palette (Optional)</label>
          <input id="thumb-color" type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g., Vibrant blue and yellow" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !mainTitle.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Generating...
          </>
        ) : (
          'Generate Thumbnail'
        )}
      </button>
    </form>
  );
};

export default ThumbnailGenerator;