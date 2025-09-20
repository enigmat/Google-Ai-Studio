import React, { useState, useEffect, useRef } from 'react';

type GeneratorMode = 'text-to-image' | 'ugc-ad' | 'text-to-video' | 'animate-image' | 'image-to-prompt' | 'creative-chat' | 'product-studio' | 'tshirt-mockup' | 'blog-post' | 'avatar-generator';

interface AIAvatarProps {
  mode: GeneratorMode;
  error: string | null;
  isLoading: boolean;
  isPreviewLoading: boolean;
}

const MODE_TIPS: Record<GeneratorMode, string[]> = {
  'text-to-image': [
    "Try using the 'Enhance Prompt' button for more detailed images!",
    "Experiment with different artistic styles to change the look.",
    "Negative prompts help you remove unwanted elements from your image.",
  ],
  'avatar-generator': [
    "Combine different options to create a unique character!",
    "The 'Photorealistic' style can create some amazing portraits.",
    "Try adding specific accessories like 'a silver necklace' or 'cybernetic eye patch' for more detail.",
  ],
  'creative-chat': [
    "Start by describing an image. Then, tell me what to change!",
    "You can say things like 'add sunglasses' or 'make the background a space nebula'.",
    "Use the 'Start Over' button to clear the image and begin a new conversation.",
  ],
  'image-to-prompt': [
    "Upload a clear and interesting image for the best prompt results.",
    "The AI will describe your image, turning it into a detailed text prompt.",
    "After generating, you can edit the prompt to refine your next creation!",
  ],
  'ugc-ad': [
    "Use a clear, high-quality product image for the best results.",
    "A detailed product description helps the AI create a more relevant ad.",
  ],
  'text-to-video': [
    "Start with 'Generate Preview' to quickly test your video idea.",
    "Cinematic styles can add a dramatic flair to your creations.",
    "Longer videos take more time but can tell a bigger story.",
  ],
  'animate-image': [
    "Choose an image with a clear subject to animate.",
    "Motion prompts like 'gentle zoom in' or 'wind blowing softly' work great!",
    "The AI will bring your static image to life based on your words.",
  ],
  'product-studio': [
    "Upload a clear image of your product against a simple background for best background removal.",
    "Describe a scene that matches your brand's aesthetic.",
    "Try different scene prompts to see your product in various settings!",
  ],
  'tshirt-mockup': [
    "For best results, upload a design with a transparent background (like a .PNG file).",
    "The AI will automatically adjust your design to the wrinkles and lighting of the shirt.",
    "Try your design on different colored shirts to see what looks best!",
  ],
  'blog-post': [
    "Be specific with your topic for a more focused article.",
    "Choosing the right 'Tone of Voice' can make your post resonate with your audience.",
    "Defining a 'Target Audience' helps me tailor the language and complexity.",
  ],
};

const LOADING_TIPS = [
  "Patience is a virtue... especially with cutting-edge AI.",
  "The AI is dreaming up something amazing for you.",
  "Good things come to those who wait for GPUs to process.",
  "Your masterpiece is being forged in the digital fires.",
];

const ERROR_TIPS = [
    "Don't worry, even geniuses have off days. Try a different prompt.",
    "The AI seems a bit confused. Could you rephrase your request?",
    "Something went wrong. Checking your prompt for clarity might help.",
];

const WELCOME_MESSAGE = "Hello! I'm your creative assistant. Need a tip? I'm here to help!";

const AIAvatar: React.FC<AIAvatarProps> = ({ mode, error, isLoading, isPreviewLoading }) => {
  const [message, setMessage] = useState<string | null>(WELCOME_MESSAGE);
  const [isVisible, setIsVisible] = useState(true);
  const [isInteracted, setIsInteracted] = useState(false);
  
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tipIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastShownTip = useRef<Record<string, number>>({});

  const getRandomTip = (tips: string[], category: string): string => {
      if (!lastShownTip.current[category]) {
          lastShownTip.current[category] = -1;
      }
      let nextIndex;
      do {
          nextIndex = Math.floor(Math.random() * tips.length);
      } while (tips.length > 1 && nextIndex === lastShownTip.current[category]);
      
      lastShownTip.current[category] = nextIndex;
      return tips[nextIndex];
  };

  const showMessage = (newMessage: string, duration: number = 8000) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    setMessage(newMessage);
    setIsVisible(true);
    
    messageTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };
  
  const startTipInterval = () => {
      if (tipIntervalRef.current) {
          clearInterval(tipIntervalRef.current);
      }
      tipIntervalRef.current = setInterval(() => {
          if (!isLoading && !isPreviewLoading && !error && !isInteracted) {
             const tips = MODE_TIPS[mode];
             showMessage(getRandomTip(tips, mode));
          }
      }, 20000); // Show a new tip every 20 seconds
  };
  
  // Handle initial welcome and start tip interval
  useEffect(() => {
    showMessage(WELCOME_MESSAGE);
    startTipInterval();
    
    return () => {
      if (tipIntervalRef.current) clearInterval(tipIntervalRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    }
  }, []);

  // Handle mode changes
  useEffect(() => {
    if (!isLoading && !isPreviewLoading && !error) {
        setIsInteracted(false); // Reset interaction on mode change
        const tips = MODE_TIPS[mode];
        showMessage(getRandomTip(tips, `mode-${mode}`));
        startTipInterval();
    } else {
        if (tipIntervalRef.current) clearInterval(tipIntervalRef.current);
    }
  }, [mode]);

  // Handle loading state
  useEffect(() => {
    if (isLoading || isPreviewLoading) {
      setIsInteracted(false);
      const tip = getRandomTip(LOADING_TIPS, 'loading');
      showMessage(tip, 10000);
    }
  }, [isLoading, isPreviewLoading]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setIsInteracted(false);
      const tip = getRandomTip(ERROR_TIPS, 'error');
      // Show error messages for longer
      showMessage(`Uh oh! ${tip}`, 12000);
    }
  }, [error]);

  const handleAvatarClick = () => {
    setIsVisible(false);
    setIsInteracted(true);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    if (tipIntervalRef.current) clearInterval(tipIntervalRef.current);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-end gap-3">
        <div 
          className={`
            bg-gray-700 text-white p-3 rounded-lg rounded-br-none shadow-xl max-w-xs text-sm
            transition-all duration-300 ease-in-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
          role="status"
          aria-live="polite"
        >
            {message}
        </div>
        <button 
            onClick={handleAvatarClick}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400 animate-pulse-slow"
            aria-label="AI Assistant"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.5 3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-3.001 7.502c.011.012.022.023.034.034a.5.5 0 00.707 0l.034-.034c.023-.024.047-.047.072-.071a14.04 14.04 0 001.196-1.523c.316-.44.62-1.02.82-1.748l.06-.217a3.5 3.5 0 00-6.992 0l.06.217c.2.728.504 1.309.82 1.748.33.456.713.91 1.196 1.523.025.024.049.047.072.071zM4.5 10c0-1.103.897-2 2-2h7c1.103 0 2 .897 2 2v2c0 1.103-.897 2-2 2h-1.586l-.707.707a.5.5 0 01-.707 0L9.086 14H6.5c-1.103 0-2-.897-2-2v-2z" />
            </svg>
        </button>
    </div>
  );
};

export default AIAvatar;