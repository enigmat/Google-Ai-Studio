import React, { useState } from 'react';
import { generateRecipeTopicIdeas } from '../services/geminiService';

interface TopicIdea {
  topic: string;
  imagePrompt: string;
}

interface RecipePostGeneratorProps {
  onSubmit: (dish: string, cuisine: string, prepTime: string, dietary: string[]) => void;
  isLoading: boolean;
  onGenerateHeader: (imagePrompt: string) => void;
}

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

const RecipePostGenerator: React.FC<RecipePostGeneratorProps> = ({ onSubmit, isLoading, onGenerateHeader }) => {
  const [dish, setDish] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [dietary, setDietary] = useState<string[]>([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [topicIdeas, setTopicIdeas] = useState<TopicIdea[]>([]);
  const [topicError, setTopicError] = useState<string | null>(null);

  const handleDietaryChange = (option: string) => {
    setDietary(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const handleGenerateTopics = async () => {
    setIsGeneratingTopics(true);
    setTopicError(null);
    setTopicIdeas([]);
    try {
        const ideas = await generateRecipeTopicIdeas();
        setTopicIdeas(ideas);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setTopicError(`Failed to get topic ideas: ${message}`);
    } finally {
        setIsGeneratingTopics(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dish.trim() && !isLoading) {
      onSubmit(dish, cuisine, prepTime, dietary);
    }
  };

  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="recipe-dish" className="block text-sm font-semibold text-gray-400">Dish Name</label>
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
            <span>Get Trending Ideas</span>
          </button>
        </div>
        <input id="recipe-dish" type="text" value={dish} onChange={(e) => setDish(e.target.value)} placeholder="e.g., Spicy Thai Green Curry" className={commonInputClasses} disabled={isLoading} required />
      </div>

      {topicError && <p className="text-red-400 text-sm">{topicError}</p>}
      {topicIdeas.length > 0 && (
        <div className="border-t border-gray-700/50 pt-3 flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-gray-400">Trending Recipe Ideas:</h4>
          {topicIdeas.map((idea, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-800 rounded-md">
              <p className="flex-grow text-sm text-gray-300">{idea.topic}</p>
              <button 
                type="button"
                onClick={() => setDish(idea.topic)}
                className="flex-shrink-0 text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                title="Use this recipe"
              >
                Use Recipe
              </button>
              <button 
                type="button"
                onClick={() => onGenerateHeader(idea.imagePrompt)}
                className="flex-shrink-0 text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                title="Generate a header image for this recipe"
              >
                Gen Image
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="recipe-cuisine" className="block text-sm font-semibold text-gray-400 mb-1">Cuisine Type (optional)</label>
          <input id="recipe-cuisine" type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="e.g., Thai, Italian" className={commonInputClasses} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="recipe-prep-time" className="block text-sm font-semibold text-gray-400 mb-1">Prep/Cook Time (optional)</label>
          <input id="recipe-prep-time" type="text" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="e.g., about 30 minutes" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-2">Dietary Needs (optional)</label>
        <div className="flex flex-wrap gap-3">
          {DIETARY_OPTIONS.map(option => (
            <label key={option} className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={dietary.includes(option)}
                onChange={() => handleDietaryChange(option)}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-600 ring-offset-gray-800 focus:ring-2"
                disabled={isLoading}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !dish.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Writing...' : 'Generate Recipe Post'}
      </button>
    </form>
  );
};

export default RecipePostGenerator;