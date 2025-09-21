import React, { useState, useMemo } from 'react';

export interface SavedImage {
  id: string;
  url: string;
  prompt: string;
  originalPrompt?: string | null;
  title: string;
  description: string;
  tags: string[];
}

interface SavedGalleryProps {
  images: SavedImage[];
  onDeleteImage: (id: string) => void;
  onClearAll: () => void;
  onDownloadClick: (imageUrl: string) => void;
  onEditClick: (imageUrl: string) => void;
  onRemoveObjectClick: (imageUrl: string) => void;
  onExpandClick: (imageUrl: string) => void;
  onRemoveBackground: (imageUrl: string) => void;
  onUpscale: (imageUrl: string) => void;
  onSetReference: (imageUrl: string) => void;
  onSaveToAirtable: (image: SavedImage) => void;
  airtableConfigured: boolean;
  savingToAirtableState: { status: 'idle' | 'saving'; imageId: string | null };
  showSaveConfirmation?: boolean;
  isGeneratingMetadata?: boolean;
}

const SavedGallery: React.FC<SavedGalleryProps> = ({ 
    images, onDeleteImage, onClearAll, onDownloadClick, onEditClick, onRemoveObjectClick, onExpandClick,
    onRemoveBackground, onUpscale, onSetReference, onSaveToAirtable, airtableConfigured, savingToAirtableState,
    showSaveConfirmation, isGeneratingMetadata
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) {
      return images;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return images.filter(image => 
      image.title.toLowerCase().includes(lowercasedQuery) ||
      image.description.toLowerCase().includes(lowercasedQuery) ||
      image.prompt.toLowerCase().includes(lowercasedQuery) ||
      (image.originalPrompt && image.originalPrompt.toLowerCase().includes(lowercasedQuery)) ||
      image.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
  }, [images, searchQuery]);
  
  if (images.length === 0) {
    return null;
  }
  
  const ActionButton: React.FC<{ onClick: () => void, title: string, children: React.ReactNode, className?: string, disabled?: boolean }> = 
    ({ onClick, title, children, className = 'bg-gray-600/80 hover:bg-gray-700', disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mt-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-indigo-400">Your Saved Creations</h2>
            <div className={`transition-opacity duration-500 ease-in-out ${showSaveConfirmation ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-green-400 text-sm font-semibold flex items-center gap-1 bg-green-900/50 px-3 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Auto-saved
                </span>
            </div>
            {isGeneratingMetadata && (
                <span className="text-cyan-400 text-sm font-semibold flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating metadata...
                </span>
            )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input 
            type="text"
            placeholder="Search your creations by prompt, title, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
        </div>
        <button
            onClick={onClearAll}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
        >
            Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredImages.map((image) => {
          const isSaving = savingToAirtableState.status === 'saving' && savingToAirtableState.imageId === image.id;
          const promptTooltip = image.originalPrompt
            ? `Original: ${image.originalPrompt}\n\nEnhanced: ${image.prompt}`
            : `Prompt: ${image.prompt}`;
          const fullTooltip = `${image.title}\n\nDescription: ${image.description}\n\n${promptTooltip}\n\nTags: ${image.tags.join(', ')}`;
          
          return (
            <div key={image.id} className="relative group aspect-square" title={fullTooltip}>
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-wrap gap-2 p-2">
                {airtableConfigured && (
                  <ActionButton onClick={() => onSaveToAirtable(image)} disabled={isSaving} title="Save to Airtable" className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900">
                    {isSaving ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                    )}
                  </ActionButton>
                )}
                <ActionButton onClick={() => onSetReference(image.url)} title="Use as Reference" className="bg-green-600 hover:bg-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
                </ActionButton>
                <ActionButton onClick={() => onUpscale(image.url)} title="Upscale" className="bg-yellow-500 hover:bg-yellow-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></ActionButton>
                <ActionButton onClick={() => onRemoveBackground(image.url)} title="Remove BG" className="bg-pink-500 hover:bg-pink-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></ActionButton>
                <ActionButton onClick={() => onExpandClick(image.url)} title="Expand" className="bg-purple-600 hover:bg-purple-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h4a1 1 0 110 2H5v2a1 1 0 11-2 0V4a1 1 0 011-1zm2 10H4a1 1 0 100 2h1v2a1 1 0 102 0v-3a1 1 0 00-1-1zm10-2h1a1 1 0 100-2h-1V9a1 1 0 10-2 0v3a1 1 0 001 1zm-2-8h4a1 1 0 011 1v4a1 1 0 11-2 0V5h-2a1 1 0 110-2z" clipRule="evenodd" /></svg></ActionButton>
                <ActionButton onClick={() => onRemoveObjectClick(image.url)} title="Remove Object" className="bg-purple-600 hover:bg-purple-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.367zM14.89 13.477L6.524 5.11A6 6 0 0114.89 13.477zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" /></svg></ActionButton>
                <ActionButton onClick={() => onEditClick(image.url)} title="Inpaint" className="bg-purple-600 hover:bg-purple-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></ActionButton>
                <ActionButton onClick={() => onDownloadClick(image.url)} title="Download" className="bg-indigo-600 hover:bg-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </ActionButton>
                <ActionButton onClick={() => onDeleteImage(image.id)} title="Delete" className="bg-red-600 hover:bg-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002 2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                </ActionButton>
              </div>
            </div>
          )
        })}
      </div>
      {filteredImages.length === 0 && searchQuery && (
        <div className="text-center py-10 text-gray-500">
          <h3 className="text-lg font-semibold">No results found</h3>
          <p>Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
};

export default SavedGallery;