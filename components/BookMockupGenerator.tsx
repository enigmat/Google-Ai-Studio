import React, { useState, useCallback } from 'react';
import { BOOK_MOCKUPS } from '../constants';

interface BookMockupGeneratorProps {
  onSubmit: (designUrl: string, mockupUrl: string) => void;
  isLoading: boolean;
}

const BookMockupGenerator: React.FC<BookMockupGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [designImageUrl, setDesignImageUrl] = useState<string | null>(null);
  const [selectedMockup, setSelectedMockup] = useState(BOOK_MOCKUPS[0]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.). Recommended: 9:16 aspect ratio.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignImageUrl(reader.result as string);
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
      }
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designImageUrl) {
      setError('Please upload a cover art design.');
      return;
    }
    if (!selectedMockup) {
      setError('Please select a book mockup style.');
      return;
    }
    setError(null);
    onSubmit(designImageUrl, selectedMockup.url);
  };
  
  const checkerboardBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none'%3E%3Crect width='8' height='8' fill='%23374151'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23374151'/%3E%3Crect width='8' height='8' x='8' fill='%231F2937'/%3E%3Crect y='8' width='8' height='8' fill='%231F2937'/%3E%3C/svg%3E")`;

  const getPerspectiveContainerStyle = (id: string): React.CSSProperties => {
    if (id === 'hardcover-bar') {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        perspective: '1200px',
      };
    }
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
    };
  };

  const getPreviewStyle = (id: string): React.CSSProperties => {
    switch (id) {
      case 'paperback-front':
        return {
          position: 'relative',
          width: '75%',
          height: '100%',
          objectFit: 'fill',
          pointerEvents: 'none',
        };
      case 'hardcover-angle':
      case 'paperback-angle-shadow':
         return {
          position: 'relative',
          width: '70%',
          height: '95%',
          objectFit: 'fill',
          pointerEvents: 'none',
        };
      case 'hardcover-bar':
        return {
          position: 'absolute',
          top: '5.8%',
          left: '16.5%',
          width: '56%',
          height: '87.5%',
          objectFit: 'fill',
          transformOrigin: 'left center',
          transform: 'rotateY(-17deg) rotateX(0.5deg) skewY(1.3deg)',
          boxShadow: 'rgba(0, 0, 0, 0.4) 5px 0px 15px -3px', // Simulates shadow from the binding
          borderRight: '2px solid rgba(0,0,0,0.3)' // Simulates the crease
        };
      default:
        return {};
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">1. Upload your cover art</label>
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                htmlFor="design-image-upload" 
                className="w-full h-48 p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700/50"
                style={{ backgroundImage: checkerboardBg }}
            >
            {designImageUrl ? (
                <img src={designImageUrl} alt="Design preview" className="max-h-full max-w-full object-contain" />
            ) : (
                <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
                </div>
            )}
            </label>
            <input
                id="design-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
                disabled={isLoading}
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">2. Preview your mockup</label>
            <div className="relative aspect-[2/3] w-full bg-gray-900 border-2 border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={selectedMockup.url} alt="Selected mockup" className="w-full h-full object-contain" />
                {designImageUrl && (
                    <div style={getPerspectiveContainerStyle(selectedMockup.id)}>
                        <img 
                            src={designImageUrl} 
                            alt="Design overlay" 
                            style={getPreviewStyle(selectedMockup.id)}
                        />
                    </div>
                )}
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">3. Choose a book style</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {BOOK_MOCKUPS.map(mockup => (
                    <button
                        type="button"
                        key={mockup.id}
                        onClick={() => setSelectedMockup(mockup)}
                        disabled={isLoading}
                        className={`p-2 bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${selectedMockup.id === mockup.id ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-700'}`}
                        aria-label={`Select ${mockup.name}`}
                        title={mockup.name}
                    >
                        <img src={mockup.url} alt={mockup.name} className="w-full h-auto object-contain rounded-md aspect-[2/3]" />
                         <p className="text-xs text-center font-semibold text-gray-400 mt-1">{mockup.name}</p>
                    </button>
                ))}
            </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
            type="submit"
            disabled={isLoading || !designImageUrl || !selectedMockup}
            className="w-full mt-2 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
        >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Generating...
          </>
        ) : (
          'Generate Mockup'
        )}
      </button>
    </form>
  );
};
export default BookMockupGenerator;