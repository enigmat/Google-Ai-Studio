import React, { useState, useCallback } from 'react';

interface UgcVideoAdGeneratorProps {
  onSubmit: (productImageUrl: string, productName: string, productDescription: string, motionPrompt: string, isPreview: boolean) => void;
  isLoading: boolean;
  isPreviewLoading: boolean;
  hasPreview: boolean;
}

const UgcVideoAdGenerator: React.FC<UgcVideoAdGeneratorProps> = ({ onSubmit, isLoading, isPreviewLoading, hasPreview }) => {
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [motionPrompt, setMotionPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isAnyLoading = isLoading || isPreviewLoading;

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.).');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImageUrl(reader.result as string);
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

  const validateInputs = () => {
    if (!productImageUrl) {
      setError('Please upload a product image.');
      return false;
    }
    if (!productName.trim() || !productDescription.trim()) {
      setError('Please provide a product name and description.');
      return false;
    }
    if (!motionPrompt.trim()) {
      setError('Please provide a video motion prompt.');
      return false;
    }
    setError(null);
    return true;
  }

  const handlePreview = () => {
    if (validateInputs() && !isAnyLoading && productImageUrl) {
      onSubmit(productImageUrl, productName, productDescription, motionPrompt, true);
    }
  };

  const handleFullGenerate = () => {
    if (validateInputs() && !isAnyLoading && productImageUrl && hasPreview) {
      onSubmit(productImageUrl, productName, productDescription, motionPrompt, false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            htmlFor="ugc-video-image-upload" 
            className="w-full h-40 p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700/50"
        >
          {productImageUrl ? (
            <img src={productImageUrl} alt="Product preview" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="mt-2 text-sm font-semibold">Click to upload product image</p>
            </div>
          )}
        </label>
        <input
            id="ugc-video-image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            disabled={isAnyLoading}
        />
      </div>

      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name (e.g., 'Aura Glow Serum')"
        className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        disabled={isAnyLoading}
        aria-label="Product Name"
      />
      <textarea
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        placeholder="Product Description (e.g., 'A hydrating facial serum...')"
        className="w-full h-20 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        disabled={isAnyLoading}
        aria-label="Product Description"
      />
      <textarea
        value={motionPrompt}
        onChange={(e) => setMotionPrompt(e.target.value)}
        placeholder="Video motion prompt (e.g., 'slow pan showing the product on a bathroom shelf')"
        className="w-full h-24 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        disabled={isAnyLoading}
        aria-label="Motion Prompt"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isAnyLoading || !productImageUrl || !motionPrompt.trim() || !productName.trim() || !productDescription.trim()}
          className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isPreviewLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Previewing...
            </>
          ) : (
            'Generate Preview'
          )}
        </button>
        <button
          type="button"
          onClick={handleFullGenerate}
          disabled={isAnyLoading || !hasPreview || !productImageUrl || !motionPrompt.trim() || !productName.trim() || !productDescription.trim()}
          title={!hasPreview ? "Generate a preview first" : "Generate full video"}
          className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Generating...
            </>
          ) : (
            'Generate Full Video'
          )}
        </button>
      </div>
    </div>
  );
};

export default UgcVideoAdGenerator;
