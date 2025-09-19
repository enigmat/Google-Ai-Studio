import React, { useState, useCallback } from 'react';
import { TSHIRT_MOCKUPS } from '../constants';

interface TshirtMockupGeneratorProps {
  onSubmit: (designUrl: string, mockupUrl: string) => void;
  isLoading: boolean;
}

const TshirtMockupGenerator: React.FC<TshirtMockupGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [designImageUrl, setDesignImageUrl] = useState<string | null>(null);
  const [selectedMockupUrl, setSelectedMockupUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.). Recommended: PNG with transparent background.');
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
      setError('Please upload a design image.');
      return;
    }
    if (!selectedMockupUrl) {
      setError('Please select a T-shirt mockup.');
      return;
    }
    setError(null);
    onSubmit(designImageUrl, selectedMockupUrl);
  };
  
  const checkerboardBg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' size='32' fill-opacity='0.1'%3e%3cpath d='M0 0 H16 V16 H0 Z' fill='rgb(107 114 128)'/%3e%3cpath d='M16 16 H32 V32 H16 Z' fill='rgb(107 114 128)'/%3e%3c/svg%3e")`;


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">1. Upload your design (PNG with transparency recommended)</label>
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                htmlFor="design-image-upload" 
                className="w-full h-32 p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700/50"
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
            <label className="block text-sm font-semibold text-gray-400 mb-2">2. Choose a mockup</label>
            <div className="grid grid-cols-3 gap-4">
                {TSHIRT_MOCKUPS.map(mockup => (
                    <button
                        type="button"
                        key={mockup.id}
                        onClick={() => setSelectedMockupUrl(mockup.url)}
                        disabled={isLoading}
                        className={`p-2 bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${selectedMockupUrl === mockup.url ? 'ring-2 ring-indigo-500' : 'hover:bg-gray-700'}`}
                    >
                        <img src={mockup.url} alt={mockup.name} className="w-full h-auto object-contain rounded-md aspect-square" />
                        <span className="text-xs text-gray-400 mt-1 block">{mockup.name}</span>
                    </button>
                ))}
            </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
            type="submit"
            disabled={isLoading || !designImageUrl || !selectedMockupUrl}
            className="w-full mt-2 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
        >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Generating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2.586l-1.707-1.707a1 1 0 00-1.414 0L7 14.586V9a1 1 0 00-2 0v6.586l-1.293-1.293a1 1 0 00-1.414 1.414L4.586 17H5V5zm10 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
            Generate Mockup
          </>
        )}
      </button>
    </form>
  );
};
export default TshirtMockupGenerator;