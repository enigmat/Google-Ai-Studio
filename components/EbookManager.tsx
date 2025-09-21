
import React, { useState, useCallback } from 'react';

interface EbookManagerProps {
  onPdfUpload: (url: string) => void;
  uploadedPdfUrl: string | null;
}

const EbookManager: React.FC<EbookManagerProps> = ({ onPdfUpload, uploadedPdfUrl }) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        setFileName(null);
        return;
      }
      setError(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        onPdfUpload(reader.result as string);
      };
      reader.onerror = () => {
        setError("Failed to read the PDF file.");
        setFileName(null);
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

  return (
    <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-400">Upload an existing ebook in PDF format to make it available for download.</p>
        <div>
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                htmlFor="ebook-pdf-upload" 
                className={`w-full h-48 p-3 bg-gray-800 border-2 border-dashed rounded-lg text-white transition-all duration-300 flex items-center justify-center cursor-pointer ${uploadedPdfUrl ? 'border-green-500 hover:bg-gray-800' : 'border-gray-700 hover:bg-gray-700/50 focus-within:ring-2 focus-within:ring-indigo-500'}`}
            >
            {uploadedPdfUrl ? (
                <div className="text-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="mt-2 text-lg font-semibold">Upload Successful!</p>
                    <p className="text-sm font-mono truncate max-w-xs">{fileName}</p>
                    <p className="text-xs mt-2">You can now download it from the display on the right.</p>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
                    <p className="text-xs">PDF files only</p>
                </div>
            )}
            </label>
            <input
                id="ebook-pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
            />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default EbookManager;
