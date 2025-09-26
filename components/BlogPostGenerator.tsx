import React, { useState } from 'react';
import { BLOG_TONES, BLOG_LENGTHS } from '../constants';
import { generateBlogTopicIdeas } from '../services/geminiService';

interface BlogPostGeneratorProps {
  onSubmit: (topic: string, tone: string, length: string, audience: string) => void;
  isLoading: boolean;
}

const TOPIC_CATEGORIES = ['Business', 'Creative', 'Tech', 'Lifestyle', 'Music'];

const BlogPostGenerator: React.FC<BlogPostGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState(BLOG_TONES[0]);
  const [length, setLength] = useState(BLOG_LENGTHS[1]);
  const [audience, setAudience] = useState('');
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [topicIdeas, setTopicIdeas] = useState<string[]>([]);
  const [topicError, setTopicError] = useState<string | null>(null);
  const [topicCategory, setTopicCategory] = useState(TOPIC_CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic, tone, length, audience);
    }
  };
  
  const handleGenerateTopics = async () => {
    setIsGeneratingTopics(true);
    setTopicError(null);
    setTopicIdeas([]);
    try {
        const ideas = await generateBlogTopicIdeas(topicCategory);
        setTopicIdeas(ideas);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setTopicError(`Failed to get topic ideas: ${message}`);
    } finally {
        setIsGeneratingTopics(false);
    }
  };
  
  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor="blog-topic" className="block text-sm font-semibold text-gray-400">
              Blog Post Topic or Title
            </label>
            <div className="flex items-center gap-2">
                <select
                    value={topicCategory}
                    onChange={(e) => setTopicCategory(e.target.value)}
                    disabled={isLoading || isGeneratingTopics}
                    className="bg-gray-700 border border-gray-600 text-white text-xs font-semibold rounded-md p-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    aria-label="Topic Idea Category"
                >
                    {TOPIC_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button
                    type="button"
                    onClick={handleGenerateTopics}
                    disabled={isLoading || isGeneratingTopics}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-green-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                    {isGeneratingTopics ? (
                         <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.934L13 17.256A1 1 0 0112 18a1 1 0 01-.967-.744L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.934L11 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>
                    )}
                    <span>Get Ideas</span>
                </button>
            </div>
        </div>
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

      {topicError && <p className="text-red-400 text-sm">{topicError}</p>}
      {topicIdeas.length > 0 && (
          <div className="border-t border-gray-700/50 pt-3 flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-gray-400">Topic Ideas ({topicCategory}):</h4>
              {topicIdeas.map((idea, i) => (
                  <button 
                      key={i}
                      type="button"
                      onClick={() => setTopic(idea)}
                      className="text-left text-sm p-2 bg-gray-800 rounded-md hover:bg-gray-700 text-gray-300 transition-colors"
                  >
                      {idea}
                  </button>
              ))}
          </div>
      )}

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
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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