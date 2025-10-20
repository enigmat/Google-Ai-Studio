import React from 'react';

interface GifGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onEnhance: () => void;
  isEnhancing: boolean;
  isLoading: boolean;
}

const GifGenerator: React.FC<GifGeneratorProps> = ({ prompt, setPrompt, onSubmit, onEnhance, isEnhancing, isLoading }) => {
  const isAnyLoading = isLoading || isEnhancing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnyLoading && prompt.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A cat DJing at a party with flashing lights, looping animation..."
        className="w-full h-28 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        disabled={isAnyLoading}
        aria-label="GIF prompt"
      />
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
            type="button"
            onClick={onEnhance}
            disabled={isAnyLoading || !prompt.trim()}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
            {isEnhancing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Enhancing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.934L13 17.256A1 1 0 0112 18a1 1 0 01-.967-.744L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.934L11 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>
                Enhance
              </>
            )}
        </button>
        <button
          type="submit"
          disabled={isAnyLoading || !prompt.trim()}
          className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate GIF'
          )}
        </button>
      </div>
    </form>
  );
};

export default GifGenerator;
