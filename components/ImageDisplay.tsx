import React from 'react';
import Loader from './Loader';
import { SavedImage } from './SavedGallery';

interface ImageDisplayProps {
  imagesData: SavedImage[];
  isLoading: boolean;
  aspectRatio: '1:1' | '16:9' | '9:16';
  onDownloadClick?: (imageUrl: string) => void;
  onEditClick?: (imageUrl: string) => void;
  onRemoveObjectClick?: (imageUrl: string) => void;
  onRemoveBackground?: (imageUrl: string) => void;
  onUpscale?: (imageUrl: string) => void;
  onAnimateClick?: (imageUrl: string) => void;
  onExpandClick?: (imageUrl: string) => void;
  onGetPrompt?: (imageUrl: string) => void;
  onSaveToAirtable?: (image: SavedImage) => void;
  airtableConfigured?: boolean;
  savingToAirtableState?: { status: 'idle' | 'saving'; imageId: string | null };
  hideActions?: boolean;
  airtableRecord?: { id: string; synced: boolean } | null;
  onSyncAirtable?: () => void;
  isSyncingAirtable?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
    imagesData, isLoading, aspectRatio, 
    onDownloadClick = () => {}, onEditClick = () => {}, onRemoveObjectClick = () => {}, onRemoveBackground = () => {}, onUpscale = () => {}, onAnimateClick = () => {}, onExpandClick = () => {},
    onGetPrompt = () => {}, onSaveToAirtable = () => {}, airtableConfigured = false, savingToAirtableState = { status: 'idle', imageId: null },
    hideActions = false,
    airtableRecord, onSyncAirtable, isSyncingAirtable
}) => {
  const getGridColsClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    return 'grid-cols-2';
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
    <div 
      className="relative w-full bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center p-4 transition-all duration-300"
      style={{ aspectRatio: aspectRatio.replace(':', ' / ') }}
    >
      {airtableRecord && onSyncAirtable && (imagesData && imagesData.length > 0) && (
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={onSyncAirtable}
            disabled={isSyncingAirtable || airtableRecord.synced}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200
              ${airtableRecord.synced
                ? 'bg-green-600 text-white cursor-default'
                : isSyncingAirtable
                ? 'bg-yellow-600 text-white cursor-wait'
                : 'bg-yellow-500 text-black hover:bg-yellow-400 focus:ring-yellow-400'
              }
            `}
            title={airtableRecord.synced ? "Prompt synced in Airtable" : "Mark prompt as synced in Airtable"}
          >
            {isSyncingAirtable ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : airtableRecord.synced ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
            )}
            <span>{airtableRecord.synced ? 'Synced' : 'Mark as Synced'}</span>
          </button>
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : imagesData && imagesData.length > 0 ? (
        <div className={`w-full h-full grid ${getGridColsClass(imagesData.length)} gap-4`}>
          {imagesData.map((image, index) => {
            const isSaving = savingToAirtableState.status === 'saving' && savingToAirtableState.imageId === image.id;
            return (
              <div key={image.id || index} className="relative group w-full h-full">
                <img
                  src={image.url}
                  alt={image.title || `Generated by AI ${index + 1}`}
                  className="w-full h-full object-contain rounded-md"
                />
                {!hideActions && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <h4 className="text-white font-bold text-sm truncate" title={image.title}>{image.title}</h4>
                      <p className="text-gray-300 text-xs line-clamp-2" title={image.description}>{image.description}</p>
                    </div>

                    <div className="absolute bottom-2 right-2 flex items-center flex-wrap justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {airtableConfigured && (
                         <ActionButton
                            onClick={() => onSaveToAirtable(image)}
                            disabled={isSaving}
                            title="Save to Airtable"
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900"
                          >
                            {isSaving ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                            )}
                          </ActionButton>
                      )}
                      <ActionButton onClick={() => onAnimateClick(image.url)} title="Animate" className="bg-green-600 hover:bg-green-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M14.553 7.106A1 1 0 0116 8v4a1 1 0 01-1.447.894L12 11.118V8.882l2.553-1.776z" /></svg></ActionButton>
                      <ActionButton onClick={() => onUpscale(image.url)} title="Upscale" className="bg-yellow-500 hover:bg-yellow-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></ActionButton>
                      <ActionButton onClick={() => onRemoveBackground(image.url)} title="Remove BG" className="bg-pink-500 hover:bg-pink-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></ActionButton>
                      <ActionButton onClick={() => onExpandClick(image.url)} title="Expand" className="bg-purple-600 hover:bg-purple-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h4a1 1 0 110 2H5v2a1 1 0 11-2 0V4a1 1 0 011-1zm2 10H4a1 1 0 100 2h1v2a1 1 0 102 0v-3a1 1 0 00-1-1zm10-2h1a1 1 0 100-2h-1V9a1 1 0 10-2 0v3a1 1 0 001 1zm-2-8h4a1 1 0 011 1v4a1 1 0 11-2 0V5h-2a1 1 0 110-2z" clipRule="evenodd" /></svg></ActionButton>
                      <ActionButton onClick={() => onRemoveObjectClick(image.url)} title="Remove Object" className="bg-purple-600 hover:bg-purple-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.367zM14.89 13.477L6.524 5.11A6 6 0 0114.89 13.477zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" /></svg></ActionButton>
                      <ActionButton onClick={() => onEditClick(image.url)} title="Inpaint" className="bg-purple-600 hover:bg-purple-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></ActionButton>
                      <ActionButton onClick={() => onGetPrompt(image.url)} title="Get Prompt from Image" className="bg-teal-600 hover:bg-teal-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></ActionButton>
                      <ActionButton onClick={() => onDownloadClick(image.url)} title="Download" className="bg-indigo-600 hover:bg-indigo-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg></ActionButton>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-lg font-semibold">Your generated images will appear here</p>
          <p className="text-sm">Enter a prompt and click "Generate Image" to start.</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;