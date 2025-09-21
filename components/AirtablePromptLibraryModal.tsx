import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AirtableConfig, getTagsFromAirtable } from '../services/airtableService';
import Loader from './Loader';

interface AirtablePromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: { id: string, text: string }) => void;
  config: AirtableConfig;
  getPrompts: (config: AirtableConfig, options: { searchQuery?: string; offset?: string, tags?: string[] }) => Promise<{ records: any[]; offset?: string }>;
}

const AirtablePromptLibraryModal: React.FC<AirtablePromptLibraryModalProps> = ({ isOpen, onClose, onSelectPrompt, config, getPrompts }) => {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  
  // Tag filtering state
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isTagsLoading, setIsTagsLoading] = useState(false);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tagFilterRef = useRef<HTMLDivElement>(null);


  const fetchPrompts = useCallback(async (query: string, newOffset?: string, tagsToFilter?: Set<string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const tagsArray = Array.from(tagsToFilter || selectedTags);
      const { records, offset: nextOffset } = await getPrompts(config, { searchQuery: query, offset: newOffset, tags: tagsArray });
      setPrompts(prev => newOffset ? [...prev, ...records] : records);
      setOffset(nextOffset);
      setHasMore(!!nextOffset);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to fetch prompts: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [config, getPrompts, selectedTags]);

  useEffect(() => {
    if (isOpen) {
        const fetchInitialData = async () => {
            setIsTagsLoading(true);
            try {
                const tags = await getTagsFromAirtable(config);
                setAllTags(tags);
            } catch (e) {
                console.error("Could not fetch tags", e);
                // Non-critical error, user can still search
            } finally {
                setIsTagsLoading(false);
            }
        };
        fetchInitialData();
        // Initial fetch when modal opens
        fetchPrompts('', undefined, new Set());
    } else {
        // Reset state when modal closes
        setPrompts([]);
        setSearchQuery('');
        setOffset(undefined);
        setHasMore(false);
        setError(null);
        setSelectedTags(new Set());
        setAllTags([]);
        setIsTagFilterOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
        if (isOpen) { // Only fetch if the modal is open
           fetchPrompts(searchQuery, undefined, selectedTags);
        }
    }, 300); // 300ms debounce

    return () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    };
  }, [searchQuery, selectedTags, isOpen, fetchPrompts]);

  // Close tag dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (tagFilterRef.current && !tagFilterRef.current.contains(event.target as Node)) {
            setIsTagFilterOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !isLoading && offset) {
        fetchPrompts(searchQuery, offset);
    }
  };
  
  const handleSelect = (prompt: { id: string, text: string }) => {
    onSelectPrompt(prompt);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
        const newSet = new Set(prev);
        if (newSet.has(tag)) {
            newSet.delete(tag);
        } else {
            newSet.add(tag);
        }
        return newSet;
    });
  };

  const handleClearTags = () => {
    setSelectedTags(new Set());
    setIsTagFilterOpen(false);
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
        
        <div className="flex gap-2 mb-4">
            <div className="relative flex-grow">
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
            <div className="relative" ref={tagFilterRef}>
                <button
                    onClick={() => setIsTagFilterOpen(prev => !prev)}
                    disabled={isTagsLoading || allTags.length === 0}
                    className="flex items-center gap-2 h-full px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                    <span>Filter by Tag</span>
                    {selectedTags.size > 0 && <span className="bg-sky-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{selectedTags.size}</span>}
                </button>
                {isTagFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-10 p-2">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <h4 className="text-sm font-semibold text-gray-300">Tags</h4>
                            <button onClick={handleClearTags} className="text-xs text-sky-400 hover:underline">Clear</button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                            {allTags.map(tag => (
                                <label key={tag} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.has(tag)}
                                        onChange={() => handleTagToggle(tag)}
                                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-sky-500 focus:ring-sky-600"
                                    />
                                    <span className="text-sm text-gray-300">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            {isLoading && prompts.length === 0 ? (
                <div className="flex items-center justify-center h-full"><Loader message="Fetching prompts..." /></div>
            ) : error ? (
                <div className="flex items-center justify-center h-full text-red-400">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {searchQuery || selectedTags.size > 0 ? 'No matching prompts found.' : 'Your prompt library is empty.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prompts.map(prompt => (
                        <button 
                            key={prompt.id} 
                            onClick={() => handleSelect({ id: prompt.id, text: prompt.fields.Prompt })}
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