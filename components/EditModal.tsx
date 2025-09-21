import React, { useState, useEffect, useRef } from 'react';
import ImageEditorCanvas from './ImageEditorCanvas';

interface EditModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onConfirmEdit: (originalImageUrl: string, maskedImageUrl: string, prompt: string) => void;
  isLoading: boolean;
  mode?: 'inpaint' | 'remove';
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, imageUrl, onClose, onConfirmEdit, isLoading, mode = 'inpaint' }) => {
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(40);
  const canvasRef = useRef<{ getMaskedImageAsDataUrl: () => string; undo: () => void; }>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setPrompt(''); // Reset prompt when modal opens
    }
  }, [isOpen]);

  if (!isOpen || !imageUrl) {
    return null;
  }

  const handleConfirm = () => {
    if (imageUrl && !isLoading && canvasRef.current) {
      // For 'remove' mode, the prompt doesn't need to be filled.
      if (mode === 'inpaint' && !prompt.trim()) return;
      const maskedImageUrl = canvasRef.current.getMaskedImageAsDataUrl();
      onConfirmEdit(imageUrl, maskedImageUrl, prompt);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfirm();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={isLoading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl border border-gray-700 flex flex-col lg:flex-row gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lg:w-1/2 flex-shrink-0 flex flex-col gap-4">
          <p className="text-lg font-semibold text-gray-300">
            {mode === 'inpaint'
              ? 'Paint a mask over the area you want to edit'
              : 'Paint over the object you want to remove'}
          </p>
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
            <ImageEditorCanvas
              ref={canvasRef}
              imageUrl={imageUrl}
              brushSize={brushSize}
              brushColor="rgba(236, 72, 153, 0.5)"
            />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="brush-size" className="text-sm font-medium text-gray-400 whitespace-nowrap">Brush Size:</label>
            <input 
              type="range"
              id="brush-size"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
            <button 
              onClick={() => canvasRef.current?.undo()}
              className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              title="Undo last stroke"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <h2 id="edit-modal-title" className="text-2xl font-bold text-purple-400 mb-4">
            {mode === 'inpaint' ? 'Inpaint Your Image' : 'Generative Remove'}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow">
            <div className="flex-grow">
              {mode === 'inpaint' ? (
                  <>
                    <label htmlFor="edit-prompt" className="block text-sm font-semibold text-gray-400 mb-2">
                        Describe what to generate in the masked area:
                    </label>
                    <textarea
                        id="edit-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A wizard hat, a snowy mountain landscape, a small dragon on the shoulder..."
                        className="w-full h-32 p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none"
                        disabled={isLoading}
                        autoFocus
                    />
                  </>
              ) : (
                <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg h-full flex items-center justify-center">
                    <p className="text-center text-gray-400">The AI will intelligently remove the masked object and reconstruct the background. No text prompt is needed.</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading || (mode === 'inpaint' && !prompt.trim())}
                    className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Editing...
                        </>
                    ) : (mode === 'inpaint' ? 'Generate Edit' : 'Remove Object')}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;