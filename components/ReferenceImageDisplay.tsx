import React from 'react';

interface ReferenceImageDisplayProps {
  imageUrl: string;
  onClear: () => void;
}

const ReferenceImageDisplay: React.FC<ReferenceImageDisplayProps> = ({ imageUrl, onClear }) => {
  return (
    <div className="bg-gray-800/50 border border-green-500/50 rounded-lg p-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img 
            src={imageUrl} 
            alt="Reference" 
            className="w-12 h-12 object-cover rounded-md"
        />
        <div>
            <h4 className="font-semibold text-green-400">Reference Image Active</h4>
            <p className="text-xs text-gray-400">Your next generation will be based on this image.</p>
        </div>
      </div>
      <button
        onClick={onClear}
        className="bg-gray-700 text-gray-300 p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
        aria-label="Clear reference image"
        title="Clear Reference"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ReferenceImageDisplay;