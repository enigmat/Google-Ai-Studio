import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  setPromptBeforeEnhance: (prompt: string | null) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt:string) => void;
  onSubmit: () => void;
  onEnhance: () => void;
  onInspire: () => void;
  onGetRandomFromAirtable: () => void;
  onBrowseAirtable: () => void;
  isLoading: boolean;
  isEnhancing: boolean;
  isInspiring: boolean;
  isFetchingFromAirtable: boolean;
  airtableConfigured: boolean;
  useGoogleSearch: boolean;
  setUseGoogleSearch: (use: boolean) => void;
  inspirationPrompts: string[];
}

const PromptInput: React.FC<PromptInputProps> = ({ 
    prompt, setPrompt, setPromptBeforeEnhance, negativePrompt, setNegativePrompt, 
    onSubmit, onEnhance, onInspire, onGetRandomFromAirtable, onBrowseAirtable,
    isLoading, isEnhancing, isInspiring, isFetchingFromAirtable, airtableConfigured,
    useGoogleSearch, setUseGoogleSearch,
    inspirationPrompts
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && !isEnhancing && !isInspiring && !isFetchingFromAirtable) {
        onSubmit();
      }
    }
  };

  const isAnyLoading = isLoading || isEnhancing || isInspiring || isFetchingFromAirtable;

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setPromptBeforeEnhance(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder="e.g., A cinematic shot of a raccoon in a library, wearing a monocle, surrounded by floating books..."
        className="w-full h-28 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        disabled={isAnyLoading}
        aria-label="Main prompt"
      />
      <textarea
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
        placeholder="Negative prompt (what to avoid)... e.g., text, watermarks, blurry"
        className="w-full h-20 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        disabled={isAnyLoading}
        aria-label="Negative prompt"
      />
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Inspire Me */}
          <button
            onClick={onInspire}
            disabled={isAnyLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-green-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isInspiring ? (
              <><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Inspiring...</>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>Inspire Me</>
            )}
          </button>
          {/* Enhance */}
          <button
            onClick={onEnhance}
            disabled={isAnyLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isEnhancing ? (
              <><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Enhancing...</>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.934L13 17.256A1 1 0 0112 18a1 1 0 01-.967-.744L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.934L11 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>Enhance</>
            )}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Random from Airtable */}
           <button
            onClick={onGetRandomFromAirtable}
            disabled={isAnyLoading}
            title="Get a random prompt from your Airtable base"
            className="w-full flex items-center justify-center px-4 py-3 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:text-gray-400 disabled:cursor-not-allowed bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 disabled:bg-sky-900"
          >
            {isFetchingFromAirtable ? (
              <><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Fetching...</>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M13.5 6A3.5 3.5 0 0010 2.5 3.5 3.5 0 006.5 6v10a3.5 3.5 0 007 0V6z" /><path d="M10 4a2 2 0 11-4 0 2 2 0 014 0zm2 10a2 2 0 11-4 0 2 2 0 014 0zM6 10a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Random</>
            )}
          </button>
           {/* Browse Airtable */}
          <button
            onClick={onBrowseAirtable}
            title="Browse your prompt library in Airtable"
            className="w-full flex items-center justify-center px-4 py-3 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 bg-sky-600 hover:bg-sky-700 focus:ring-sky-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
            Browse
          </button>
        </div>
        {/* Generate */}
        <button
          onClick={onSubmit}
          disabled={isAnyLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>
          ) : (
            <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2.586l-1.707-1.707a1 1 0 00-1.414 0L7 14.586V9a1 1 0 00-2 0v6.586l-1.293-1.293a1 1 0 00-1.414 1.414L4.586 17H5V5zm10 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>Generate</>
          )}
        </button>
        <label className="flex items-center justify-center text-sm text-gray-400 cursor-pointer hover:text-white">
            <input 
                type="checkbox"
                checked={useGoogleSearch}
                onChange={(e) => setUseGoogleSearch(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 ring-offset-gray-800 focus:ring-2"
                disabled={isAnyLoading}
            />
            <span className="ml-2">Ground with Google Search (for Enhance)</span>
        </label>
        {inspirationPrompts.length > 0 && (
            <div className="border-t border-gray-700/50 pt-3 flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-gray-400">Inspiration:</h4>
                {inspirationPrompts.map((p, i) => (
                    <button 
                        key={i}
                        onClick={() => setPrompt(p)}
                        className="text-left text-sm p-2 bg-gray-800 rounded-md hover:bg-gray-700 text-gray-300 transition-colors"
                    >
                        {p}
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default PromptInput;