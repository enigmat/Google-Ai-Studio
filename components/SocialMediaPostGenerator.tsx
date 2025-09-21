import React, { useState } from 'react';
import { BLOG_TONES, SOCIAL_MEDIA_PLATFORMS } from '../constants';

interface SocialMediaPostGeneratorProps {
  onSubmit: (topic: string, platform: string, tone: string, audience: string, includeHashtags: boolean, includeEmojis: boolean) => void;
  isLoading: boolean;
}

const SocialMediaPostGenerator: React.FC<SocialMediaPostGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState(SOCIAL_MEDIA_PLATFORMS[0]);
  const [tone, setTone] = useState(BLOG_TONES[1]); // Default to Casual
  const [audience, setAudience] = useState('');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic, platform, tone, audience, includeHashtags, includeEmojis);
    }
  };
  
  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";
  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="sm-topic" className="block text-sm font-semibold text-gray-400 mb-1">
          What is the post about?
        </label>
        <textarea
            id="sm-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The launch of our new eco-friendly product line..."
            className="w-full h-28 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
            disabled={isLoading}
            required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sm-platform" className="block text-sm font-semibold text-gray-400 mb-1">
            Platform
          </label>
          <select id="sm-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {SOCIAL_MEDIA_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sm-tone" className="block text-sm font-semibold text-gray-400 mb-1">
            Tone of Voice
          </label>
          <select id="sm-tone" value={tone} onChange={(e) => setTone(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {BLOG_TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="sm-audience" className="block text-sm font-semibold text-gray-400 mb-1">
          Target Audience (optional)
        </label>
        <input id="sm-audience" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Young professionals, eco-conscious shoppers" className={commonInputClasses} disabled={isLoading} />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center text-sm text-gray-400 cursor-pointer hover:text-white">
            <input 
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-600 ring-offset-gray-800 focus:ring-2"
                disabled={isLoading}
            />
            <span className="ml-2">Include hashtags</span>
        </label>
         <label className="flex items-center text-sm text-gray-400 cursor-pointer hover:text-white">
            <input 
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-600 ring-offset-gray-800 focus:ring-2"
                disabled={isLoading}
            />
            <span className="ml-2">Include emojis</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Posts...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.993.883L4 8v10a1 1 0 001 1h10a1 1 0 001-1V8l-.007-.117A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" />
            </svg>
            Generate Posts
          </>
        )}
      </button>
    </form>
  );
};

export default SocialMediaPostGenerator;