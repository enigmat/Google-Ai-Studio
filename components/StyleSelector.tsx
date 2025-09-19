import React from 'react';
import { STYLES } from '../constants';

interface StyleSelectorProps {
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  isLoading: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, setSelectedStyle, isLoading }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Artistic Style:</h3>
      <div className="flex flex-wrap gap-2">
        {STYLES.map(({ name }) => (
          <button
            key={name}
            onClick={() => setSelectedStyle(name)}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${selectedStyle === name
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }
            `}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
