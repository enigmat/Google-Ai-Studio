import React, { useState, useEffect } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

type DownloadState = 'idle' | 'downloading' | 'success';

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, imageUrl, onClose }) => {
  const [filename, setFilename] = useState('ai-generated-image');
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const fileType = 'png'; // For now, only PNG is supported

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && downloadState === 'idle') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, downloadState]);
  
  useEffect(() => {
    // Reset state when modal is opened
    if (isOpen) {
        setFilename('ai-generated-image');
        setDownloadState('idle');
    }
  }, [isOpen]);

  if (!isOpen || !imageUrl) {
    return null;
  }

  const handleDownload = () => {
    if (!imageUrl || downloadState !== 'idle') return;

    setDownloadState('downloading');
    
    // Simulate a brief process to allow UI to update
    setTimeout(() => {
        try {
            const finalFilename = `${filename.trim() || 'ai-generated-image'}.${fileType}`;
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = finalFilename;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setDownloadState('success');

            // Auto-close modal after success message
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Download failed:", error);
            setDownloadState('idle'); // Reset on error
        }
    }, 500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDownload();
  };
  
  const isBusy = downloadState !== 'idle';

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={isBusy ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="download-modal-title" className="text-2xl font-bold text-indigo-400 mb-4">Download Image</h2>
        <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
                <label htmlFor="filename" className="block text-sm font-semibold text-gray-400 mb-2">Filename</label>
                <div className={`flex items-center bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden transition-all ${isBusy ? 'opacity-50' : 'focus-within:ring-2 focus-within:ring-indigo-500'}`}>
                    <input
                        type="text"
                        id="filename"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className="w-full p-3 bg-transparent text-white focus:outline-none disabled:cursor-not-allowed"
                        aria-label="Image filename"
                        autoFocus
                        disabled={isBusy}
                    />
                    <span className="px-4 text-gray-500 select-none">.png</span>
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="filetype" className="block text-sm font-semibold text-gray-400 mb-2">File Type</label>
                <select
                    id="filetype"
                    disabled
                    className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-500 focus:outline-none cursor-not-allowed"
                >
                    <option>PNG</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">More file types will be supported in the future.</p>
            </div>
            
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isBusy}
                    className="px-6 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isBusy}
                    className="px-6 py-2 w-36 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {downloadState === 'downloading' && (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Downloading...</span>
                        </>
                    )}
                    {downloadState === 'success' && (
                         <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Downloaded!</span>
                        </>
                    )}
                    {downloadState === 'idle' && (
                        <span>Download</span>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default DownloadModal;