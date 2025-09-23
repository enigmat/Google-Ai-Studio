import React, { useState, useCallback } from 'react';

type InspirationWeight = 'Low' | 'Medium' | 'High';

interface RecreateThumbnailGeneratorProps {
  onSubmit: (imageUrl: string, changesPrompt: string, weight: InspirationWeight) => void;
  isLoading: boolean;
}

const RecreateThumbnailGenerator: React.FC<RecreateThumbnailGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [changesPrompt, setChangesPrompt] = useState('');
  const [weight, setWeight] = useState<InspirationWeight>('High');
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please upload a thumbnail image to recreate.');
      return;
    }
    if (!changesPrompt.trim()) {
      setError('Please describe the new subject or changes.');
      return;
    }
    setError(null);
    onSubmit(imageUrl, changesPrompt, weight);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">1. Upload Thumbnail to Recreate</label>
        <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            htmlFor="recreate-image-upload" 
            className="w-full h-40 p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700/50"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Recreation preview" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
            </div>
          )}
        </label>
        <input
            id="recreate-image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="recreate-changes" className="block text-sm font-semibold text-gray-400 mb-1">2. Describe New Subject or Changes</label>
        <textarea
          id="recreate-changes"
          value={changesPrompt}
          onChange={(e) => setChangesPrompt(e.target.value)}
          placeholder="e.g., A person with a shocked expression, a video about space exploration..."
          className="w-full h-24 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
          disabled={isLoading}
          aria-label="New subject or changes"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">3. Inspiration Weight:</h3>
        <div className="flex items-center gap-2">
            {(['Low', 'Medium', 'High'] as InspirationWeight[]).map((w) => (
                <button
                    type="button"
                    key={w}
                    onClick={() => setWeight(w)}
                    disabled={isLoading}
                    className={`
                        px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex-1
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${weight === w
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                    `}
                >
                    {w}
                </button>
            ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <button
        type="submit"
        disabled={isLoading || !imageUrl || !changesPrompt.trim()}
        className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 mt-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Recreating...
          </>
        ) : (
          'Recreate Thumbnail'
        )}
      </button>
    </form>
  );
};

export default RecreateThumbnailGenerator;
