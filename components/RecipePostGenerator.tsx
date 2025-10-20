import React, { useState } from 'react';

interface RecipePostGeneratorProps {
  onSubmit: (dish: string, cuisine: string, prepTime: string, dietary: string[]) => void;
  isLoading: boolean;
}

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];

const RecipePostGenerator: React.FC<RecipePostGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [dish, setDish] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [dietary, setDietary] = useState<string[]>([]);

  const handleDietaryChange = (option: string) => {
    setDietary(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
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
        <label htmlFor="recipe-dish" className="block text-sm font-semibold text-gray-400 mb-1">Dish Name</label>
        <input id="recipe-dish" type="text" value={dish} onChange={(e) => setDish(e.target.value)} placeholder="e.g., Spicy Thai Green Curry" className={commonInputClasses} disabled={isLoading} required />
      </div>
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