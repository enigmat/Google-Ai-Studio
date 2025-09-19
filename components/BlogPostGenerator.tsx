import React, { useState } from 'react';
import { BLOG_TONES, BLOG_LENGTHS } from '../constants';

interface BlogPostGeneratorProps {
  onSubmit: (topic: string, tone: string, length: string, audience: string) => void;
  isLoading: boolean;
}

const BlogPostGenerator: React.FC<BlogPostGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState(BLOG_TONES[0]);
  const [length, setLength] = useState(BLOG_LENGTHS[1]);
  const [audience, setAudience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic, tone, length, audience);
    }
  };
  
  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="blog-topic" className="block text-sm font-semibold text-gray-400 mb-1">
          Blog Post Topic or Title
        </label>
        <input
          id="blog-topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., The Future of Renewable Energy"
          className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="blog-tone" className="block text-sm font-semibold text-gray-400 mb-1">
            Tone of Voice
          </label>
          <select
            id="blog-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className={commonSelectClasses}
            disabled={isLoading}
          >
            {BLOG_TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="blog-length" className="block text-sm font-semibold text-gray-400 mb-1">
            Desired Length
          </label>
          <select
            id="blog-length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className={commonSelectClasses}
            disabled={isLoading}
          >
            {BLOG_LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="blog-audience" className="block text-sm font-semibold text-gray-400 mb-1">
          Target Audience (optional)
        </label>
        <input
          id="blog-audience"
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g., Tech enthusiasts, beginner gardeners"
          className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Writing...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            Generate Blog Post
          </>
        )}
      </button>
    </form>
  );
};

export default BlogPostGenerator;