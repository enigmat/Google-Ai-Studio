


import React, { useState, useCallback, useEffect, useRef } from 'react';
// FIX: Added all missing function and type imports from geminiService to resolve compilation errors.
import { generateImageFromPrompt, enhancePrompt, imageAction, generateImageFromReference, generateVideoFromPrompt, generateVideoFromImage, SocialMediaPost, VideoScene, MusicVideoScene, generateImageMetadata, getPromptInspiration, generatePromptFromImage, generateUgcProductAd, generateProductScene, generateMockup, generateBlogPost, generateSocialMediaPost, generateVideoScriptFromText, generateMusicVideoScript } from './services/geminiService';
import { saveImageToAirtable, AirtableConfig, getRandomPromptFromAirtable, getPromptsFromAirtable, updateAirtableRecord } from './services/airtableService';
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
import { STYLES, ASPECT_RATIOS, VIDEO_STYLES, GeneratorMode, THUMBNAIL_STYLES } from './constants';
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
import MockupGenerator from './components/TshirtMockupGenerator';
import BlogPostGenerator from './components/BlogPostGenerator';
import BlogPostDisplay from './components/BlogPostDisplay';
import AvatarGenerator from './components/AvatarGenerator';
import AirtableSettingsModal from './components/AirtableSettingsModal';
import AirtablePromptLibraryModal from './components/AirtablePromptLibraryModal';
import Toast from './components/Toast';
import SocialMediaPostGenerator from './components/SocialMediaPostGenerator';
import SocialMediaPostDisplay from './components/SocialMediaPostDisplay';
import VariationCountSelector from './components/VariationCountSelector';
import FlyerGenerator from './components/FlyerGenerator';
import ExplainerVideoGenerator from './components/ExplainerVideoGenerator';
import ExplainerVideoDisplay from './components/ExplainerVideoDisplay';
import LogoGenerator from './components/LogoGenerator';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import RecreateThumbnailGenerator from './components/RecreateThumbnailGenerator';
import MusicVideoGenerator from './components/MusicVideoGenerator';
import MusicVideoDisplay from './components/MusicVideoDisplay';
// FIX: Removed EbookStudio and EbookDisplay imports as the feature has been disabled.
// import EbookStudio from './components/EbookStudio';
// import EbookDisplay from './components/EbookDisplay';


type AspectRatio = typeof ASPECT_RATIOS[number];
type ToastState = { show: boolean; message: string; type: 'success' | 'error' };
type StoryboardScene = VideoScene & { videoUrl?: string };
type InspirationWeight = 'Low' | 'Medium' | 'High';

const GroundingSourcesDisplay: React.FC<{ sources: any[] }> = ({ sources }) => (
    <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Enhanced with information from:</h4>
        <ul className="flex flex-wrap gap-2">
            {sources.map((source, index) => {
                const uri = source.web?.uri;
                if (!uri) return null; // Skip rendering if no URI is provided
                const title = source.web?.title || new URL(uri).hostname;
                return (
                    <li key={index}>
                        <a href={uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full hover:bg-blue-900">
                            {title}
                        </a>
                    </li>
                );
            })}
        </ul>
    </div>
);

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [promptBeforeEnhance, setPromptBeforeEnhance] = useState<string | null>(null);
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[] | null>(null);
  const [generatedImagesData, setGeneratedImagesData] = useState<SavedImage[]>([]);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(4);
  const [videoStyle, setVideoStyle] = useState<string>('None');
  const [imageCount, setImageCount] = useState<number>(1);
  const [variationCount, setVariationCount] = useState<number>(4);
  const [selectedStyle, setSelectedStyle] = useState<string>('None');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isInspiring, setIsInspiring] = useState<boolean>(false);
  const [isFetchingFromAirtable, setIsFetchingFromAirtable] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [mode, setMode] = useState<GeneratorMode>('text-to-image');
  const [sourceImageForVideo, setSourceImageForVideo] = useState<string | null>(null);
  const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
  const [groundingSources, setGroundingSources] = useState<any[] | null>(null);
  const [inspirationPrompts, setInspirationPrompts] = useState<string[]>([]);
  // Video state
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  // Creative Chat state
  const [chatImage, setChatImage] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  // Blog Post state
  const [blogPostContent, setBlogPostContent] = useState<string | null>(null);
  // Social Media state
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[] | null>(null);
  // Explainer video state
  const [videoStoryboard, setVideoStoryboard] = useState<StoryboardScene[] | null>(null);
  const [explainerVideoProgress, setExplainerVideoProgress] = useState<string>('');
  // Music video state
  const [musicVideoStoryboard, setMusicVideoStoryboard] = useState<MusicVideoScene[] | null>(null);
  // Airtable state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const [airtableConfig, setAirtableConfig] = useState<AirtableConfig | null>(null);
  const [airtableRecord, setAirtableRecord] = useState<{id: string, synced: boolean} | null>(null);
  const [isSyncingAirtable, setIsSyncingAirtable] = useState<boolean>(false);
  const [savingToAirtableState, setSavingToAirtableState] = useState<{ status: 'idle' | 'saving'; imageId: string | null }>({ status: 'idle', imageId: null });
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  
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
  const AIRTABLE_CONFIG_KEY = 'airtable-config';

  useEffect(() => {
    try {
      const savedImagesJson = localStorage.getItem(STORAGE_KEY);
      if (savedImagesJson) {
        const parsed = JSON.parse(savedImagesJson);
        if (Array.isArray(parsed) && (parsed.length === 0 || (typeof parsed[0] === 'object' && 'url' in parsed[0]))) {
            setSavedImages(parsed);
        }
      }
      const airtableConfigJson = localStorage.getItem(AIRTABLE_CONFIG_KEY);
      if (airtableConfigJson) {
          setAirtableConfig(JSON.parse(airtableConfigJson));
      }
    } catch (err) {
      console.error("Failed to load data from local storage:", err);
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
      // Also clean up storyboard URLs
      if (videoStoryboard) {
        videoStoryboard.forEach(scene => {
          if (scene.videoUrl && scene.videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(scene.videoUrl);
          }
        });
      }
    };
  }, [previewVideoUrl, finalVideoUrl, videoStoryboard]);

  const saveConfirmationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error', duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), duration);
  };

  const handleResetChat = () => {
      setChatImage(null);
      setChatHistory([]);
      setError(null);
  };
  
  const handleSetMode = (newMode: GeneratorMode) => {
    const isNewModeTextual = ['blog-post', 'social-media-post'].includes(newMode);
    const isNewModeVideo = newMode.endsWith('video') || newMode === 'animate-image' || newMode === 'video-green-screen';
    
    // FIX: Changed 'mockups' to 'tshirt-mockup' to match GeneratorMode type.
    if (isNewModeTextual || isNewModeVideo || ['product-studio', 'tshirt-mockup', 'avatar-generator', 'flyer-generator', 'logo-generator', 'thumbnail-generator', 'recreate-thumbnail', 'music-video'].includes(newMode)) {
      setImageUrls(null);
      setGeneratedImagesData([]);
    }
    if (!isNewModeVideo) {
      setPreviewVideoUrl(null);
      setFinalVideoUrl(null);
    }
    if (!isNewModeTextual) {
      setBlogPostContent(null);
      setSocialMediaPosts(null);
    }
    if (newMode !== 'explainer-video') {
      setVideoStoryboard(null);
      setExplainerVideoProgress('');
    }
    if (newMode !== 'music-video') {
      setMusicVideoStoryboard(null);
    }

    if (newMode === 'avatar-generator' || newMode === 'flyer-generator') {
      setAspectRatio('9:16');
    }
    if (newMode === 'logo-generator') {
        setAspectRatio('1:1');
    }
    if (newMode === 'thumbnail-generator' || newMode === 'recreate-thumbnail') {
        setAspectRatio('16:9');
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
      setGeneratedImagesData([]);
      
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
                originalPrompt: promptBeforeEnhance,
                ...metadata,
            };
        }));

        setGeneratedImagesData(newSavedImages);
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
  }, [promptBeforeEnhance]);

  const handleGenerateImage = useCallback(async (countOverride?: number) => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);

    const style = STYLES.find(s => s.name === selectedStyle);
    const finalPrompt = style && style.promptSuffix ? `${prompt.trim()}${style.promptSuffix}` : prompt.trim();
    const countToUse = typeof countOverride === 'number' ? countOverride : imageCount;

    try {
      let generatedImageUrls: string[];

      if (referenceImageUrl) {
        const resultUrl = await generateImageFromReference(referenceImageUrl, finalPrompt, negativePrompt);
        generatedImageUrls = [resultUrl];
      } else {
        generatedImageUrls = await generateImageFromPrompt(finalPrompt, countToUse, aspectRatio, negativePrompt);
      }
      
      handleSuccessfulGeneration(generatedImageUrls, finalPrompt);

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate image: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setPromptBeforeEnhance(null);
    }
  }, [prompt, negativePrompt, referenceImageUrl, imageCount, selectedStyle, aspectRatio, handleSuccessfulGeneration]);
  
  const handleGenerateAvatar = useCallback(async (avatarPrompt: string, refImageUrl: string | null) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);

    try {
      let generatedImageUrls: string[];
      if (refImageUrl) {
        // Avatars are always 1 image, so no negative prompt is needed as context is primary
        const resultUrl = await generateImageFromReference(refImageUrl, avatarPrompt, '', 'avatar');
        generatedImageUrls = [resultUrl];
      } else {
        // Avatars are always 1 image at 1:1
        generatedImageUrls = await generateImageFromPrompt(avatarPrompt, 1, '1:1', '');
      }
      handleSuccessfulGeneration(generatedImageUrls, avatarPrompt);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate avatar: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setPromptBeforeEnhance(null);
    }
  }, [handleSuccessfulGeneration]);

  const handleGenerateUgcAd = useCallback(async (productImageUrl: string, productName: string, productDescription: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    
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
      setPromptBeforeEnhance(null);
    }
  }, [handleSuccessfulGeneration]);

  const handleGenerateMockup = useCallback(async (designUrl: string, mockupUrl: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);

    const mockupPrompt = `T-shirt mockup with user-provided design.`;

    try {
        const resultUrl = await generateMockup(designUrl, mockupUrl);
        handleSuccessfulGeneration([resultUrl], mockupPrompt);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to generate mockup: ${message}`);
        console.error(e);
    } finally {
        setIsLoading(false);
        setPromptBeforeEnhance(null);
    }
  }, [handleSuccessfulGeneration]);
  
  const handleGenerateVideo = useCallback(async (isPreview: boolean) => {
    if (!videoPrompt.trim()) {
      setError('Please enter a prompt for the video.');
      return;
    }

    const setLoading = isPreview ? setIsPreviewLoading : setIsLoading;
    const setUrl = isPreview ? setPreviewVideoUrl : setFinalVideoUrl;
    
    setLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);

    if (isPreview) {
      setPreviewVideoUrl(null);
    } else {
      setFinalVideoUrl(null);
    }
    
    const style = VIDEO_STYLES.find(s => s.name === videoStyle);
    let finalPrompt = style ? `${videoPrompt.trim()}${style.promptSuffix}` : videoPrompt.trim();

    if (mode === 'video-green-screen') {
        finalPrompt = `${finalPrompt}, on a solid green screen background, professional studio lighting, high quality`;
    }

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
  }, [videoPrompt, videoDuration, videoStyle, mode]);

  const handleGenerateVideoFromImage = useCallback(async (imageUrl: string, motionPrompt: string, isPreview: boolean) => {
    const setLoading = isPreview ? setIsPreviewLoading : setIsLoading;
    const setUrl = isPreview ? setPreviewVideoUrl : setFinalVideoUrl;
    
    setLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);

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

  const handleEnhance = useCallback(async (promptToEnhance: string, setPromptFn: (newPrompt: string) => void) => {
    if (!promptToEnhance.trim()) {
      setError('Please enter a prompt to enhance.');
      return;
    }
    setIsEnhancing(true);
    setError(null);
    setGroundingSources(null);
    setAirtableRecord(null);

    try {
      const response = await enhancePrompt(promptToEnhance, useGoogleSearch);
      setPromptFn(response.text);
      setGroundingSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to enhance prompt: ${message}`);
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  }, [useGoogleSearch]);
  
  const handleEnhancePrompt = useCallback(async () => {
    setPromptBeforeEnhance(prompt);
    handleEnhance(prompt, setPrompt);
  }, [prompt, handleEnhance]);

   const handleGetInspiration = useCallback(async () => {
    setIsInspiring(true);
    setError(null);
    setAirtableRecord(null);
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

  const handleGetRandomPromptFromAirtable = useCallback(async () => {
    if (!airtableConfig) {
      showToast('Please configure your Airtable settings first.', 'error');
      setIsSettingsModalOpen(true);
      return;
    }
    setIsFetchingFromAirtable(true);
    setError(null);
    setInspirationPrompts([]);
    setGroundingSources(null);
    setAirtableRecord(null);
    try {
      const { id, prompt: randomPrompt } = await getRandomPromptFromAirtable(airtableConfig);
      setPrompt(randomPrompt);
      setAirtableRecord({ id, synced: false });
      setPromptBeforeEnhance(null);
      showToast('Prompt loaded from Airtable!', 'success');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get prompt from Airtable: ${message}`);
      console.error(e);
    } finally {
      setIsFetchingFromAirtable(false);
    }
  }, [airtableConfig]);
  
  const handleBrowseAirtableClick = () => {
    if (!airtableConfig) {
      showToast('Please configure your Airtable settings first.', 'error');
      setIsSettingsModalOpen(true);
    } else {
      setIsPromptLibraryOpen(true);
    }
  };

  const handleSelectAirtablePrompt = (selectedPrompt: { id: string, text: string }) => {
    setPrompt(selectedPrompt.text);
    setAirtableRecord({ id: selectedPrompt.id, synced: false });
    setIsPromptLibraryOpen(false);
    setPromptBeforeEnhance(null);
    setInspirationPrompts([]);
    setGroundingSources(null);
    showToast('Prompt selected from your library!', 'success');
  };

  const handleSyncAirtable = useCallback(async () => {
    if (!airtableRecord || airtableRecord.synced || !airtableConfig) {
      return;
    }
    setIsSyncingAirtable(true);
    try {
      await updateAirtableRecord(airtableConfig, airtableRecord.id, { "Synced": true });
      setAirtableRecord(rec => rec ? { ...rec, synced: true } : null);
      showToast('Prompt marked as synced in Airtable!', 'success');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      showToast(`Failed to sync: ${message}`, 'error');
      console.error(e);
    } finally {
      setIsSyncingAirtable(false);
    }
  }, [airtableRecord, airtableConfig]);

  const handleImageAction = useCallback(async (action: (...args: any[]) => Promise<string>, ...args: any[]) => {
      setIsLoading(true);
      setError(null);
      setImageUrls(null);
      setGeneratedImagesData([]);
      setFinalVideoUrl(null);
      setPreviewVideoUrl(null);
      setBlogPostContent(null);
      setSocialMediaPosts(null);
      setEditModalInfo({ isOpen: false, imageUrl: null, mode: 'inpaint' });
      setExpandModalInfo({ isOpen: false, imageUrl: null });
      setAirtableRecord(null); // Image actions create new content, so clear the prompt context
      setVideoStoryboard(null);
      setMusicVideoStoryboard(null);

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
          setPromptBeforeEnhance(null);
      }
  }, [handleSuccessfulGeneration]);
  
  const handleGeneratePromptFromImage = useCallback(async (imageUrl: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setAirtableRecord(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);

    try {
      const generatedPrompt = await generatePromptFromImage(imageUrl);
      setPrompt(generatedPrompt);
      setImageUrls([imageUrl]); // Show the source image as context
      setGeneratedImagesData([]);
      setMode('text-to-image'); // Switch back to T2I mode
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate prompt from image: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setPromptBeforeEnhance(null);
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
    setSocialMediaPosts(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    
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

  const handleGenerateSocialMediaPost = useCallback(async (topic: string, platform: string, tone: string, audience: string, includeHashtags: boolean, includeEmojis: boolean) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    
    try {
      const posts = await generateSocialMediaPost(topic, platform, tone, audience, includeHashtags, includeEmojis);
      setSocialMediaPosts(posts);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate social media post: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateImageForPost = useCallback((postText: string, platform: string) => {
    const newPrompt = `A visually appealing, high-quality image for a social media post about: "${postText}". The style should be modern, engaging, and suitable for ${platform}.`;
    
    // Set aspect ratio based on platform
    let newAspectRatio: AspectRatio = '16:9'; // Default for Twitter/LinkedIn
    if (platform === 'Instagram') {
        newAspectRatio = '1:1';
    }

    setMode('text-to-image');
    setAspectRatio(newAspectRatio);
    setPrompt(newPrompt);
    setPromptBeforeEnhance(null);
    setInspirationPrompts([]);
    setGroundingSources(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Prompt for social media image has been set!', 'success');
  }, []);

  const handleGenerateHeaderImage = useCallback(() => {
    if (!blogPostContent) return;

    // Extract title from H1 tag
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blogPostContent;
    const h1 = tempDiv.querySelector('h1');
    const title = h1 ? h1.innerText : 'Untitled Blog Post';
    
    // Create a new prompt
    const newPrompt = `A visually appealing header image for a blog post titled "${title}". The style should be professional and engaging.`;

    // Switch mode and set prompt
    setMode('text-to-image');
    setAspectRatio('16:9'); // Good default for headers
    setPrompt(newPrompt);
    setPromptBeforeEnhance(null);
    setInspirationPrompts([]);
    setGroundingSources(null);
    setImageUrls(null); // Clear previous images
    setGeneratedImagesData([]);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Prompt for header image has been set!', 'success');
  }, [blogPostContent]);
  
  const handleGenerateFlyer = useCallback(async (title: string, date: string, time: string, location: string, info: string, style: string, color: string) => {
      setIsLoading(true);
      setError(null);
      setImageUrls(null);
      setGeneratedImagesData([]);
      setFinalVideoUrl(null);
      setPreviewVideoUrl(null);
      setBlogPostContent(null);
      setSocialMediaPosts(null);
      setGroundingSources(null);
      setInspirationPrompts([]);
      setVideoStoryboard(null);
      setMusicVideoStoryboard(null);

      const styleDetails = {
          'Modern & Clean': 'minimalist design, sans-serif fonts, generous white space, clean lines',
          'Bold & Energetic': 'vibrant colors, dynamic typography, bold shapes, high energy, abstract patterns',
          'Elegant & Minimalist': 'serif fonts, simple color palette, lots of negative space, a single impactful graphic element',
          'Retro & Funky': '70s inspired fonts, warm and groovy color palette, psychedelic patterns, grainy texture',
          'Corporate & Professional': 'clean layout, blue and grey color scheme, sharp lines, professional fonts like Helvetica or Arial'
      }[style] || '';

      const fullPrompt = `Create a visually stunning, professional event flyer with the following details. The text MUST be beautifully and legibly integrated into the design.
- Event Title: "${title}"
${date ? `- Date: "${date}"` : ''}
${time ? `- Time: "${time}"` : ''}
${location ? `- Location: "${location}"` : ''}
${info ? `- Additional Info: "${info}"` : ''}
- Visual Style: ${style}. ${styleDetails}.
- Primary Color Palette: Centered around ${color}.
- Layout: The design should be well-balanced, eye-catching, and suitable for printing or social media. Do not include placeholder text. All text must be clearly readable.`;

      try {
          const generatedImageUrls = await generateImageFromPrompt(fullPrompt, 1, '9:16', 'blurry text, unreadable fonts, watermarks, lorem ipsum');
          handleSuccessfulGeneration(generatedImageUrls, fullPrompt);
      } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
          setError(`Failed to generate flyer: ${message}`);
      } finally {
          setIsLoading(false);
      }
  }, [handleSuccessfulGeneration]);

    const handleGenerateLogo = useCallback(async (companyName: string, slogan: string, style: string, colors: string, iconDesc: string, negativePrompt: string) => {
        setIsLoading(true);
        setError(null);
        setImageUrls(null);
        setGeneratedImagesData([]);
        setFinalVideoUrl(null);
        setPreviewVideoUrl(null);
        setBlogPostContent(null);
        setSocialMediaPosts(null);
        setGroundingSources(null);
        setInspirationPrompts([]);
        setVideoStoryboard(null);
        setMusicVideoStoryboard(null);

        const fullPrompt = `Professional logo design for a company named "${companyName}". Style: ${style}. The logo must feature a vector icon representing: "${iconDesc}". ${colors ? `Primary color palette: ${colors}.` : ''} ${slogan ? `If possible, elegantly incorporate the slogan "${slogan}".` : ''} The design must be simple, clean, and memorable, suitable for use on a website and business cards. Solid white background.`;

        try {
            const generatedImageUrls = await generateImageFromPrompt(fullPrompt, 4, '1:1', `photorealistic, 3d, complex details, shadows, gradients, ${negativePrompt}`);
            handleSuccessfulGeneration(generatedImageUrls, fullPrompt);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
            setError(`Failed to generate logo: ${message}`);
        } finally {
            setIsLoading(false);
            setPromptBeforeEnhance(null);
        }
    }, [handleSuccessfulGeneration]);

    const handleGenerateThumbnail = useCallback(async (mainTitle: string, subtitle: string, iconDesc: string, backgroundDesc: string, style: string, color: string) => {
        setIsLoading(true);
        setError(null);
        setImageUrls(null);
        setGeneratedImagesData([]);
        setFinalVideoUrl(null);
        setPreviewVideoUrl(null);
        setBlogPostContent(null);
        setSocialMediaPosts(null);
        setGroundingSources(null);
        setInspirationPrompts([]);
        setVideoStoryboard(null);
        setMusicVideoStoryboard(null);

        const selectedStyleObject = THUMBNAIL_STYLES.find(s => s.name === style);
        const styleDetails = selectedStyleObject ? selectedStyleObject.promptSuffix : '';
        
        const promptParts = [
            `YouTube thumbnail for a video titled "${mainTitle}".`,
            `Style: ${style}. ${styleDetails}.`,
        ];

        if (subtitle) {
            promptParts.push(`Include the subtitle "${subtitle}" in a smaller font.`);
        }
        if (iconDesc) {
            promptParts.push(`Feature a central icon or image representing: "${iconDesc}".`);
        }
        if (backgroundDesc) {
            promptParts.push(`The background should be: "${backgroundDesc}".`);
        }
        if (color) {
            promptParts.push(`The primary color palette is ${color}.`);
        }

        promptParts.push(`The text must be the main focus, extremely clear, legible, and visually integrated into the design. High contrast, eye-catching, engaging, professional design. Clickbait style.`);

        const fullPrompt = promptParts.join(' ');
        const negativePrompt = 'blurry text, unreadable fonts, distorted text, messy, cluttered, watermarks, signature';

        try {
            const generatedImageUrls = await generateImageFromPrompt(fullPrompt, 1, '16:9', negativePrompt);
            handleSuccessfulGeneration(generatedImageUrls, fullPrompt);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
            setError(`Failed to generate thumbnail: ${message}`);
        } finally {
            setIsLoading(false);
            setPromptBeforeEnhance(null);
        }
    }, [handleSuccessfulGeneration]);

  const handleRecreateThumbnail = useCallback(async (imageUrl: string, changesPrompt: string, weight: InspirationWeight) => {
        setIsLoading(true);
        setError(null);
        setImageUrls(null);
        setGeneratedImagesData([]);
        setFinalVideoUrl(null);
        setPreviewVideoUrl(null);
        setBlogPostContent(null);
        setSocialMediaPosts(null);
        setGroundingSources(null);
        setInspirationPrompts([]);
        setVideoStoryboard(null);
        setMusicVideoStoryboard(null);

        let recreationPrompt: string;
        switch (weight) {
            case 'Low':
                recreationPrompt = `Inspired by the colors and general style of the provided image, create a new high-quality, eye-catching YouTube thumbnail about: "${changesPrompt}".`;
                break;
            case 'Medium':
                recreationPrompt = `Use the provided image as a strong style and composition reference. Create a new high-quality, eye-catching YouTube thumbnail about: "${changesPrompt}".`;
                break;
            case 'High':
            default:
                recreationPrompt = `Closely recreate the layout, composition, lighting, and style of the provided image. The new subject should be about: "${changesPrompt}". The final image must be a high-quality, eye-catching YouTube thumbnail.`;
                break;
        }

        try {
            // Using imageAction as it's designed for image-to-image tasks
            const resultUrl = await imageAction(imageUrl, recreationPrompt);
            handleSuccessfulGeneration([resultUrl], recreationPrompt);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
            setError(`Failed to recreate thumbnail: ${message}`);
            console.error(e);
        } finally {
            setIsLoading(false);
            setPromptBeforeEnhance(null);
        }
    }, [handleSuccessfulGeneration]);

  const handleGenerateExplainerVideo = useCallback(async (textContent: string) => {
      setIsLoading(true);
      setError(null);
      setVideoStoryboard(null);
      setExplainerVideoProgress("Step 1/2: Generating script and storyboard...");

      try {
          // Step 1: Generate script
          const scriptData = await generateVideoScriptFromText(textContent);
          const initialStoryboard: StoryboardScene[] = scriptData.scenes;
          setVideoStoryboard(initialStoryboard);

          // Step 2: Generate videos for each scene
          for (let i = 0; i < initialStoryboard.length; i++) {
              setExplainerVideoProgress(`Step 2/2: Generating video for scene ${i + 1} of ${initialStoryboard.length}...`);
              // Using a short duration and preview for speed and cost-effectiveness
              const videoUrl = await generateVideoFromPrompt(initialStoryboard[i].visualDescription, 2, true); 
              
              // Update state with the new video URL for the correct scene
              setVideoStoryboard(currentStoryboard => {
                  if (!currentStoryboard) return null;
                  const newStoryboard = [...currentStoryboard];
                  newStoryboard[i] = { ...newStoryboard[i], videoUrl };
                  return newStoryboard;
              });
          }
          setExplainerVideoProgress("Storyboard generation complete!");
      } catch (e) {
          const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
          setError(`Failed to generate explainer video: ${message}`);
          setExplainerVideoProgress('');
      } finally {
          setIsLoading(false);
      }
  }, []);

  const handleGenerateMusicVideo = useCallback(async (songDescription: string, artistGender: string, songLength: number) => {
    setIsLoading(true);
    setError(null);
    setMusicVideoStoryboard(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    
    try {
      const script = await generateMusicVideoScript(songDescription, artistGender, songLength);
      setMusicVideoStoryboard(script.scenes);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate music video script: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveToAirtable = useCallback(async (image: SavedImage) => {
    if (!airtableConfig) {
      showToast('Please configure your Airtable settings first.', 'error');
      setIsSettingsModalOpen(true);
      return;
    }
    setSavingToAirtableState({ status: 'saving', imageId: image.id });
    try {
      await saveImageToAirtable(airtableConfig, image);
      showToast('Image saved to Airtable!', 'success');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      showToast(`Failed to save: ${message}`, 'error');
      console.error(e);
    } finally {
      setSavingToAirtableState({ status: 'idle', imageId: null });
    }
  }, [airtableConfig]);

  const handleAirtableConfigSave = (config: AirtableConfig) => {
    setAirtableConfig(config);
    localStorage.setItem(AIRTABLE_CONFIG_KEY, JSON.stringify(config));
    setIsSettingsModalOpen(false);
    showToast('Airtable settings saved!', 'success');
  };

  const handleDeleteImage = (id: string) => {
    const updatedImages = savedImages.filter(img => img.id !== id);
    setSavedImages(updatedImages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
    showToast('Image deleted.', 'success');
  };

  const handleClearAllImages = () => {
    if (window.confirm('Are you sure you want to delete all saved creations? This cannot be undone.')) {
        setSavedImages([]);
        localStorage.removeItem(STORAGE_KEY);
        showToast('Gallery cleared.', 'success');
    }
  };

  const openDownloadModal = (imageUrl: string) => {
    setModalInfo({ isOpen: true, imageUrl });
  };

  const openEditModal = (imageUrl: string) => {
    setEditModalInfo({ isOpen: true, imageUrl, mode: 'inpaint' });
  };
  
  const openRemoveObjectModal = (imageUrl: string) => {
    setEditModalInfo({ isOpen: true, imageUrl, mode: 'remove' });
  };
  
  const openExpandModal = (imageUrl: string) => {
    setExpandModalInfo({ isOpen: true, imageUrl });
  };

  const handleSetReferenceImage = (imageUrl: string) => {
    setReferenceImageUrl(imageUrl);
    handleSetMode('text-to-image');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnimateImage = (imageUrl: string) => {
    setSourceImageForVideo(imageUrl);
    handleSetMode('animate-image');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveBackgroundForStudio = useCallback((img: string) => {
    // This is a wrapper around the geminiService `imageAction` to be passed to ProductStudio.
    // By using useCallback with an empty dependency array, we ensure this function's reference
    // is stable across re-renders, preventing an infinite loop in ProductStudio's useEffect hook.
    return imageAction(img, "remove the background, make it transparent");
  }, []);

  const isAnyLoading = isLoading || isPreviewLoading || isEnhancing || isInspiring || isFetchingFromAirtable;
  // FIX: Changed 'mockups' to 'tshirt-mockup' to match GeneratorMode type.
  const isImageDisplayMode = ['text-to-image', 'image-variations', 'ugc-ad', 'product-studio', 'tshirt-mockup', 'avatar-generator', 'creative-chat', 'image-to-prompt', 'flyer-generator', 'logo-generator', 'thumbnail-generator', 'recreate-thumbnail'].includes(mode);
  const isVideoDisplayMode = ['text-to-video', 'animate-image', 'video-green-screen'].includes(mode);
  const isTextDisplayMode = ['blog-post', 'social-media-post'].includes(mode);
  const isMusicVideoDisplayMode = mode === 'music-video';

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center font-sans">
      <Header onSettingsClick={() => setIsSettingsModalOpen(true)} />
      <main className="w-full max-w-7xl p-4 flex-grow flex flex-col gap-8">
        <div className="w-full max-w-4xl mx-auto">
          <ModeSelector mode={mode} setMode={handleSetMode} />
        </div>
        
        <div className="w-full max-w-5xl mx-auto">
          {error && <ErrorMessage message={error} />}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
          {/* --- LEFT COLUMN (CONTROLS) --- */}
          <div className="flex flex-col gap-6 p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
            {mode === 'text-to-image' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Image Generation Controls</h2>
                {referenceImageUrl && <ReferenceImageDisplay imageUrl={referenceImageUrl} onClear={() => setReferenceImageUrl(null)} />}
                <PromptInput 
                    prompt={prompt} 
                    setPrompt={setPrompt}
                    setPromptBeforeEnhance={setPromptBeforeEnhance}
                    negativePrompt={negativePrompt}
                    setNegativePrompt={setNegativePrompt}
                    onSubmit={() => handleGenerateImage()}
                    onEnhance={handleEnhancePrompt} 
                    onInspire={handleGetInspiration}
                    onGetRandomFromAirtable={handleGetRandomPromptFromAirtable}
                    onBrowseAirtable={handleBrowseAirtableClick}
                    isLoading={isLoading} 
                    isEnhancing={isEnhancing} 
                    isInspiring={isInspiring}
                    isFetchingFromAirtable={isFetchingFromAirtable}
                    airtableConfigured={!!airtableConfig}
                    useGoogleSearch={useGoogleSearch}
                    setUseGoogleSearch={setUseGoogleSearch}
                    inspirationPrompts={inspirationPrompts}
                />
                {groundingSources && <GroundingSourcesDisplay sources={groundingSources} />}
                <div className="flex flex-col gap-4">
                  <ImageCountSelector count={imageCount} setCount={setImageCount} isLoading={isLoading} isReferenceActive={!!referenceImageUrl} />
                  <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} isLoading={isLoading} />
                  <AspectRatioSelector selectedAspectRatio={aspectRatio} setAspectRatio={setAspectRatio} isLoading={isLoading} isReferenceActive={!!referenceImageUrl} />
                </div>
                <ExamplePrompts onSelectPrompt={(p) => { setPrompt(p); setPromptBeforeEnhance(null); }} isLoading={isLoading} />
              </>
            )}

            {mode === 'image-variations' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Image Variations Generator</h2>
                <PromptInput 
                    prompt={prompt} 
                    setPrompt={setPrompt}
                    setPromptBeforeEnhance={setPromptBeforeEnhance}
                    negativePrompt={negativePrompt}
                    setNegativePrompt={setNegativePrompt}
                    onSubmit={() => handleGenerateImage(variationCount)} 
                    onEnhance={handleEnhancePrompt} 
                    onInspire={handleGetInspiration}
                    onGetRandomFromAirtable={handleGetRandomPromptFromAirtable}
                    onBrowseAirtable={handleBrowseAirtableClick}
                    isLoading={isLoading} 
                    isEnhancing={isEnhancing} 
                    isInspiring={isInspiring}
                    isFetchingFromAirtable={isFetchingFromAirtable}
                    airtableConfigured={!!airtableConfig}
                    useGoogleSearch={useGoogleSearch}
                    setUseGoogleSearch={setUseGoogleSearch}
                    inspirationPrompts={inspirationPrompts}
                />
                {groundingSources && <GroundingSourcesDisplay sources={groundingSources} />}
                <div className="flex flex-col gap-4">
                  <VariationCountSelector count={variationCount} setCount={setVariationCount} isLoading={isLoading} />
                  <StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} isLoading={isLoading} />
                  <AspectRatioSelector selectedAspectRatio={aspectRatio} setAspectRatio={setAspectRatio} isLoading={isLoading} isReferenceActive={false} />
                </div>
              </>
            )}

            {mode === 'avatar-generator' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Avatar Generator</h2>
                <AvatarGenerator onSubmit={handleGenerateAvatar} isLoading={isLoading} />
              </>
            )}

            {mode === 'flyer-generator' && (
                <>
                  <h2 className="text-xl font-bold text-indigo-400">Flyer Generator</h2>
                  <FlyerGenerator onSubmit={handleGenerateFlyer} isLoading={isLoading} />
                </>
            )}

            {mode === 'logo-generator' && (
                <>
                  <h2 className="text-xl font-bold text-indigo-400">Logo Generator</h2>
                  <LogoGenerator onSubmit={handleGenerateLogo} isLoading={isLoading} />
                </>
            )}

            {mode === 'thumbnail-generator' && (
                <>
                  <h2 className="text-xl font-bold text-indigo-400">YouTube Thumbnail Generator</h2>
                  <ThumbnailGenerator onSubmit={handleGenerateThumbnail} isLoading={isLoading} />
                </>
            )}

            {mode === 'recreate-thumbnail' && (
                <>
                  <h2 className="text-xl font-bold text-indigo-400">Recreate Thumbnail</h2>
                  <RecreateThumbnailGenerator onSubmit={handleRecreateThumbnail} isLoading={isLoading} />
                </>
            )}

            {mode === 'creative-chat' && (
                <>
                    <h2 className="text-xl font-bold text-indigo-400">Creative Chat</h2>
                    <CreativeChat 
                      onSubmit={handleCreativeChatSubmit}
                      onSave={() => chatImage && handleSuccessfulGeneration([chatImage], chatHistory.join('; '))}
                      onReset={handleResetChat}
                      chatHistory={chatHistory}
                      currentImage={chatImage}
                      isLoading={isLoading}
                    />
                </>
            )}

            {mode === 'image-to-prompt' && (
                <>
                    <h2 className="text-xl font-bold text-indigo-400">Image-to-Prompt</h2>
                    <ImageToPromptGenerator onSubmit={handleGeneratePromptFromImage} isLoading={isLoading} />
                </>
            )}

            {mode === 'ugc-ad' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">UGC Ad Generator</h2>
                <UgcAdGenerator onSubmit={handleGenerateUgcAd} isLoading={isLoading} />
              </>
            )}

             {mode === 'product-studio' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Product Studio</h2>
                <ProductStudio
                  removeBackground={handleRemoveBackgroundForStudio}
                  generateProductScene={generateProductScene}
                  onGenerationComplete={handleSuccessfulGeneration}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              </>
            )}

            {mode === 'tshirt-mockup' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Mockup Generator</h2>
                <MockupGenerator onSubmit={handleGenerateMockup} isLoading={isLoading} />
              </>
            )}
            
            {mode === 'blog-post' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Blog Post Generator</h2>
                <BlogPostGenerator onSubmit={handleGenerateBlogPost} isLoading={isLoading} />
              </>
            )}
            
            {mode === 'social-media-post' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Social Media Post Generator</h2>
                <SocialMediaPostGenerator onSubmit={handleGenerateSocialMediaPost} isLoading={isLoading} />
              </>
            )}

            {(mode === 'text-to-video' || mode === 'animate-image' || mode === 'video-green-screen') && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-indigo-400">
                    {mode === 'text-to-video'
                        ? 'Text-to-Video Generator'
                        : mode === 'video-green-screen'
                        ? 'Green Screen Video'
                        : 'Animate Image'}
                </h2>
                {mode === 'text-to-video' || mode === 'video-green-screen' ? (
                  <VideoGenerator 
                    prompt={videoPrompt}
                    setPrompt={setVideoPrompt}
                    onSubmit={(isPreview) => handleGenerateVideo(isPreview)}
                    onEnhance={() => handleEnhance(videoPrompt, setVideoPrompt)}
                    isEnhancing={isEnhancing}
                    isLoading={isLoading}
                    isPreviewLoading={isPreviewLoading}
                    hasPreview={!!previewVideoUrl}
                  />
                ) : (
                  <ImageToVideoGenerator
                    onSubmit={(img, p, isPreview) => handleGenerateVideoFromImage(img, p, isPreview)}
                    isLoading={isLoading}
                    isPreviewLoading={isPreviewLoading}
                    hasPreview={!!previewVideoUrl}
                    initialImageUrl={sourceImageForVideo}
                  />
                )}
                {groundingSources && <GroundingSourcesDisplay sources={groundingSources} />}
                <VideoDurationSelector duration={videoDuration} setDuration={setVideoDuration} isLoading={isAnyLoading} />
                <VideoStyleSelector selectedStyle={videoStyle} setSelectedStyle={setVideoStyle} isLoading={isAnyLoading} />
              </div>
            )}
            
            {mode === 'explainer-video' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Explainer Video Generator</h2>
                <ExplainerVideoGenerator onSubmit={handleGenerateExplainerVideo} isLoading={isLoading} />
              </>
            )}

            {mode === 'music-video' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Music Video Script Generator</h2>
                <MusicVideoGenerator onSubmit={handleGenerateMusicVideo} isLoading={isLoading} />
              </>
            )}
            {/* FIX: The 'ebook' mode section has been removed as the feature is disabled. */}
          </div>
          
          {/* --- RIGHT COLUMN (DISPLAY) --- */}
          <div className="flex items-start justify-center">
            {isImageDisplayMode && (
              <ImageDisplay
                imagesData={generatedImagesData}
                isLoading={isLoading}
                aspectRatio={aspectRatio}
                onDownloadClick={openDownloadModal}
                onEditClick={openEditModal}
                onRemoveObjectClick={openRemoveObjectModal}
                onRemoveBackground={(img) => handleImageAction(imageAction, img, "remove the background, make it transparent")}
                onUpscale={(img) => handleImageAction(imageAction, img, "Upscale this image to a higher resolution, enhance details, make it 4k, sharp focus")}
                onAnimateClick={handleAnimateImage}
                onExpandClick={openExpandModal}
                onGetPrompt={handleGeneratePromptFromImage}
                onSaveToAirtable={handleSaveToAirtable}
                airtableConfigured={!!airtableConfig}
                savingToAirtableState={savingToAirtableState}
                airtableRecord={airtableRecord}
                onSyncAirtable={handleSyncAirtable}
                isSyncingAirtable={isSyncingAirtable}
              />
            )}
            {isVideoDisplayMode && (
              <VideoDisplay 
                previewVideoUrl={previewVideoUrl}
                finalVideoUrl={finalVideoUrl}
                isLoading={isLoading}
                isPreviewLoading={isPreviewLoading}
              />
            )}
            {isTextDisplayMode && (
              <>
                {mode === 'blog-post' && <BlogPostDisplay content={blogPostContent} isLoading={isLoading} onGenerateHeaderClick={handleGenerateHeaderImage} />}
                {mode === 'social-media-post' && <SocialMediaPostDisplay posts={socialMediaPosts} isLoading={isLoading} onGenerateImageClick={handleGenerateImageForPost} />}
              </>
            )}
            {mode === 'explainer-video' && (
              <ExplainerVideoDisplay storyboard={videoStoryboard} isLoading={isLoading} progressMessage={explainerVideoProgress} />
            )}
            {isMusicVideoDisplayMode && (
              <MusicVideoDisplay storyboard={musicVideoStoryboard} isLoading={isLoading} />
            )}
          </div>
        </div>

        <SavedGallery 
            images={savedImages}
            onDeleteImage={handleDeleteImage}
            onClearAll={handleClearAllImages}
            onDownloadClick={openDownloadModal}
            onEditClick={openEditModal}
            onRemoveObjectClick={openRemoveObjectModal}
            onExpandClick={openExpandModal}
            onRemoveBackground={(imgUrl) => handleImageAction(imageAction, imgUrl, "remove the background, make it transparent")}
            onUpscale={(imgUrl) => handleImageAction(imageAction, imgUrl, "Upscale this image to a higher resolution, enhance details, make it 4k, sharp focus")}
            onSetReference={handleSetReferenceImage}
            onGetPrompt={handleGeneratePromptFromImage}
            onSaveToAirtable={handleSaveToAirtable}
            airtableConfigured={!!airtableConfig}
            savingToAirtableState={savingToAirtableState}
            showSaveConfirmation={showSaveConfirmation}
            isGeneratingMetadata={isGeneratingMetadata}
        />
      </main>
      <Footer />
      {/* Modals */}
      <DownloadModal isOpen={modalInfo.isOpen} imageUrl={modalInfo.imageUrl} onClose={() => setModalInfo({isOpen: false, imageUrl: null})} />
      <EditModal 
        isOpen={editModalInfo.isOpen} 
        imageUrl={editModalInfo.imageUrl} 
        mode={editModalInfo.mode}
        onClose={() => setEditModalInfo({ isOpen: false, imageUrl: null, mode: 'inpaint' })}
        onConfirmEdit={(original, masked, p) => {
          if (editModalInfo.mode === 'inpaint') {
            handleImageAction(imageAction, masked, p);
          } else {
            handleImageAction(imageAction, masked, "remove the masked object and realistically fill in the background");
          }
        }}
        isLoading={isLoading}
      />
      <ExpandModal 
        isOpen={expandModalInfo.isOpen} 
        imageUrl={expandModalInfo.imageUrl} 
        onClose={() => setExpandModalInfo({ isOpen: false, imageUrl: null })}
        onConfirmExpand={(original, expanded, p) => handleImageAction(imageAction, expanded, p || "Fill in the transparent areas seamlessly, continuing the existing image and scenery naturally.")}
        isLoading={isLoading}
      />
      <AirtableSettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleAirtableConfigSave}
        currentConfig={airtableConfig}
      />
      {airtableConfig && (
        <AirtablePromptLibraryModal 
            isOpen={isPromptLibraryOpen}
            onClose={() => setIsPromptLibraryOpen(false)}
            onSelectPrompt={handleSelectAirtablePrompt}
            config={airtableConfig}
            getPrompts={getPromptsFromAirtable}
        />
      )}
      <Toast message={toast.message} type={toast.type} show={toast.show} />
      <AIAvatar mode={mode} error={error} isLoading={isLoading} isPreviewLoading={isPreviewLoading} />
    </div>
  );
};

export default App;