import React, { useState, useCallback, useEffect } from 'react';

interface ImageToVideoGeneratorProps {
  onSubmit: (imageUrl: string, motionPrompt: string, isPreview: boolean) => void;
  isLoading: boolean;
  isPreviewLoading: boolean;
  hasPreview: boolean;
  initialImageUrl: string | null;
}

const ImageToVideoGenerator: React.FC<ImageToVideoGeneratorProps> = ({ onSubmit, isLoading, isPreviewLoading, hasPreview, initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [motionPrompt, setMotionPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isAnyLoading = isLoading || isPreviewLoading;

  useEffect(() => {
    if (initialImageUrl) {
        setImageUrl(initialImageUrl);
    }
  }, [initialImageUrl]);

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
        setImageUrl(reader.result as string);
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
    if (!imageUrl) {
      setError('Please upload an image.');
      return false;
    }
    if (!motionPrompt.trim()) {
      setError('Please provide a motion prompt.');
      return false;
    }
    setError(null);
    return true;
  }

  const handlePreview = () => {
    if (validateInputs() && !isAnyLoading && imageUrl) {
      onSubmit(imageUrl, motionPrompt, true);
    }
  };

  const handleFullGenerate = () => {
    if (validateInputs() && !isAnyLoading && imageUrl && hasPreview) {
      onSubmit(imageUrl, motionPrompt, false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            htmlFor="source-image-upload" 
            className="w-full h-48 p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700/50"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Source preview" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
              <p className="text-xs">Your source image here</p>
            </div>
          )}
        </label>
        <input
            id="source-image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            disabled={isAnyLoading}
        />
      </div>

      <textarea
        value={motionPrompt}
        onChange={(e) => setMotionPrompt(e.target.value)}
        placeholder="Describe the motion... (e.g., 'A gentle breeze rustles the leaves', 'cinematic zoom out')"
        className="w-full h-24 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
        disabled={isAnyLoading}
        aria-label="Motion Prompt"
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isAnyLoading || !imageUrl || !motionPrompt.trim()}
          className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isPreviewLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Previewing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Generate Preview
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleFullGenerate}
          disabled={isAnyLoading || !hasPreview || !imageUrl || !motionPrompt.trim()}
          title={!hasPreview ? "Generate a preview first" : "Generate full video"}
          className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Generate Full Video
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageToVideoGenerator;