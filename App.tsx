import React, { useState, useCallback, useEffect, useRef } from 'react';
// FIX: Added all missing function and type imports from geminiService to resolve compilation errors.
import { generateImageFromPrompt, enhancePrompt, imageAction, generateImageFromReference, generateVideoFromPrompt, generateVideoFromImage, SocialMediaPost, VideoScene, MusicVideoScene, generateImageMetadata, getPromptInspiration, generatePromptFromImage, generateUgcProductAd, generateProductScene, generateMockup, generateBlogPost, generateSocialMediaPost, generateVideoScriptFromText, generateMusicVideoScript, generateLyricsStoryboard, LyricsScene, generateLipSyncVideo, BusinessName, generateBusinessNames, EmailCampaign, generateEmailCampaign, CompanyProfile, EbookIdea, generateEbookIdea, generateRecipePost, generateBlogTopicIdeas, generateRecipeTopicIdeas, generatePoem, BlogProfile } from './services/geminiService';
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
import { STYLES, ASPECT_RATIOS, VIDEO_STYLES, GeneratorMode, THUMBNAIL_STYLES, BUSINESS_NAME_STYLES, EMAIL_CAMPAIGN_TYPES, BLOG_TONES } from './constants';
import ModeSelector from './components/ModeSelector';
import UgcAdGenerator from './components/UgcAdGenerator';
import UgcVideoAdGenerator from './components/UgcVideoAdGenerator';
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
import TitleToImageGenerator from './components/TitleToImageGenerator';
import LyricsToVideoGenerator from './components/LyricsToVideoGenerator';
import LyricsVideoDisplay, { StoryboardLyricsScene } from './components/LyricsVideoDisplay';
import AudioToTextGenerator from './components/AudioToTextGenerator';
import AudioTranscriptionDisplay from './components/AudioTranscriptionDisplay';
import LipSyncGenerator from './components/LipSyncGenerator';
import Loader from './components/Loader';
import TTSButton from './components/TTSButton';
import { TTSSettingsProvider } from './contexts/TTSSettingsContext';
import TTSSettingsModal from './components/TTSSettingsModal';
import EbookIdeaGenerator from './components/EbookIdeaGenerator';
import EbookIdeaDisplay from './components/EbookIdeaDisplay';
import BookCoverGenerator from './components/BookCoverGenerator';
import BookMockupGenerator from './components/BookMockupGenerator';
import GifGenerator from './components/GifGenerator';
import RecipePostGenerator from './components/RecipePostGenerator';
import PoemWriterGenerator from './components/PoemWriterGenerator';
import PoemDisplay from './components/PoemDisplay';


type AspectRatio = typeof ASPECT_RATIOS[number];
type ToastState = { show: boolean; message: string; type: 'success' | 'error' };
type StoryboardScene = VideoScene & { videoUrl?: string };
type InspirationWeight = 'Low' | 'Medium' | 'High';

const BusinessNameGenerator: React.FC<{
  onSubmit: (description: string, keywords: string, style: string) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [style, setStyle] = useState(BUSINESS_NAME_STYLES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isLoading) {
      onSubmit(description, keywords, style);
    }
  };
  
  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";
  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="biz-description" className="block text-sm font-semibold text-gray-400 mb-1">
          Product/Service Description
        </label>
        <textarea
            id="biz-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., An online platform that connects local artists with buyers..."
            className="w-full h-32 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
            disabled={isLoading}
            required
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="biz-keywords" className="block text-sm font-semibold text-gray-400 mb-1">
            Keywords (optional)
          </label>
          <input id="biz-keywords" type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., art, community, local" className={commonInputClasses} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="biz-style" className="block text-sm font-semibold text-gray-400 mb-1">
            Naming Style
          </label>
          <select id="biz-style" value={style} onChange={(e) => setStyle(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {BUSINESS_NAME_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !description.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
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
          'Generate Names'
        )}
      </button>
    </form>
  );
};

const BusinessNameDisplay: React.FC<{
  names: BusinessName[] | null;
  isLoading: boolean;
}> = ({ names, isLoading }) => {
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    }).catch(err => {
      console.error('Failed to copy name: ', err);
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Generating business names..." />
        </div>
      ) : names ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-4">
          {names.map((item, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex justify-between items-start gap-4">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-indigo-400">{item.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{item.rationale}</p>
                </div>
                <div className="flex-shrink-0 flex items-start gap-2">
                  <TTSButton textToSpeak={`${item.name}. ${item.rationale}`} className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500" />
                  <button
                      onClick={() => handleCopy(item.name)}
                      className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                      title={`Copy "${item.name}"`}
                  >
                      {copiedName === item.name ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                          </svg>
                      )}
                  </button>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <p className="mt-2 text-lg font-semibold">Your business name ideas will appear here</p>
            <p className="text-sm">Fill out the details to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyProfileEditor: React.FC<{
  profile: CompanyProfile | null;
  onSave: (profile: CompanyProfile) => void;
}> = ({ profile, onSave }) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    setName(profile?.companyName || '');
    setDetails(profile?.companyDetails || '');
    setWebsite(profile?.website || '');
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ companyName: name, companyDetails: details, website });
  };
  
  const commonInputClasses = "w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <p className="text-xs text-gray-400">This info will be used to personalize your emails and is saved in your browser.</p>
      <div>
        <label htmlFor="company-name" className="block text-sm font-semibold text-gray-400 mb-1">Company Name</label>
        <input id="company-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Aura Inc." className={commonInputClasses} />
      </div>
      <div>
        <label htmlFor="company-details" className="block text-sm font-semibold text-gray-400 mb-1">About Your Company</label>
        <textarea id="company-details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g., We sell premium, organic skincare products." className={`${commonInputClasses} h-24 resize-none`} />
      </div>
      <div>
        <label htmlFor="company-website" className="block text-sm font-semibold text-gray-400 mb-1">Website URL</label>
        <input id="company-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" className={commonInputClasses} />
      </div>
      <button type="submit" className="self-end px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
        Save Profile
      </button>
    </form>
  );
};

const EmailCampaignGenerator: React.FC<{
  onSubmit: (productName: string, productDescription: string, audience: string, campaignType: string, tone: string) => void;
  isLoading: boolean;
  companyProfile: CompanyProfile | null;
  onSaveProfile: (profile: CompanyProfile) => void;
}> = ({ onSubmit, isLoading, companyProfile, onSaveProfile }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [campaignType, setCampaignType] = useState(EMAIL_CAMPAIGN_TYPES[0]);
  const [tone, setTone] = useState(BLOG_TONES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim() && productDescription.trim() && !isLoading) {
      onSubmit(productName, productDescription, audience, campaignType, tone);
    }
  };
  
  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";
  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <div className="flex flex-col gap-6">
       <details className="group rounded-lg bg-gray-900/30 border border-gray-700/50 transition-all duration-300 open:border-indigo-500/50">
        <summary className="cursor-pointer list-none flex items-center justify-between p-3 font-semibold text-gray-300">
          <span>Company Profile</span>
          <svg className="h-5 w-5 text-gray-400 transition-transform duration-200 group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="p-4 pt-0">
          <CompanyProfileEditor profile={companyProfile} onSave={onSaveProfile} />
        </div>
      </details>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         <h4 className="text-lg font-bold text-indigo-400 -mb-2">Campaign Details</h4>
         <div>
          <label htmlFor="email-product-name" className="block text-sm font-semibold text-gray-400 mb-1">Product/Service Name</label>
          <input id="email-product-name" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., 'Aura Glow Serum'" className={commonInputClasses} disabled={isLoading} required />
        </div>
        <div>
          <label htmlFor="email-product-desc" className="block text-sm font-semibold text-gray-400 mb-1">Product/Service Description</label>
          <textarea id="email-product-desc" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="e.g., A hydrating facial serum with vitamin C and hyaluronic acid..." className={`${commonInputClasses} h-24 resize-none`} disabled={isLoading} required/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email-campaign-type" className="block text-sm font-semibold text-gray-400 mb-1">Campaign Type</label>
            <select id="email-campaign-type" value={campaignType} onChange={(e) => setCampaignType(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
              {EMAIL_CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="email-tone" className="block text-sm font-semibold text-gray-400 mb-1">Tone of Voice</label>
            <select id="email-tone" value={tone} onChange={(e) => setTone(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
              {BLOG_TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="email-audience" className="block text-sm font-semibold text-gray-400 mb-1">Target Audience (optional)</label>
          <input id="email-audience" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Skincare enthusiasts aged 25-40" className={commonInputClasses} disabled={isLoading} />
        </div>
        <button type="submit" disabled={isLoading || !productName.trim() || !productDescription.trim()} className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all">
          {isLoading ? 'Generating...' : 'Generate Email Campaign'}
        </button>
      </form>
    </div>
  );
};

const EmailCampaignDisplay: React.FC<{
  campaigns: EmailCampaign[] | null;
  isLoading: boolean;
}> = ({ campaigns, isLoading }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (htmlBody: string, index: number) => {
    navigator.clipboard.writeText(htmlBody).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(err => {
      console.error('Failed to copy HTML: ', err);
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Building your email campaign..." />
        </div>
      ) : campaigns ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-6">
          {campaigns.map((email, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="mb-4">
                <p className="text-sm text-gray-400 font-semibold">Subject: <span className="text-gray-200 font-normal">{email.subject}</span></p>
                <p className="text-sm text-gray-400 font-semibold">Preview: <span className="text-gray-200 font-normal">{email.previewText}</span></p>
              </div>
              <div className="p-4 bg-white rounded-md max-h-80 overflow-y-auto">
                 <div dangerouslySetInnerHTML={{ __html: email.body }} />
              </div>
              <div className="flex justify-end items-center mt-3 gap-2">
                 <TTSButton textToSpeak={`Subject: ${email.subject}. Preview: ${email.previewText}. Body: ${email.body}`} isHtml={true} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors" />
                 <button onClick={() => handleCopy(email.body, index)} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors">
                    {copiedIndex === index ? 'Copied!' : 'Copy HTML'}
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <p className="mt-2 text-lg font-semibold">Your email campaigns will appear here</p>
            <p className="text-sm">Fill out the details to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
};

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

const AppContent: React.FC = () => {
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
  const [poemContent, setPoemContent] = useState<string | null>(null);
  const [blogProfiles, setBlogProfiles] = useState<{[name: string]: BlogProfile}>({});
  // Social Media state
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[] | null>(null);
  // Business Name state
  const [businessNames, setBusinessNames] = useState<BusinessName[] | null>(null);
  // Email Campaign state
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[] | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  // Ebook Idea state
  const [ebookIdea, setEbookIdea] = useState<EbookIdea | null>(null);
  // Explainer video state
  const [videoStoryboard, setVideoStoryboard] = useState<StoryboardScene[] | null>(null);
  const [explainerVideoProgress, setExplainerVideoProgress] = useState<string>('');
  // Music video state
  const [musicVideoStoryboard, setMusicVideoStoryboard] = useState<MusicVideoScene[] | null>(null);
  // Lyrics to video state
  const [lyricsVideoStoryboard, setLyricsVideoStoryboard] = useState<StoryboardLyricsScene[] | null>(null);
  const [lyricsVideoProgress, setLyricsVideoProgress] = useState<string>('');
  // Audio to text state
  const [finalTranscription, setFinalTranscription] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const interimTranscriptionRef = useRef('');
  // Airtable state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const [airtableConfig, setAirtableConfig] = useState<AirtableConfig | null>(null);
  const [airtableRecord, setAirtableRecord] = useState<{id: string, synced: boolean} | null>(null);
  const [isSyncingAirtable, setIsSyncingAirtable] = useState<boolean>(false);
  const [savingToAirtableState, setSavingToAirtableState] = useState<{ status: 'idle' | 'saving'; imageId: string | null }>({ status: 'idle', imageId: null });
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [isTTSSettingsModalOpen, setIsTTSSettingsModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
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
  const COMPANY_PROFILE_KEY = 'company-profile';
  const BLOG_PROFILES_KEY = 'blog-profiles';

  useEffect(() => {
    // This check is for video features which require a user-selected API key.
    const checkApiKey = async () => {
        // The `window.aistudio` object may not be available in all environments.
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            if (await window.aistudio.hasSelectedApiKey()) {
                setHasApiKey(true);
            }
        } else {
            // If the hosting environment doesn't support key selection,
            // we assume the key is provided via `process.env.API_KEY` and proceed.
            // This allows the non-video features to still work.
            setHasApiKey(true);
        }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    // Load saved images
    try {
      const savedImagesJson = localStorage.getItem(STORAGE_KEY);
      if (savedImagesJson) {
        const parsed = JSON.parse(savedImagesJson);
        if (Array.isArray(parsed) && (parsed.length === 0 || (typeof parsed[0] === 'object' && 'url' in parsed[0]))) {
            setSavedImages(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load saved images from local storage:", err);
    }

    // Load airtable config
    try {
      const airtableConfigJson = localStorage.getItem(AIRTABLE_CONFIG_KEY);
      if (airtableConfigJson) {
          setAirtableConfig(JSON.parse(airtableConfigJson));
      }
    } catch (err) {
      console.error("Failed to load Airtable config from local storage:", err);
    }
    
    // Load company profile
    try {
      const companyProfileJson = localStorage.getItem(COMPANY_PROFILE_KEY);
      if (companyProfileJson) {
          setCompanyProfile(JSON.parse(companyProfileJson));
      }
    } catch (err) {
      console.error("Failed to load company profile from local storage:", err);
    }
    
    // Load blog profiles
    try {
      const blogProfilesJson = localStorage.getItem(BLOG_PROFILES_KEY);
      if (blogProfilesJson) {
        setBlogProfiles(JSON.parse(blogProfilesJson));
      } else {
        // Migration from old key
        const oldProfileJson = localStorage.getItem('blog-profile');
        if (oldProfileJson) {
          try {
            const oldProfile = JSON.parse(oldProfileJson);
            if (oldProfile && oldProfile.companyName) {
              const newProfiles = { 'Default': oldProfile };
              setBlogProfiles(newProfiles);
              localStorage.setItem(BLOG_PROFILES_KEY, JSON.stringify(newProfiles));
              localStorage.removeItem('blog-profile');
            }
          } catch (e) {
            console.error('Failed to migrate old blog profile', e)
          }
        }
      }
    } catch (err) {
      console.error("Failed to load blog profiles from local storage:", err);
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
      if (lyricsVideoStoryboard) {
        lyricsVideoStoryboard.forEach(scene => {
          if (scene.videoUrl && scene.videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(scene.videoUrl);
          }
        });
      }
    };
  }, [previewVideoUrl, finalVideoUrl, videoStoryboard, lyricsVideoStoryboard]);

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
    const isNewModeTextual = ['blog-post', 'social-media-post', 'email-campaign', 'ebook-idea', 'recipe-post', 'poem-writer'].includes(newMode);
    const isNewModeVideo = newMode.endsWith('video') || ['animate-image', 'video-green-screen', 'lyrics-to-video', 'lip-sync', 'gif-generator', 'ugc-video-ad'].includes(newMode);
    
    if (isNewModeTextual || isNewModeVideo || ['product-studio', 'tshirt-mockup', 'avatar-generator', 'flyer-generator', 'logo-generator', 'thumbnail-generator', 'recreate-thumbnail', 'music-video', 'title-to-image', 'audio-to-text', 'business-name-generator', 'book-cover', 'book-mockup'].includes(newMode)) {
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
      setEmailCampaigns(null);
      setEbookIdea(null);
      setPoemContent(null);
    }
     if (newMode !== 'business-name-generator') {
        setBusinessNames(null);
    }
    if (newMode !== 'explainer-video') {
      setVideoStoryboard(null);
      setExplainerVideoProgress('');
    }
     if (newMode !== 'lyrics-to-video') {
      setLyricsVideoStoryboard(null);
      setLyricsVideoProgress('');
    }
    if (newMode !== 'music-video') {
      setMusicVideoStoryboard(null);
    }
     if (newMode !== 'audio-to-text') {
      setFinalTranscription('');
      setInterimTranscription('');
      setIsRecording(false);
    }

    if (newMode === 'avatar-generator' || newMode === 'flyer-generator' || newMode === 'title-to-image' || newMode === 'book-cover' || newMode === 'book-mockup') {
      setAspectRatio('9:16');
    }
    if (newMode === 'logo-generator' || newMode === 'tshirt-mockup') {
        setAspectRatio('1:1');
    }
    if (newMode === 'thumbnail-generator' || newMode === 'recreate-thumbnail' || newMode === 'lyrics-to-video' || newMode === 'lip-sync' || newMode === 'gif-generator') {
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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    
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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

    const metadataPrompt = `T-shirt mockup with user-provided design.`;
    const generationPrompt = `Apply the first provided image (the design) onto the second provided image (the T-shirt mockup). The design should be placed realistically on the chest of the T-shirt, conforming to the fabric's folds, lighting, and shadows.`;

    try {
        const resultUrl = await generateMockup(designUrl, mockupUrl, generationPrompt);
        handleSuccessfulGeneration([resultUrl], metadataPrompt);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to generate mockup: ${message}`);
        console.error(e);
    } finally {
        setIsLoading(false);
        setPromptBeforeEnhance(null);
    }
  }, [handleSuccessfulGeneration]);

  const handleGenerateBookMockup = useCallback(async (designUrl: string, mockupUrl: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

    const metadataPrompt = `Book mockup with user-provided design.`;
    const generationPrompt = `Apply the first provided image (the book cover design) onto the second provided image (the book mockup). The design should be placed realistically onto the book cover area, conforming to the book's shape, perspective, lighting, and shadows.`;

    try {
        const resultUrl = await generateMockup(designUrl, mockupUrl, generationPrompt);
        handleSuccessfulGeneration([resultUrl], metadataPrompt);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to generate book mockup: ${message}`);
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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

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
      if (message.includes("Requested entity was not found.")) {
          setError("Your API key may be invalid or lack permissions for this model. Please select a valid API key and try again.");
          setHasApiKey(false);
      } else {
          setError(`Failed to generate video: ${message}`);
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [videoPrompt, videoDuration, videoStyle, mode]);

  const handleGenerateGif = useCallback(async (referenceImageUrl: string | null) => {
    if (!videoPrompt.trim()) {
        setError('Please enter a prompt for the GIF.');
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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

    const style = VIDEO_STYLES.find(s => s.name === videoStyle);
    // Clean up the style suffix to be a more natural description, e.g., "cinematic, epic"
    const styleDescription = style?.promptSuffix ? style.promptSuffix.replace(/^,/, '').trim() : '';

    let finalPrompt: string;

    if (referenceImageUrl) {
        // New, more direct prompt for image-to-GIF
        finalPrompt = `Animate the provided image into a short, looping GIF. The animation should be about: "${videoPrompt.trim()}"`;
        if (styleDescription) {
            finalPrompt += `, in the style of ${styleDescription}`;
        }
    } else {
        // New, more direct prompt for text-to-GIF
        finalPrompt = `A short, animated, seamlessly looping GIF of: "${videoPrompt.trim()}"`;
         if (styleDescription) {
            finalPrompt += `, in a ${styleDescription} style`;
        }
    }

    try {
        let resultUrl: string;
        // Use a 2-second preview for speed, which is ideal for GIFs
        if (referenceImageUrl) {
            resultUrl = await generateVideoFromImage(referenceImageUrl, finalPrompt, 2, true);
        } else {
            resultUrl = await generateVideoFromPrompt(finalPrompt, 2, true);
        }
        setFinalVideoUrl(resultUrl);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        if (message.includes("Requested entity was not found.")) {
            setError("Your API key may be invalid or lack permissions for this model. Please select a valid API key and try again.");
            setHasApiKey(false);
        } else {
            setError(`Failed to generate GIF: ${message}`);
        }
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [videoPrompt, videoStyle]);

  const handleGenerateVideoFromImage = useCallback(async (imageUrl: string, motionPrompt: string, isPreview: boolean) => {
    const setLoading = isPreview ? setIsPreviewLoading : setIsLoading;
    const setUrl = isPreview ? setPreviewVideoUrl : setFinalVideoUrl;
    
    setLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

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
      if (message.includes("Requested entity was not found.")) {
          setError("Your API key may be invalid or lack permissions for this model. Please select a valid API key and try again.");
          setHasApiKey(false);
      } else {
          setError(`Failed to generate video from image: ${message}`);
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [videoDuration, videoStyle]);

  const handleGenerateUgcVideoAd = useCallback(async (productImageUrl: string, productName: string, productDescription: string, motionPrompt: string, isPreview: boolean) => {
    const setLoading = isPreview ? setIsPreviewLoading : setIsLoading;
    const setUrl = isPreview ? setPreviewVideoUrl : setFinalVideoUrl;
    
    setLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

    if (isPreview) {
        setPreviewVideoUrl(null);
    } else {
        setFinalVideoUrl(null);
    }

    const ugcPrompt = `Create a realistic User-Generated Content (UGC) style video ad. The video should feature the provided product: '${productName}'. The scene should look authentic, as if a real customer is using and enjoying the product in a natural, everyday setting. The product description is: '${productDescription}'.`;
    const finalPrompt = `${ugcPrompt}. Video motion description: ${motionPrompt}`;

    const style = VIDEO_STYLES.find(s => s.name === videoStyle);
    const styledPrompt = style ? `${finalPrompt}${style.promptSuffix}` : finalPrompt;

    try {
      const resultUrl = await generateVideoFromImage(productImageUrl, styledPrompt, videoDuration, isPreview);
      setUrl(resultUrl);
      if (isPreview) {
          setFinalVideoUrl(null);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      if (message.includes("Requested entity was not found.")) {
          setError("Your API key may be invalid or lack permissions for this model. Please select a valid API key and try again.");
          setHasApiKey(false);
      } else {
          setError(`Failed to generate UGC video ad: ${message}`);
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [videoDuration, videoStyle]);

  const handleGenerateLipSyncVideo = useCallback(async (imageUrl: string, audioFile: File) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);

    try {
        const resultUrl = await generateLipSyncVideo(imageUrl, audioFile);
        setFinalVideoUrl(resultUrl);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to generate lip sync video: ${message}`);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
}, []);

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
      setBusinessNames(null);
      setEmailCampaigns(null);
      setEbookIdea(null);
      setPoemContent(null);
      setEditModalInfo({ isOpen: false, imageUrl: null, mode: 'inpaint' });
      setExpandModalInfo({ isOpen: false, imageUrl: null });
      setAirtableRecord(null); // Image actions create new content, so clear the prompt context
      setVideoStoryboard(null);
      setMusicVideoStoryboard(null);
      setLyricsVideoStoryboard(null);

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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setAirtableRecord(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

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

  const handleGenerateBlogPost = useCallback(async (topic: string, tone: string, length: string, audience: string, profile: BlogProfile | null) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    
    try {
      const content = await generateBlogPost(topic, tone, length, audience, profile);
      setBlogPostContent(content);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate blog post: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGeneratePoem = useCallback(async (topic: string, style: string, mood: string) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    
    try {
      const content = await generatePoem(topic, style, mood);
      setPoemContent(content);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate poem: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateRecipePost = useCallback(async (dish: string, cuisine: string, prepTime: string, dietary: string[]) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    
    try {
      const content = await generateRecipePost(dish, cuisine, prepTime, dietary);
      setBlogPostContent(content);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate recipe post: ${message}`);
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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    
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

  const handleGenerateBusinessNames = useCallback(async (description: string, keywords: string, style: string) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    
    try {
      const content = await generateBusinessNames(description, keywords, style);
      setBusinessNames(content);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate business names: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveCompanyProfile = (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    localStorage.setItem(COMPANY_PROFILE_KEY, JSON.stringify(profile));
    showToast('Company profile saved!', 'success');
  };

  const handleUpdateBlogProfiles = (profiles: {[name: string]: BlogProfile}) => {
    setBlogProfiles(profiles);
    localStorage.setItem(BLOG_PROFILES_KEY, JSON.stringify(profiles));
    showToast('Blog profiles updated!', 'success');
  };

  const handleGenerateEmailCampaign = useCallback(async (productName: string, productDescription: string, audience: string, campaignType: string, tone: string) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

    try {
        const campaigns = await generateEmailCampaign(productName, productDescription, audience, campaignType, tone, companyProfile);
        setEmailCampaigns(campaigns);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to generate email campaign: ${message}`);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [companyProfile]);
  
  const handleGenerateEbookIdea = useCallback(async (genre: string, audience: string, themes: string, setting: string, protagonist: string) => {
    setIsLoading(true);
    setError(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    // Clear other content types
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);
    
    try {
      const idea = await generateEbookIdea(genre, audience, themes, setting, protagonist);
      setEbookIdea(idea);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate ebook idea: ${message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateBookCover = useCallback(async (title: string, author: string, synopsis: string, style: string) => {
      setIsLoading(true);
      setError(null);
      setImageUrls(null);
      setGeneratedImagesData([]);
      setFinalVideoUrl(null);
      setPreviewVideoUrl(null);
      setBlogPostContent(null);
      setSocialMediaPosts(null);
      setBusinessNames(null);
      setEmailCampaigns(null);
      setEbookIdea(null);
      setPoemContent(null);
      setGroundingSources(null);
      setInspirationPrompts([]);
      setVideoStoryboard(null);
      setMusicVideoStoryboard(null);
      setLyricsVideoStoryboard(null);

      const fullPrompt = `Visually stunning book cover art for a book titled "${title}". ${author ? `The author is "${author}".` : ''} The story is about: "${synopsis}". The artistic style should be: ${style}. Do NOT include any text, letters, or words on the cover. Focus on creating a powerful, evocative image that represents the themes of the book.`;
      const negativePrompt = 'text, letters, words, font, signature, watermark, blurry text, unreadable fonts, author name, title';

      try {
          const generatedImageUrls = await generateImageFromPrompt(fullPrompt, 1, '9:16', negativePrompt);
          handleSuccessfulGeneration(generatedImageUrls, fullPrompt);
      } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
          setError(`Failed to generate book cover: ${message}`);
      } finally {
          setIsLoading(false);
          setPromptBeforeEnhance(null);
      }
  }, [handleSuccessfulGeneration]);

  const handleGenerateImageForPost = useCallback((postText: string, platform: string) => {
    const newPrompt = `A visually appealing, high-quality image for a social media post about: "${postText}". The style should be modern, engaging, and suitable for ${platform}.`;
    
    // Set aspect ratio based on platform
    let newAspectRatio: AspectRatio = '1:1'; // Default for Instagram/Facebook
    if (platform === 'Twitter/X' || platform === 'LinkedIn') {
      newAspectRatio = '16:9'; // Landscape for these platforms
    } else if (platform === 'TikTok' || platform === 'Pinterest') {
      newAspectRatio = '9:16'; // Vertical for these platforms
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

  const handleGenerateImageFromTopicIdea = useCallback((imagePrompt: string) => {
    setMode('text-to-image');
    setAspectRatio('16:9');
    setPrompt(imagePrompt);
    setPromptBeforeEnhance(null);
    setInspirationPrompts([]);
    setGroundingSources(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Prompt for header image has been set!', 'success');
  }, []);
  
  const handleGenerateCoverForEbook = useCallback((title: string, summary: string) => {
    const newPrompt = `A visually stunning book cover for a story titled "${title}". The story is about: "${summary}". Do NOT include any text, letters, or words. The style should be cinematic and evocative, suitable for the book's genre.`;
    
    setMode('title-to-image'); // This mode is already set to 9:16 and handles no-text prompts
    setPrompt(newPrompt);
    setPromptBeforeEnhance(null);
    setInspirationPrompts([]);
    setGroundingSources(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Prompt for your book cover has been set!', 'success');
  }, []);

  const handleGenerateFlyer = useCallback(async (title: string, date: string, time: string, location: string, info: string, style: string, color: string) => {
      setIsLoading(true);
      setError(null);
      setImageUrls(null);
      setGeneratedImagesData([]);
      setFinalVideoUrl(null);
      setPreviewVideoUrl(null);
      setBlogPostContent(null);
      setSocialMediaPosts(null);
      setBusinessNames(null);
      setEmailCampaigns(null);
      setEbookIdea(null);
      setPoemContent(null);
      setGroundingSources(null);
      setInspirationPrompts([]);
      setVideoStoryboard(null);
      setMusicVideoStoryboard(null);
      setLyricsVideoStoryboard(null);

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
        setBusinessNames(null);
        setEmailCampaigns(null);
        setEbookIdea(null);
        setPoemContent(null);
        setGroundingSources(null);
        setInspirationPrompts([]);
        setVideoStoryboard(null);
        setMusicVideoStoryboard(null);
        setLyricsVideoStoryboard(null);

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
        setBusinessNames(null);
        setEmailCampaigns(null);
        setEbookIdea(null);
        setPoemContent(null);
        setGroundingSources(null);
        setInspirationPrompts([]);
        setVideoStoryboard(null);
        setMusicVideoStoryboard(null);
        setLyricsVideoStoryboard(null);

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
        setBusinessNames(null);
        setEmailCampaigns(null);
        setEbookIdea(null);
        setPoemContent(null);
        setGroundingSources(null);
        setInspirationPrompts([]);
        setVideoStoryboard(null);
        setMusicVideoStoryboard(null);
        setLyricsVideoStoryboard(null);

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

  const handleGenerateImageFromTitle = useCallback(async (title: string, synopsis: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrls(null);
    setGeneratedImagesData([]);
    setFinalVideoUrl(null);
    setPreviewVideoUrl(null);
    setBlogPostContent(null);
    setSocialMediaPosts(null);
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setGroundingSources(null);
    setInspirationPrompts([]);
    setVideoStoryboard(null);
    setMusicVideoStoryboard(null);
    setLyricsVideoStoryboard(null);

    const fullPrompt = `Create a visually stunning, high-impact image for a project titled "${title}". ${synopsis ? `The image should capture the essence of the following description: "${synopsis}".` : ''} Do NOT include any text, letters, or words in the image. Focus on creating a powerful piece of artwork that could be used as a book cover, movie poster, or album art. Style: Cinematic, dramatic lighting, epic, detailed.`;
    const negativePrompt = 'text, letters, words, font, signature, watermark, blurry text, unreadable fonts';

    try {
        const generatedImageUrls = await generateImageFromPrompt(fullPrompt, 1, '9:16', negativePrompt);
        handleSuccessfulGeneration(generatedImageUrls, fullPrompt);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Failed to generate image from title: ${message}`);
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
          if (message.includes("Requested entity was not found.")) {
              setError("Your API key may be invalid or lack permissions for this model. Please select a valid API key and try again.");
              setHasApiKey(false);
          } else {
              setError(`Failed to generate explainer video: ${message}`);
          }
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
    setBusinessNames(null);
    setEmailCampaigns(null);
    setEbookIdea(null);
    setPoemContent(null);
    setLyricsVideoStoryboard(null);
    
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

  const handleGenerateLyricsVideo = useCallback(async (lyrics: string) => {
      setIsLoading(true);
      setError(null);
      setLyricsVideoStoryboard(null);
      setLyricsVideoProgress("Step 1/3: Reading lyrics and creating storyboard...");

      try {
          // Step 1: Generate script
          const { scenes: scriptData } = await generateLyricsStoryboard(lyrics);
          
          const initialStoryboard: StoryboardLyricsScene[] = scriptData.map(scene => ({
              ...scene,
              isImageLoading: true,
              isVideoLoading: false,
          }));
          setLyricsVideoStoryboard(initialStoryboard);
          
          // Step 2 & 3: Generate images and videos for each scene
          for (let i = 0; i < initialStoryboard.length; i++) {
              // Generate Image
              setLyricsVideoProgress(`Step 2/3: Generating image for scene ${i + 1} of ${initialStoryboard.length}...`);
              
              const imageUrls = await generateImageFromPrompt(initialStoryboard[i].visualPrompt, 1, '16:9', 'text, letters, words');
              const imageUrl = imageUrls[0];

              setLyricsVideoStoryboard(currentStoryboard => {
                  if (!currentStoryboard) return null;
                  const newStoryboard = [...currentStoryboard];
                  newStoryboard[i] = { ...newStoryboard[i], imageUrl, isImageLoading: false, isVideoLoading: true };
                  return newStoryboard;
              });

              // Generate Video
              setLyricsVideoProgress(`Step 3/3: Animating scene ${i + 1} of ${initialStoryboard.length}...`);
              // Using a short duration and preview for speed and cost-effectiveness
              const videoUrl = await generateVideoFromImage(imageUrl, initialStoryboard[i].motionPrompt, 2, true); 
              
              setLyricsVideoStoryboard(currentStoryboard => {
                  if (!currentStoryboard) return null;
                  const newStoryboard = [...currentStoryboard];
                  newStoryboard[i] = { ...newStoryboard[i], videoUrl, isVideoLoading: false };
                  return newStoryboard;
              });
          }
          setLyricsVideoProgress("Your Lyrics Video storyboard is complete!");
      } catch (e) {
          const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
          if (message.includes("Requested entity was not found.")) {
              setError("Your API key may be invalid or lack permissions for this model. Please select a valid API key and try again.");
              setHasApiKey(false);
          } else {
              setError(`Failed to generate lyrics video: ${message}`);
          }
          setLyricsVideoProgress('');
      } finally {
          setIsLoading(false);
      }
  }, []);

  const handleTranscriptionUpdate = useCallback((chunk: string, isTurnComplete: boolean) => {
      if (isTurnComplete) {
          const fullUtterance = interimTranscriptionRef.current + chunk;
          setFinalTranscription(prev => prev + fullUtterance.trim() + '\n');
          interimTranscriptionRef.current = '';
          setInterimTranscription('');
      } else {
          // The API sends the full interim result for the current utterance.
          interimTranscriptionRef.current = chunk;
          setInterimTranscription(chunk);
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
    try {
      localStorage.setItem(AIRTABLE_CONFIG_KEY, JSON.stringify(config));
      setAirtableConfig(config);
      setIsSettingsModalOpen(false);
      showToast('Airtable settings saved!', 'success');
    } catch (error) {
      console.error("Failed to save Airtable config to local storage:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      showToast(`Could not save settings. Your browser's storage might be full or blocked. Error: ${message}`, 'error', 5000);
    }
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
  const isImageDisplayMode = ['text-to-image', 'image-variations', 'ugc-ad', 'product-studio', 'tshirt-mockup', 'avatar-generator', 'creative-chat', 'image-to-prompt', 'flyer-generator', 'logo-generator', 'thumbnail-generator', 'recreate-thumbnail', 'title-to-image', 'book-cover', 'book-mockup'].includes(mode);
  const isVideoDisplayMode = ['text-to-video', 'animate-image', 'video-green-screen', 'lip-sync', 'gif-generator', 'ugc-video-ad'].includes(mode);
  const isTextDisplayMode = ['blog-post', 'social-media-post', 'email-campaign', 'ebook-idea', 'recipe-post', 'poem-writer'].includes(mode);
  const isBusinessNameDisplayMode = mode === 'business-name-generator';
  const isMusicVideoDisplayMode = mode === 'music-video';
  const isLyricsVideoDisplayMode = mode === 'lyrics-to-video';
  const isAudioDisplayMode = mode === 'audio-to-text';
  const isVideoMode = ['text-to-video', 'animate-image', 'video-green-screen', 'gif-generator', 'explainer-video', 'lyrics-to-video', 'lip-sync', 'ugc-video-ad'].includes(mode);

  if (isVideoMode && !hasApiKey) {
    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
            <Header onSettingsClick={() => setIsSettingsModalOpen(true)} onTTSSettingsClick={() => setIsTTSSettingsModalOpen(true)} />
            <main className="w-full max-w-lg text-center flex-grow flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-indigo-400 mb-4">API Key Required for Video Generation</h2>
                <p className="text-gray-400 mb-6">
                    To use video generation features, you need to select an API key associated with a project that has billing enabled.
                </p>
                {error && <ErrorMessage message={error} />}
                <button
                    onClick={async () => {
                        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
                            await window.aistudio.openSelectKey();
                            setHasApiKey(true); // Optimistically assume success
                            setError(null); // Clear previous errors
                        } else {
                            setError("API key selection is not supported in this environment.");
                        }
                    }}
                    className="w-full flex items-center justify-center px-6 py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all"
                >
                    Select API Key
                </button>
                <p className="text-xs text-gray-500 mt-4">
                    For more information, please visit the{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                        billing documentation
                    </a>.
                </p>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center font-sans">
      <Header onSettingsClick={() => setIsSettingsModalOpen(true)} onTTSSettingsClick={() => setIsTTSSettingsModalOpen(true)} />
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
            
            {mode === 'title-to-image' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Title to Image Generator</h2>
                <TitleToImageGenerator onSubmit={handleGenerateImageFromTitle} isLoading={isLoading} />
              </>
            )}

            {mode === 'book-cover' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Book Cover Generator</h2>
                <BookCoverGenerator onSubmit={handleGenerateBookCover} isLoading={isLoading} />
              </>
            )}

            {mode === 'book-mockup' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Book Mockup Generator</h2>
                <BookMockupGenerator onSubmit={handleGenerateBookMockup} isLoading={isLoading} />
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

            {mode === 'ugc-video-ad' && (
                <>
                    <h2 className="text-xl font-bold text-indigo-400">UGC Video Ad Generator</h2>
                    <UgcVideoAdGenerator
                        onSubmit={handleGenerateUgcVideoAd}
                        isLoading={isLoading}
                        isPreviewLoading={isPreviewLoading}
                        hasPreview={!!previewVideoUrl}
                    />
                    <VideoDurationSelector duration={videoDuration} setDuration={setVideoDuration} isLoading={isAnyLoading} />
                    <VideoStyleSelector selectedStyle={videoStyle} setSelectedStyle={setVideoStyle} isLoading={isAnyLoading} />
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
                <h2 className="text-xl font-bold text-indigo-400">T-Shirt Mockup Generator</h2>
                <TshirtMockupGenerator onSubmit={handleGenerateMockup} isLoading={isLoading} />
              </>
            )}
            
            {mode === 'blog-post' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Blog Post Generator</h2>
                <BlogPostGenerator
                  onSubmit={handleGenerateBlogPost}
                  onGenerateHeader={handleGenerateImageFromTopicIdea}
                  isLoading={isLoading}
                  blogProfiles={blogProfiles}
                  onUpdateProfiles={handleUpdateBlogProfiles}
                />
              </>
            )}
            
            {mode === 'poem-writer' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Poem Writer</h2>
                <PoemWriterGenerator onSubmit={handleGeneratePoem} isLoading={isLoading} />
              </>
            )}

            {mode === 'recipe-post' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Recipe Post Generator</h2>
                <RecipePostGenerator 
                  onSubmit={handleGenerateRecipePost} 
                  isLoading={isLoading}
                  onGenerateHeader={handleGenerateImageFromTopicIdea}
                />
              </>
            )}
            
            {mode === 'social-media-post' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Social Media Post Generator</h2>
                <SocialMediaPostGenerator onSubmit={handleGenerateSocialMediaPost} isLoading={isLoading} />
              </>
            )}

            {mode === 'business-name-generator' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Business Name Generator</h2>
                <BusinessNameGenerator onSubmit={handleGenerateBusinessNames} isLoading={isLoading} />
              </>
            )}
            
            {mode === 'email-campaign' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Email Campaign Builder</h2>
                <EmailCampaignGenerator 
                  onSubmit={handleGenerateEmailCampaign} 
                  isLoading={isLoading}
                  companyProfile={companyProfile}
                  onSaveProfile={handleSaveCompanyProfile}
                />
              </>
            )}
            
            {mode === 'ebook-idea' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Ebook Idea Generator</h2>
                <EbookIdeaGenerator onSubmit={handleGenerateEbookIdea} isLoading={isLoading} />
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
            
            {mode === 'gif-generator' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">GIF Generator</h2>
                <GifGenerator 
                  prompt={videoPrompt}
                  setPrompt={setVideoPrompt}
                  onSubmit={handleGenerateGif}
                  onEnhance={() => handleEnhance(videoPrompt, setVideoPrompt)}
                  isEnhancing={isEnhancing}
                  isLoading={isLoading}
                />
                {groundingSources && <GroundingSourcesDisplay sources={groundingSources} />}
                <VideoStyleSelector selectedStyle={videoStyle} setSelectedStyle={setVideoStyle} isLoading={isAnyLoading} />
              </>
            )}

            {mode === 'explainer-video' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Explainer Video Generator</h2>
                <ExplainerVideoGenerator onSubmit={handleGenerateExplainerVideo} isLoading={isLoading} />
              </>
            )}

            {mode === 'lyrics-to-video' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Lyrics to Video Generator</h2>
                <LyricsToVideoGenerator onSubmit={handleGenerateLyricsVideo} isLoading={isLoading} />
              </>
            )}
            
            {mode === 'lip-sync' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Lip Sync Generator</h2>
                <LipSyncGenerator onSubmit={handleGenerateLipSyncVideo} isLoading={isLoading} />
              </>
            )}

            {mode === 'music-video' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Music Video Script Generator</h2>
                <MusicVideoGenerator onSubmit={handleGenerateMusicVideo} isLoading={isLoading} />
              </>
            )}
            
            {mode === 'audio-to-text' && (
              <>
                <h2 className="text-xl font-bold text-indigo-400">Audio-to-Text Transcription</h2>
                <AudioToTextGenerator
                  onTranscriptionUpdate={handleTranscriptionUpdate}
                  onRecordingStateChange={setIsRecording}
                  setError={setError}
                  isFileProcessing={isLoading}
                  setIsFileProcessing={setIsLoading}
                />
              </>
            )}
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
                mode={mode}
              />
            )}
            {isTextDisplayMode && (
              <>
                {(mode === 'blog-post' || mode === 'recipe-post') && <BlogPostDisplay content={blogPostContent} isLoading={isLoading} onGenerateHeaderClick={handleGenerateHeaderImage} />}
                {mode === 'poem-writer' && <PoemDisplay content={poemContent} isLoading={isLoading} />}
                {mode === 'social-media-post' && <SocialMediaPostDisplay posts={socialMediaPosts} isLoading={isLoading} onGenerateImageClick={handleGenerateImageForPost} />}
                {mode === 'email-campaign' && <EmailCampaignDisplay campaigns={emailCampaigns} isLoading={isLoading} />}
                {mode === 'ebook-idea' && <EbookIdeaDisplay idea={ebookIdea} isLoading={isLoading} onGenerateCoverClick={handleGenerateCoverForEbook} />}
              </>
            )}
             {isBusinessNameDisplayMode && (
              <BusinessNameDisplay names={businessNames} isLoading={isLoading} />
            )}
            {mode === 'explainer-video' && (
              <ExplainerVideoDisplay storyboard={videoStoryboard} isLoading={isLoading} progressMessage={explainerVideoProgress} />
            )}
            {isMusicVideoDisplayMode && (
              <MusicVideoDisplay storyboard={musicVideoStoryboard} isLoading={isLoading} />
            )}
            {isLyricsVideoDisplayMode && (
              <LyricsVideoDisplay storyboard={lyricsVideoStoryboard} isLoading={isLoading} progressMessage={lyricsVideoProgress} />
            )}
             {isAudioDisplayMode && (
              <AudioTranscriptionDisplay
                finalText={finalTranscription}
                interimText={interimTranscription}
                isRecording={isRecording}
              />
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
      <TTSSettingsModal isOpen={isTTSSettingsModalOpen} onClose={() => setIsTTSSettingsModalOpen(false)} />
      <Toast message={toast.message} type={toast.type} show={toast.show} />
      <AIAvatar mode={mode} error={error} isLoading={isLoading} isPreviewLoading={isPreviewLoading} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TTSSettingsProvider>
      <AppContent />
    </TTSSettingsProvider>
  );
};


export default App;