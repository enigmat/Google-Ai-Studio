import React, { useState, useEffect, useRef } from 'react';

interface ExpandModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onConfirmExpand: (originalImageUrl: string, expandedCanvasUrl: string, prompt: string) => void;
  isLoading: boolean;
}

type Direction = 'top' | 'right' | 'bottom' | 'left';
const EXPANSION_AMOUNT = 0.5; // Expand by 50% of the original dimension

const ExpandModal: React.FC<ExpandModalProps> = ({ isOpen, imageUrl, onClose, onConfirmExpand, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [directions, setDirections] = useState<Record<Direction, boolean>>({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toggleDirection = (dir: Direction) => {
    setDirections(prev => ({ ...prev, [dir]: !prev[dir] }));
  };

  useEffect(() => {
    if (!isOpen) return;

    // Reset state when modal opens
    setPrompt('');
    setDirections({ top: false, right: false, bottom: false, left: false });

    // Set initial preview to the original image
    setPreviewUrl(imageUrl);

  }, [isOpen, imageUrl]);

  // Update canvas preview when directions change
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const expandX = image.width * EXPANSION_AMOUNT;
        const expandY = image.height * EXPANSION_AMOUNT;

        const newWidth = image.width + (directions.left ? expandX : 0) + (directions.right ? expandX : 0);
        const newHeight = image.height + (directions.top ? expandY : 0) + (directions.bottom ? expandY : 0);
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const offsetX = directions.left ? expandX : 0;
        const offsetY = directions.top ? expandY : 0;

        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(image, offsetX, offsetY);
        
        // Use a temporary canvas URL for the visual preview to show transparency
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = newWidth;
        previewCanvas.height = newHeight;
        const previewCtx = previewCanvas.getContext('2d');
        if(previewCtx) {
            previewCtx.fillStyle = "rgba(0,0,0,0.2)";
            previewCtx.fillRect(0,0,newWidth,newHeight);
            previewCtx.clearRect(offsetX, offsetY, image.width, image.height);
            previewCtx.drawImage(image, offsetX, offsetY);
            setPreviewUrl(previewCanvas.toDataURL('image/png'));
        }
    };
  }, [directions, imageUrl, isOpen]);


  const handleConfirm = () => {
    if (!imageUrl || isLoading || !canvasRef.current) return;
    const hasDirection = Object.values(directions).some(d => d);
    if (!hasDirection) return; // Don't submit if no direction is selected

    const expandedCanvasUrl = canvasRef.current.toDataURL('image/png');
    onConfirmExpand(imageUrl, expandedCanvasUrl, prompt);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfirm();
  };

  if (!isOpen || !imageUrl) {
    return null;
  }
  
  const isActionable = Object.values(directions).some(d => d);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={isLoading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="expand-modal-title"
    >
      <div
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl border border-gray-700 flex flex-col lg:flex-row gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lg:w-1/2 flex-shrink-0 flex flex-col gap-4">
          <p className="text-lg font-semibold text-gray-300">Choose directions to expand</p>
          <div className="aspect-square w-full rounded-lg bg-gray-900 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
             {previewUrl && <img src={previewUrl} alt="Expansion preview" className="max-w-full max-h-full object-contain" />}
             <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <h2 id="expand-modal-title" className="text-2xl font-bold text-purple-400 mb-4">Magic Expand</h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow">
            <div className="flex-grow">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                    1. Select one or more directions:
                </label>
                <div className="grid grid-cols-3 grid-rows-3 gap-2 w-40 mx-auto mb-6">
                    <div/>
                    <button type="button" onClick={() => toggleDirection('top')} className={`p-3 rounded-lg ${directions.top ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a.75.75 0 01-.75-.75V4.66L6.22 7.72a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L10.75 4.66v12.59A.75.75 0 0110 18z" clipRule="evenodd" /></svg></button>
                    <div/>
                    <button type="button" onClick={() => toggleDirection('left')} className={`p-3 rounded-lg ${directions.left ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.07-2.07a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06-1.06l2.07-2.07H2.75A.75.75 0 012 10z" clipRule="evenodd" transform="rotate(180 10 10)"/></svg></button>
                    <div className="aspect-square bg-gray-900/50 rounded-lg"/>
                    <button type="button" onClick={() => toggleDirection('right')} className={`p-3 rounded-lg ${directions.right ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.07-2.07a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06-1.06l2.07-2.07H2.75A.75.75 0 012 10z" clipRule="evenodd" /></svg></button>
                    <div/>
                    <button type="button" onClick={() => toggleDirection('bottom')} className={`p-3 rounded-lg ${directions.bottom ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v12.59l3.03-3.03a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 15.34a.75.75 0 111.06-1.06l3.03 3.03V2.75A.75.75 0 0110 2z" clipRule="evenodd" /></svg></button>
                    <div/>
                </div>
                <label htmlFor="expand-prompt" className="block text-sm font-semibold text-gray-400 mb-2">
                    2. Describe what to add (optional):
                </label>
                <textarea
                    id="expand-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., a field of wildflowers, a bustling city street..."
                    className="w-full h-24 p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none"
                    disabled={isLoading}
                />
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
                    disabled={isLoading || !isActionable}
                    className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    title={!isActionable ? "Please select a direction to expand" : "Generate Expansion"}
                >
                    {isLoading ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Expanding...
                        </>
                    ) : "Generate Expansion"}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpandModal;
