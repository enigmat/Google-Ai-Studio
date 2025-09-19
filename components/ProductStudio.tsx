import React, { useState, useCallback, useEffect } from 'react';

interface ProductStudioProps {
  removeBackground: (imageUrl: string) => Promise<string>;
  generateProductScene: (productUrl: string, scenePrompt: string) => Promise<string>;
  onGenerationComplete: (urls: string[], usedPrompt: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const ProductStudio: React.FC<ProductStudioProps> = ({ removeBackground, generateProductScene, onGenerationComplete, setIsLoading, setError }) => {
    const [step, setStep] = useState<'upload' | 'compose'>('upload');
    const [originalImages, setOriginalImages] = useState<string[]>([]);
    const [isolatedImages, setIsolatedImages] = useState<string[]>([]);
    const [scenePrompt, setScenePrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // For background removal

    useEffect(() => {
        const processImages = async () => {
            if (originalImages.length > 0) {
                setIsProcessing(true);
                setError(null);
                try {
                    const results = await Promise.all(originalImages.map(img => removeBackground(img)));
                    setIsolatedImages(results);
                    setStep('compose');
                } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
                    setError(`Failed to remove background: ${message}`);
                    setStep('upload');
                    setOriginalImages([]);
                } finally {
                    setIsProcessing(false);
                }
            }
        };
        processImages();
    }, [originalImages, removeBackground, setError]);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length === 0) {
                 setError('Please upload valid image files (PNG, JPG, etc.).');
                 return;
            }
            setError(null);

            const readers = imageFiles.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error("Failed to read the image file."));
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers)
                .then(setOriginalImages)
                .catch(err => setError(err.message));
        }
    };

    const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => event.preventDefault(), []);
    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        handleFileChange(event.dataTransfer.files);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isolatedImages.length === 0 || !scenePrompt.trim()) {
            setError('Please ensure you have isolated images and a scene description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const results = await Promise.all(
                isolatedImages.map(img => generateProductScene(img, scenePrompt))
            );
            onGenerationComplete(results, `Product shot batch: ${scenePrompt}`);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
            setError(`Failed to generate product scene: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setStep('upload');
        setOriginalImages([]);
        setIsolatedImages([]);
        setScenePrompt('');
        setError(null);
    };

    const checkerboardBg = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' size='32' fill-opacity='0.1'%3e%3cpath d='M0 0 H16 V16 H0 Z' fill='rgb(107 114 128)'/%3e%3cpath d='M16 16 H32 V32 H16 Z' fill='rgb(107 114 128)'/%3e%3c/svg%3e")`;


    return (
        <div className="flex flex-col gap-4">
            {step === 'upload' && (
                <div>
                    <label
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        htmlFor="product-image-upload"
                        className="w-full h-48 p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700/50"
                    >
                        {isProcessing ? (
                             <div className="text-center">
                                <svg className="animate-spin mx-auto h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="mt-2 text-sm font-semibold text-gray-400">Removing background for {originalImages.length} image(s)...</p>
                             </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <p className="mt-2 text-sm font-semibold">Upload Product Image(s)</p>
                                <p className="text-xs">Click to upload or drag & drop</p>
                            </div>
                        )}
                    </label>
                    <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                        disabled={isProcessing}
                        multiple
                    />
                </div>
            )}

            {step === 'compose' && isolatedImages.length > 0 && (
                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400 font-semibold">Step 2: Describe the scene for {isolatedImages.length} image(s)</p>
                        <button type="button" onClick={handleReset} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">&larr; Use other images</button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 h-48 p-2 bg-gray-800 border-2 border-gray-700 rounded-lg overflow-y-auto" style={{ backgroundImage: checkerboardBg }}>
                         {isolatedImages.map((img, index) => (
                            <img key={index} src={img} alt={`Isolated product ${index + 1}`} className="w-full h-full object-contain bg-white/5 rounded-md aspect-square" />
                         ))}
                    </div>
                    <textarea
                        value={scenePrompt}
                        onChange={(e) => setScenePrompt(e.target.value)}
                        placeholder="e.g., On a clean marble countertop next to a small plant..."
                        className="w-full h-24 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                        aria-label="Scene Description"
                        required
                    />
                    <button
                        type="submit"
                        disabled={!scenePrompt.trim()}
                        className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2.586l-1.707-1.707a1 1 0 00-1.414 0L7 14.586V9a1 1 0 00-2 0v6.586l-1.293-1.293a1 1 0 00-1.414 1.414L4.586 17H5V5zm10 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                        Generate Scenes
                    </button>
                 </form>
            )}
        </div>
    );
};

export default ProductStudio;
