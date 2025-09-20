import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AirtableConfig } from '../services/airtableService';
import Loader from './Loader';

interface AirtablePromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  config: AirtableConfig;
  getPrompts: (config: AirtableConfig, options: { searchQuery?: string; offset?: string }) => Promise<{ records: any[]; offset?: string }>;
}

const AirtablePromptLibraryModal: React.FC<AirtablePromptLibraryModalProps> = ({ isOpen, onClose, onSelectPrompt, config, getPrompts }) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPrompts = useCallback(async (query: string, newOffset?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { records, offset: nextOffset } = await getPrompts(config, { searchQuery: query, offset: newOffset });
      setPrompts(prev => newOffset ? [...prev, ...records] : records);
      setOffset(nextOffset);
      setHasMore(!!nextOffset);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to fetch prompts: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [config, getPrompts]);

  useEffect(() => {
    if (isOpen) {
        // Initial fetch when modal opens
        fetchPrompts('');
    } else {
        // Reset state when modal closes
        setPrompts([]);
        setSearchQuery('');
        setOffset(undefined);
        setHasMore(false);
        setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
        if (isOpen) { // Only fetch if the modal is open
           fetchPrompts(searchQuery);
        }
    }, 300); // 300ms debounce

    return () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    };
  }, [searchQuery, isOpen, fetchPrompts]);


  const handleLoadMore = () => {
    if (hasMore && !isLoading && offset) {
        fetchPrompts(searchQuery, offset);
    }
  };
  
  const handleSelect = (promptText: string) => {
    onSelectPrompt(promptText);
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity animate-[fade-in_0.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-library-title"
    >
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-3xl border border-gray-700 flex flex-col h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="prompt-library-title" className="text-2xl font-bold text-sky-400 mb-4">Airtable Prompt Library</h2>
        
        <div className="relative mb-4">
          <input 
            type="text"
            placeholder="Search by title or prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            autoFocus
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            {isLoading && prompts.length === 0 ? (
                <div className="flex items-center justify-center h-full"><Loader message="Fetching prompts..." /></div>
            ) : error ? (
                <div className="flex items-center justify-center h-full text-red-400">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">No prompts found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prompts.map(prompt => (
                        <button 
                            key={prompt.id} 
                            onClick={() => handleSelect(prompt.fields.Prompt)}
                            className="text-left p-3 bg-gray-900/50 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            {prompt.fields.Title && <h4 className="font-semibold text-sky-400 mb-1 truncate">{prompt.fields.Title}</h4>}
                            <p className="text-sm text-gray-300 line-clamp-3">{prompt.fields.Prompt}</p>
                        </button>
                    ))}
                </div>
            )}
            {hasMore && (
                 <div className="flex justify-center mt-4">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-colors disabled:bg-sky-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                 </div>
            )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AirtablePromptLibraryModal;