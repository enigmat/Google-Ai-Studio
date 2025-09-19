
import React from 'react';
import { EXAMPLE_PROMPTS } from '../constants';

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  isLoading: boolean;
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelectPrompt, isLoading }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Or try an example:</h3>
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
