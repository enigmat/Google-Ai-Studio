

import React, { useState, useEffect, useRef } from 'react';
import { GeneratorMode } from '../constants';

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
  'image-variations': [
    "Generate up to 12 variations at once to find the perfect image.",
    "All variations will use the same prompt, style, and aspect ratio.",
    "Use a detailed prompt to get diverse and interesting results across your variations.",
  ],
  'flyer-generator': [
    "Be specific with your event details for the best results!",
    "A primary color can help the AI match your brand's style.",
    "The 'Modern & Clean' style is great for professional events.",
  ],
  'explainer-video': [
    "Paste the full text from a blog post or product page for a comprehensive video.",
    "The AI will first create a script, then generate video clips for each scene.",
    "This creates a storyboard. You can use a video editor to combine the clips and add the voiceover!",
  ],
  'music-video': [
    "Describe the song's mood and genre. Is it an upbeat pop track or a moody ballad?",
    "The AI will generate a 5-scene storyboard for a 30-second video.",
    "Use the 'Visuals' description for each scene as a prompt in the Text-to-Video generator to create your clips!",
  ],
  'video-green-screen': [
    "Describe the subject or action clearly, like 'a person waving' or 'a cat chasing a laser pointer'.",
    "The AI will automatically place your subject on a green screen, ready for you to use in video editing software!",
    "Download the video and use the 'Chroma Key' or 'Ultra Key' effect in your editor to remove the green background.",
  ],
  'avatar-generator': [
    "Combine different options to create a unique character!",
    "The 'Photorealistic' style can create some amazing portraits.",
    "Try adding specific accessories like 'a silver necklace' or 'cybernetic eye patch' for more detail.",
  ],
  'logo-generator': [
    "Be descriptive with your icon! Instead of 'a bird', try 'a minimalist hummingbird in flight'.",
    "Minimalist and Geometric styles often produce the cleanest, most professional results.",
    "Try specifying a color palette like 'warm earth tones' or 'cool blues and greys' to match your brand.",
  ],
  'thumbnail-generator': [
    "A strong, clear title is key for a good thumbnail.",
    "Use a contrasting color to make your text pop!",
    "Think about what would make you click on the video. Be bold!",
  ],
  'recreate-thumbnail': [
    "Upload a high-quality thumbnail for the best results!",
    "Use the 'High' inspiration weight to copy the style very closely.",
    "Be descriptive with your changes. Instead of 'a person', try 'a gamer with headphones looking surprised'.",
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
    "For best results, upload a design with a transparent background (PNG).",
    "The AI will automatically adjust your design to fit the perspective and lighting of the T-shirt.",
    "Try different shirt colors to see what looks best with your design!",
  ],
  'blog-post': [
    "Be specific with your topic for a more focused article.",
    "Choosing the right 'Tone of Voice' can make your post resonate with your audience.",
    "Defining a 'Target Audience' helps me tailor the language and complexity.",
  ],
  'social-media-post': [
    "Select the right platform! The AI tailors the post length and style for Twitter/X, LinkedIn, or Instagram.",
    "Click 'Generate Image' on a post to create a perfectly matched visual for it!",
    "Don't like the first few options? Just click 'Generate Posts' again for a fresh batch of ideas.",
  ],
  'title-to-image': [
    "Think like a movie poster designer! What's the core emotion of your title?",
    "A good synopsis with strong keywords can dramatically improve the result.",
    "The AI is told not to add text, so you get a clean piece of art to work with.",
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
            className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-400 animate-pulse"
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