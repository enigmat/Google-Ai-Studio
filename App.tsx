import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateImageFromPrompt, enhancePrompt, editImage, removeBackground, upscaleImage, expandImage, generateImageFromReference, generateUgcProductAd, generateVideoFromPrompt, generateVideoFromImage, generateImageMetadata, getPromptInspiration, generatePromptFromImage, imageAction, removeObject, generateProductScene, generateTshirtMockup, generateBlogPost } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import ErrorMessage from './components/ErrorMessage';
import ExamplePrompts from './components/ExamplePrompts';
import Footer from './components/Footer';
import ImageCountSelector from './components/ImageCountSelector';
import SavedGallery, { SavedImage } from './components/SavedGallery';
import StyleSelector from './components/StyleSelector';
import AspectRatioSelector from './components/AspectRatioSelector';
import DownloadModal from './components/DownloadModal';
import EditModal from './components/EditModal';
import ExpandModal from './components/ExpandModal';
import ReferenceImageDisplay from './components/ReferenceImageDisplay';
import { STYLES, ASPECT_RATIOS, VIDEO_STYLES } from './constants';
import ModeSelector from './components/ModeSelector';
import UgcAdGenerator from './components/UgcAdGenerator';
import VideoGenerator from './components/VideoGenerator';
import VideoDisplay from './components/VideoDisplay';
import ImageToVideoGenerator from './components/ImageToVideoGenerator';
import VideoDurationSelector from './components/VideoDurationSelector';
import VideoStyleSelector from './components/VideoStyleSelector';
import AIAvatar from './components/AIAvatar';
import ImageToPromptGenerator from './components/ImageToPromptGenerator';
import CreativeChat from './components/CreativeChat';
import ProductStudio from './components/ProductStudio';
import TshirtMockupGenerator from './components/TshirtMockupGenerator';
import BlogPostGenerator from './components/BlogPostGenerator';
import BlogPostDisplay from './components/BlogPostDisplay';

type AspectRatio = typeof ASPECT_RATIOS[number];
type GeneratorMode = 'text-to-image' | 'ugc-ad' | 'text-to-video' | 'animate-image' | 'image-to-prompt' | 'creative-chat' | 'product-studio' | 'tshirt-mockup' | 'blog-post';

const GroundingSourcesDisplay: React.FC<{ sources: any[] }> = ({ sources }) => (
    <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Enhanced with information from:</h4>
        <ul className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
                <li key={index}>
                    <a href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full hover:bg-blue-900">
                        {source.web?.title || new URL(source.web.uri).hostname}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(4);
  const [videoStyle, setVideoStyle] = useState<string>('None');
  const [imageCount, setImageCount] = useState<number>(1);
  const [selectedStyle, setSelectedStyle] = useState<string>('None');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isInspiring, setIsInspiring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [mode, setMode] = useState<GeneratorMode>('text-to-image');
  const [sourceImageForVideo, setSourceImageForVideo] = useState<string | null>(null);
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
  const [groundingSources, setGroundingSources] = useState<any[] | null>(null);
  const [inspirationPrompts, setInspirationPrompts] = useState<string[]>([]);
  // Creative Chat state
  const [chatImage, setChatImage] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  // Blog Post state
  const [blogPostContent, setBlogPostContent] = useState<string | null>(null);
  
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; imageUrl: string | null }>({
    isOpen: false,
    imageUrl: null,
  });
  const [editModalInfo, setEditModalInfo] = useState<{ isOpen: boolean; imageUrl: string | null; mode: 'inpaint' | 'remove' }>({
    isOpen: false,
    imageUrl: null,
    mode: 'inpaint',
  });
  const [expandModalInfo, setExpandModalInfo] = useState<{ isOpen: boolean; imageUrl: string | null }>({
    isOpen: false,
    imageUrl: null,
  });
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);

  const STORAGE_KEY = 'ai-generated-images-v2';

  useEffect(() => {
    try {
      const savedImagesJson = localStorage.getItem(STORAGE_KEY);
      if (savedImagesJson) {
        const parsed = JSON.parse(savedImagesJson);
        // Basic validation to ensure it's the new format
        if (Array.isArray(parsed) && (parsed.length === 0 || (typeof parsed[0] === 'object' && 'url' in parsed[0]))) {
            setSavedImages(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load images from local storage:", err);
      setError("Could not load previously saved images.");
    }
  }, []);
  
  // Cleanup for video blob URLs
  useEffect(() => {
    return () => {
      if (previewVideoUrl && previewVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewVideoUrl);
      }
      if (finalVideoUrl && finalVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(finalVideoUrl);
      }
    };
  }, [previewVideoUrl, finalVideoUrl]);

  const saveConfirmationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleResetChat = () => {
      setChatImage(null);
      setChatHistory([]);
      setError(null);
  };
  
  const handleSetMode = (newMode: GeneratorMode) => {
    if (newMode.endsWith('video') || newMode === 'animate-image' || newMode === 'product-studio' || newMode === 'tshirt-mockup' || newMode === 'blog-post') {
      setImageUrls(null);
    } else {
      setPreviewVideoUrl(null);
      setFinalVideoUrl(null);
      setBlogPostContent(null);
    }
    if (newMode !== 'animate-image') {
      setSourceImageForVideo(null);
    }
    if (mode === 'creative-chat' && newMode !== 'creative-chat') {
      handleResetChat();
    }
    setMode(newMode);
  };

  const handleSuccessfulGeneration = useCallback(async (urls: string[], usedPrompt: string) => {
      setImageUrls(urls);
      
      const showSaveToast = () => {
        if (saveConfirmationTimeoutRef.current) clearTimeout(saveConfirmationTimeoutRef.current);
        setShowSaveConfirmation(true);
        saveConfirmationTimeoutRef.current = setTimeout(() => setShowSaveConfirmation(false), 3000);
      };

      showSaveToast();
      setIsGeneratingMetadata(true);

      try {
        const newSavedImages: SavedImage[] = await Promise.all(urls.map(async (url) => {
            const metadata = await generateImageMetadata(url, usedPrompt);
            return {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                url,
                prompt: usedPrompt,
                ...metadata,
            };
        }));

        setSavedImages(currentSaved => {
            const updatedSaved = [...newSavedImages, ...currentSaved];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSaved));
            } catch (storageError) {
                console.error("Failed to save images to local storage:", storageError);
                setError("Generated images, but couldn't save them. Your local storage might be full.");
            }
            return updatedSaved;
        });

      } catch (metadataError) {
        console.error("Failed to generate metadata:", metadataError);
        setError("Images generated, but failed to create metadata.");
      } finally {
        setIsGeneratingMetadata(false);
      }
  }, []);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setGroundingSources(null);
    setInspirationPrompts([]);

    const style = STYLES.find(s => s.name === selectedStyle);
    const finalPrompt = style && style.promptSuffix ? `${prompt.trim()}${style.promptSuffix}` : prompt.trim();
    
    try {
      let generatedImageUrls: string[];

      if (referenceImageUrl) {
        const resultUrl = await generateImageFromReference(referenceImageUrl, finalPrompt, negativePrompt);
        generatedImageUrls = [resultUrl];
      } else {
        generatedImageUrls = await generateImageFromPrompt(finalPrompt, imageCount, aspectRatio, negativePrompt);
      }
      
      handleSuccessfulGeneration(generatedImageUrls, finalPrompt);

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate image: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, referenceImageUrl, imageCount, selectedStyle, aspectRatio, handleSuccessfulGeneration]);
  
  const handleGenerateUgcAd = useCallback(async (productImageUrl: string, productName: string, productDescription: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    
    const adPrompt = `UGC ad for ${productName}: ${productDescription}`;
    
    try {
      const resultUrl = await generateUgcProductAd(productImageUrl, productName, productDescription);
      handleSuccessfulGeneration([resultUrl], adPrompt);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate UGC ad: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [handleSuccessfulGeneration]);

  const handleGenerateTshirtMockup = useCallback(async (designUrl: string, mockupUrl: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);

    const mockupPrompt = `T-shirt mockup with user-provided design.`;

    try {
        const resultUrl = await generateTshirtMockup(designUrl, mockupUrl);
        handleSuccessfulGeneration([resultUrl], mockupPrompt);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to generate T-shirt mockup: ${message}`);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [handleSuccessfulGeneration]);
  
  const handleGenerateVideo = useCallback(async (videoPrompt: string, isPreview: boolean) => {
    if (!videoPrompt.trim()) {
      setError('Please enter a prompt for the video.');
      return;
    }

    const setLoading = isPreview ? setIsPreviewLoading : setIsLoading;
    const setUrl = isPreview ? setPreviewVideoUrl : setFinalVideoUrl;
    
    setLoading(true);
    setError(null);
    setImageUrls(null);
    setBlogPostContent(null);

    if (isPreview) {
      setPreviewVideoUrl(null);
    } else {
      setFinalVideoUrl(null);
    }
    
    const style = VIDEO_STYLES.find(s => s.name === videoStyle);
    const finalPrompt = style ? `${videoPrompt.trim()}${style.promptSuffix}` : videoPrompt.trim();

    try {
      const resultUrl = await generateVideoFromPrompt(finalPrompt, videoDuration, isPreview);
      setUrl(resultUrl);
      if (isPreview) {
          setFinalVideoUrl(null);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate video: ${message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [videoDuration, videoStyle]);

  const handleGenerateVideoFromImage = useCallback(async (imageUrl: string, motionPrompt: string, isPreview: boolean) => {
    const setLoading = isPreview ? setIsPreviewLoading : setIsLoading;
    const setUrl = isPreview ? setPreviewVideoUrl : setFinalVideoUrl;
    
    setLoading(true);
    setError(null);
    setImageUrls(null);
    setBlogPostContent(null);

    if (isPreview) {
        setPreviewVideoUrl(null);
    } else {
        setFinalVideoUrl(null);
    }

    const style = VIDEO_STYLES.find(s => s.name === videoStyle);
    const finalPrompt = style ? `${motionPrompt.trim()}${style.promptSuffix}` : motionPrompt.trim();

    try {
      const resultUrl = await generateVideoFromImage(imageUrl, finalPrompt, videoDuration, isPreview);
      setUrl(resultUrl);
      if (isPreview) {
          setFinalVideoUrl(null);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate video from image: ${message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [videoDuration, videoStyle]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to enhance.');
      return;
    }
    setIsEnhancing(true);
    setError(null);
    setGroundingSources(null);

    try {
      const response = await enhancePrompt(prompt, useGoogleSearch);
      setPrompt(response.text);
      setGroundingSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to enhance prompt: ${message}`);
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  }, [prompt, useGoogleSearch]);

   const handleGetInspiration = useCallback(async () => {
    setIsInspiring(true);
    setError(null);
    try {
        const prompts = await getPromptInspiration();
        setInspirationPrompts(prompts);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to get inspiration: ${message}`);
        console.error(e);
    } finally {
        setIsInspiring(false);
    }
  }, []);

  const handleImageAction = useCallback(async (action: (...args: any[]) => Promise<string>, ...args: any[]) => {
      setIsLoading(true);
      setError(null);
      setImageUrls(null);
      setFinalVideoUrl(null);
      setPreviewVideoUrl(null);
      setBlogPostContent(null);
      setEditModalInfo({ isOpen: false, imageUrl: null, mode: 'inpaint' });
      setExpandModalInfo({ isOpen: false, imageUrl: null });

      try {
          const resultImageUrl = await action(...args);
          // Pass a generic prompt for metadata generation for actions
          handleSuccessfulGeneration([resultImageUrl], "Image edited or modified");
      } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
          setError(`Failed to perform action on image: ${message}`);
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  }, [handleSuccessfulGeneration]);
  
  const handleGeneratePromptFromImage = useCallback(async (imageUrl: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setGroundingSources(null);
    setInspirationPrompts([]);

    try {
      const generatedPrompt = await generatePromptFromImage(imageUrl);
      setPrompt(generatedPrompt);
      setImageUrls([imageUrl]); // Show the source image as context
      setMode('text-to-image'); // Switch back to T2I mode
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate prompt from image: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);
    
  const handleCreativeChatSubmit = useCallback(async (newPrompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
        let resultUrl: string;
        if (!chatImage) {
            // First turn: generate a new image
            const generatedUrls = await generateImageFromPrompt(newPrompt, 1, '1:1', ''); // Use 1:1 for chat consistency
            resultUrl = generatedUrls[0];
        } else {
            // Subsequent turns: edit the existing image
            resultUrl = await imageAction(chatImage, newPrompt);
        }
        setChatImage(resultUrl);
        setChatHistory(prev => [...prev, newPrompt]);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Creative Chat failed: ${message}`);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [chatImage]);

  const handleGenerateBlogPost = useCallback(async (topic: string, tone: string, length: string, audience: string) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    // Clear other content types
    setImageUrls(null);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    
    try {
      const content = await generateBlogPost(topic, tone, length, audience);
      setBlogPostContent(content);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate blog post: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveChatImage = useCallback(() => {
    if (chatImage && chatHistory.length > 0) {
        const fullPromptHistory = chatHistory.join(' -> ');
        handleSuccessfulGeneration([chatImage], `Chat creation: ${fullPromptHistory}`);
    }
  }, [chatImage, chatHistory, handleSuccessfulGeneration]);

  const handleConfirmEdit = (originalImageUrl: string, maskedImageUrl: string, editPrompt: string) => {
    if (editModalInfo.mode === 'inpaint') {
      const finalPrompt = `In the semi-transparent red masked area, ${editPrompt}. Keep the rest of the image exactly as it is, preserving all details, lighting, and style outside the mask.`;
      handleImageAction(editImage, maskedImageUrl, finalPrompt);
    } else { // mode is 'remove'
      handleImageAction(removeObject, maskedImageUrl);
    }
  };

  const handleConfirmExpand = (originalImageUrl: string, expandedCanvasUrl: string, expandPrompt: string) => {
    let finalPrompt = `Expand the original image to fill the transparent areas.`;
    if(expandPrompt.trim()) {
        finalPrompt += ` Use the following prompt as creative guidance for the new areas: "${expandPrompt.trim()}".`;
    }
    finalPrompt += ` Ensure the new areas seamlessly blend with the original image in terms of style, lighting, and content.`;
    handleImageAction(expandImage, expandedCanvasUrl, finalPrompt);
  };

  const handleRemoveBackground = (imageUrl: string) => {
    handleImageAction(removeBackground, imageUrl);
  };

  const handleUpscaleImage = (imageUrl: string) => {
    handleImageAction(upscaleImage, imageUrl);
  };

  const handleAnimateImage = (imageUrl: string) => {
    setSourceImageForVideo(imageUrl);
    handleSetMode('animate-image');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setInspirationPrompts([]);
    setGroundingSources(null);
  };

  const handleDeleteSavedImage = (indexToDelete: number) => {
    const updatedImages = savedImages.filter((_, index) => index !== indexToDelete);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
      setSavedImages(updatedImages);
    } catch (storageError) {
      console.error("Failed to update local storage:", storageError);
      setError("Could not delete the image from storage.");
    }
  };

  const handleClearAllSavedImages = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSavedImages([]);
    } catch (storageError) {
      console.error("Failed to clear local storage:", storageError);
      setError("Could not clear all saved images from storage.");
    }
  };
  
  const handleOpenDownloadModal = (imageUrl: string) => {
    setModalInfo({ isOpen: true, imageUrl });
  };

  const handleCloseDownloadModal = () => {
    setModalInfo({ isOpen: false, imageUrl: null });
  };

  const handleOpenEditModal = (imageUrl: string) => {
    setEditModalInfo({ isOpen: true, imageUrl, mode: 'inpaint' });
  };

  const handleOpenRemoveModal = (imageUrl: string) => {
    setEditModalInfo({ isOpen: true, imageUrl, mode: 'remove' });
  };

  const handleCloseEditModal = () => {
    setEditModalInfo({ isOpen: false, imageUrl: null, mode: 'inpaint' });
  };
  
  const handleOpenExpandModal = (imageUrl: string) => {
    setExpandModalInfo({ isOpen: true, imageUrl });
  };

  const handleCloseExpandModal = () => {
    setExpandModalInfo({ isOpen: false, imageUrl: null });
  };

  const handleSetReferenceImage = (imageUrl: string) => {
    setReferenceImageUrl(imageUrl);
    setMode('text-to-image'); // Switch to T2I mode when a reference is set
  };

  const handleClearReferenceImage = () => {
    setReferenceImageUrl(null);
  };
  
  const isDisplayingContent = !!imageUrls || !!previewVideoUrl || !!finalVideoUrl || !!chatImage || !!blogPostContent;
  const isVideoMode = mode === 'text-to-video' || mode === 'animate-image';
  const isAnyVideoLoading = isLoading || isPreviewLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
        }}
      ></div>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-slow {
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        /* Custom Range Slider */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        input[type="range"]:disabled {
          cursor: not-allowed;
        }
        /* Webkit Track */
        input[type="range"]::-webkit-slider-runnable-track {
          background: #374151; /* gray-700 */
          height: 0.5rem;
          border-radius: 0.5rem;
        }
        /* Webkit Thumb */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -6px; /* Center thumb */
          background-color: #6366f1; /* indigo-500 */
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          border: 2px solid white;
          transition: background-color 150ms ease-in-out;
        }
        input[type="range"]:hover:not(:disabled)::-webkit-slider-thumb {
          background-color: #818cf8; /* indigo-400 */
        }
        input[type="range"]:disabled::-webkit-slider-thumb {
          background-color: #4f46e5; /* indigo-600 */
          opacity: 0.7;
        }
        /* Firefox Track */
        input[type="range"]::-moz-range-track {
          background: #374151; /* gray-700 */
          height: 0.5rem;
          border-radius: 0.5rem;
        }
        /* Firefox Thumb */
        input[type="range"]::-moz-range-thumb {
          background-color: #6366f1; /* indigo-500 */
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          border: 2px solid white;
          transition: background-color 150ms ease-in-out;
        }
        input[type="range"]:hover:not(:disabled)::-moz-range-thumb {
          background-color: #818cf8; /* indigo-400 */
        }
        input[type="range"]:disabled::-moz-range-thumb {
          background-color: #4f46e5; /* indigo-600 */
          opacity: 0.7;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 flex flex-col gap-6">
            
            <ModeSelector mode={mode} setMode={handleSetMode} />

            {mode === 'text-to-image' && (
              <>
                <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">Describe the image you want to create</h2>
                {referenceImageUrl && (
                  <ReferenceImageDisplay 
                    imageUrl={referenceImageUrl}
                    onClear={handleClearReferenceImage}
                  />
                )}
                <PromptInput
                  prompt={prompt}
                  setPrompt={setPrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  onSubmit={handleGenerateImage}
                  onEnhance={handleEnhancePrompt}
                  onInspire={handleGetInspiration}
                  isLoading={isLoading}
                  isEnhancing={isEnhancing}
                  isInspiring={isInspiring}
                  useGoogleSearch={useGoogleSearch}
                  setUseGoogleSearch={setUseGoogleSearch}
                  inspirationPrompts={inspirationPrompts}
                />
                {groundingSources && <GroundingSourcesDisplay sources={groundingSources} />}
                <ImageCountSelector
                  count={imageCount}
                  setCount={setImageCount}
                  isLoading={isLoading || isEnhancing || !!referenceImageUrl}
                  isReferenceActive={!!referenceImageUrl}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <StyleSelector
                    selectedStyle={selectedStyle}
                    setSelectedStyle={setSelectedStyle}
                    isLoading={isLoading || isEnhancing}
                  />
                  <AspectRatioSelector
                    selectedAspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    isLoading={isLoading || isEnhancing || !!referenceImageUrl}
                    isReferenceActive={!!referenceImageUrl}
                  />
                </div>
                <ExamplePrompts onSelectPrompt={handleSelectPrompt} isLoading={isLoading || isEnhancing} />
              </>
            )}
            
            {mode === 'creative-chat' && (
              <>
                <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">Creative Chat</h2>
                <CreativeChat
                  onSubmit={handleCreativeChatSubmit}
                  onSave={handleSaveChatImage}
                  onReset={handleResetChat}
                  chatHistory={chatHistory}
                  currentImage={chatImage}
                  isLoading={isLoading}
                />
              </>
            )}

            {mode === 'blog-post' && (
              <>
                <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">Blog Post Generator</h2>
                <BlogPostGenerator
                  onSubmit={handleGenerateBlogPost}
                  isLoading={isLoading}
                />
              </>
            )}

            {mode === 'product-studio' && (
              <>
                 <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">AI Product Studio</h2>
                 <ProductStudio 
                    removeBackground={removeBackground}
                    generateProductScene={generateProductScene}
                    onGenerationComplete={handleSuccessfulGeneration}
                    setIsLoading={setIsLoading}
                    setError={setError}
                 />
              </>
            )}

            {mode === 'tshirt-mockup' && (
              <>
                 <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">T-shirt Mockup Studio</h2>
                 <TshirtMockupGenerator 
                    onSubmit={handleGenerateTshirtMockup}
                    isLoading={isLoading}
                 />
              </>
            )}

            {mode === 'ugc-ad' && (
              <>
                 <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">Create a UGC Product Ad</h2>
                 <UgcAdGenerator 
                    onSubmit={handleGenerateUgcAd}
                    isLoading={isLoading}
                 />
              </>
            )}

            {mode === 'text-to-video' && (
              <>
                 <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">Describe the video you want to create</h2>
                 <VideoGenerator 
                    onSubmit={handleGenerateVideo}
                    isLoading={isLoading}
                    isPreviewLoading={isPreviewLoading}
                    hasPreview={!!previewVideoUrl}
                 />
                 <VideoStyleSelector
                    selectedStyle={videoStyle}
                    setSelectedStyle={setVideoStyle}
                    isLoading={isAnyVideoLoading}
                 />
                 <VideoDurationSelector 
                    duration={videoDuration}
                    setDuration={setVideoDuration}
                    isLoading={isAnyVideoLoading}
                 />
              </>
            )}
            
            {mode === 'animate-image' && (
              <>
                 <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">Animate Your Image</h2>
                 <ImageToVideoGenerator 
                    onSubmit={handleGenerateVideoFromImage}
                    isLoading={isLoading}
                    isPreviewLoading={isPreviewLoading}
                    hasPreview={!!previewVideoUrl}
                    initialImageUrl={sourceImageForVideo}
                 />
                 <VideoStyleSelector
                    selectedStyle={videoStyle}
                    setSelectedStyle={setVideoStyle}
                    isLoading={isAnyVideoLoading}
                 />
                 <VideoDurationSelector 
                    duration={videoDuration}
                    setDuration={setVideoDuration}
                    isLoading={isAnyVideoLoading}
                 />
              </>
            )}
            
            {mode === 'image-to-prompt' && (
              <>
                 <h2 className="text-2xl font-bold text-center lg:text-left text-indigo-400">Generate a Prompt from an Image</h2>
                 <ImageToPromptGenerator 
                    onSubmit={handleGeneratePromptFromImage}
                    isLoading={isLoading}
                 />
              </>
            )}

            {error && <ErrorMessage message={error} />}
          </div>
          <div className="lg:w-1/2">
            {isVideoMode ? (
              <VideoDisplay
                previewVideoUrl={previewVideoUrl}
                finalVideoUrl={finalVideoUrl}
                isLoading={isLoading}
                isPreviewLoading={isPreviewLoading}
              />
            ) : mode === 'creative-chat' ? (
              <ImageDisplay
                imageUrls={chatImage ? [chatImage] : null}
                isLoading={isLoading}
                aspectRatio="1:1"
                hideActions={true}
                onDownloadClick={() => {}} // Dummy handlers
                onEditClick={() => {}}
                onRemoveObjectClick={() => {}}
                onExpandClick={() => {}}
                onRemoveBackground={() => {}}
                onUpscale={() => {}}
                onAnimateClick={() => {}}
              />
            ) : mode === 'blog-post' ? (
                <BlogPostDisplay
                    content={blogPostContent}
                    isLoading={isLoading}
                />
            ) : (
              <ImageDisplay 
                imageUrls={imageUrls} 
                isLoading={isLoading} 
                aspectRatio={aspectRatio}
                onDownloadClick={handleOpenDownloadModal}
                onEditClick={handleOpenEditModal}
                onRemoveObjectClick={handleOpenRemoveModal}
                onExpandClick={handleOpenExpandModal}
                onRemoveBackground={handleRemoveBackground}
                onUpscale={handleUpscaleImage}
                onAnimateClick={handleAnimateImage}
              />
            )}
          </div>
        </div>
      </main>

      {mode !== 'text-to-video' && mode !== 'animate-image' && mode !== 'image-to-prompt' && mode !== 'creative-chat' && mode !== 'blog-post' && (
        <section className="w-full max-w-7xl mx-auto p-4 z-10">
          <SavedGallery
            images={savedImages}
            onDeleteImage={handleDeleteSavedImage}
            onClearAll={handleClearAllSavedImages}
            onDownloadClick={handleOpenDownloadModal}
            onEditClick={handleOpenEditModal}
            onRemoveObjectClick={handleOpenRemoveModal}
            onExpandClick={handleOpenExpandModal}
            onRemoveBackground={handleRemoveBackground}
            onUpscale={handleUpscaleImage}
            onSetReference={handleSetReferenceImage}
            showSaveConfirmation={showSaveConfirmation}
            isGeneratingMetadata={isGeneratingMetadata}
          />
        </section>
      )}
      
      <Footer />
      
      <DownloadModal
        isOpen={modalInfo.isOpen}
        imageUrl={modalInfo.imageUrl}
        onClose={handleCloseDownloadModal}
      />

      <EditModal
        isOpen={editModalInfo.isOpen}
        imageUrl={editModalInfo.imageUrl}
        onClose={handleCloseEditModal}
        onConfirmEdit={handleConfirmEdit}
        isLoading={isLoading}
        mode={editModalInfo.mode}
      />
      
      <ExpandModal
        isOpen={expandModalInfo.isOpen}
        imageUrl={expandModalInfo.imageUrl}
        onClose={handleCloseExpandModal}
        onConfirmExpand={handleConfirmExpand}
        isLoading={isLoading}
      />

      <AIAvatar
        mode={mode}
        error={error}
        isLoading={isLoading}
        isPreviewLoading={isPreviewLoading}
      />
    </div>
  );
};

export default App;