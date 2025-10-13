import React, { useState, useCallback } from 'react';

interface LipSyncGeneratorProps {
  onSubmit: (imageUrl: string, audioFile: File) => void;
  isLoading: boolean;
}

const LipSyncGenerator: React.FC<LipSyncGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.).');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.onerror = () => setError("Failed to read the image file.");
      reader.readAsDataURL(file);
    }
  };

  const handleAudioFileChange = (files: FileList | null) => {
    if (files && files[0]) {
        const file = files[0];
        if (!file.type.startsWith('audio/')) {
            setError('Please upload a valid audio file (MP3, WAV, etc.).');
            return;
        }
        setError(null);
        setAudioFile(file);
    }
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleImageDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleImageFileChange(event.dataTransfer.files);
  }, []);

  const handleAudioDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleAudioFileChange(event.dataTransfer.files);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please upload an image.');
      return;
    }
    if (!audioFile) {
        setError('Please upload an audio file.');
        return;
    }
    setError(null);
    onSubmit(imageUrl, audioFile);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">1. Upload Character Image</label>
            <label
                onDragOver={handleDragOver}
                onDrop={handleImageDrop}
                htmlFor="lipsync-image-upload" 
                className="w-full h-40 p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700/50"
            >
            {imageUrl ? (
                <img src={imageUrl} alt="Character preview" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
                <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
                </div>
            )}
            </label>
            <input
                id="lipsync-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e.target.files)}
                className="hidden"
                disabled={isLoading}
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">2. Upload Audio File</label>
             <label
                onDragOver={handleDragOver}
                onDrop={handleAudioDrop}
                htmlFor="lipsync-audio-upload"
                className={`w-full p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white transition-all duration-300 flex items-center justify-center
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
            >
                {audioFile ? (
                    <div className="text-center text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <p className="mt-2 text-sm font-semibold truncate max-w-xs">{audioFile.name}</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" /></svg>
                        <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
                    </div>
                )}
            </label>
            <input
                id="lipsync-audio-upload"
                type="file"
                accept=".mp3,.wav,audio/*"
                onChange={(e) => handleAudioFileChange(e.target.files)}
                className="hidden"
                disabled={isLoading}
            />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      
        <button
            type="submit"
            disabled={isLoading || !imageUrl || !audioFile}
            className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 mt-2"
        >
            {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Generating Video...
            </>
            ) : (
                'Generate Lip Sync Video'
            )}
        </button>
    </form>
  );
};

export default LipSyncGenerator;
