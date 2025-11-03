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
  'lyrics-to-video': [
    "I can't listen to MP3s, but I love reading lyrics! Paste them in to get started.",
    "The AI will break your song into scenes, create an image, and then a short video for each part.",
    "For best results, use well-formatted lyrics with clear verses and choruses.",
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
  'ugc-video-ad': [
    "Upload a clear product image. This will be the star of your video!",
    "Describe a simple action for the motion prompt, like 'slowly rotating' or 'a hand picking up the product'.",
    "Keep the video duration short for a punchy social media ad."
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
    "Try the 'Get Trending Ideas' button to find popular topics for today!",
    "Choosing the right 'Tone of Voice' can make your post resonate with your audience.",
  ],
  'recipe-post': [
    "Let me know the name of the dish you'd like to make!",
    "I can accommodate dietary needs like vegetarian, vegan, or gluten-free.",
    "After generating the recipe, click 'Generate Header Image' to create a delicious photo of your dish!",
  ],
  'social-media-post': [
    "Select the right platform! The AI tailors the post length and style for Twitter/X, LinkedIn, or Instagram.",
    "Click 'Generate Image' on a post to create a perfectly matched visual for it!",
    "Don't like the first few options? Just click 'Generate Posts' again for a fresh batch of ideas.",
  ],
  'poem-writer': [
    "Feeling stuck? Try a simple topic like 'the moon' or 'a rainy day'.",
    "Combining an unusual style and mood can lead to creative results!",
    "Don't be afraid to experiment with different poetic forms."
  ],
  'title-to-image': [
    "Think like a movie poster designer! What's the core emotion of your title?",
    "A good synopsis with strong keywords can dramatically improve the result.",
    "The AI is told not to add text, so you get a clean piece of art to work with.",
  ],
  'lip-sync': [
    "For best results, use a clear, front-facing image of a person.",
    "The AI will transcribe your audio and animate the face to match the words.",
    "Clear audio without background noise will produce a better transcription and animation.",
  ],
  'business-name-generator': [
    "Be descriptive! The more I know about your business, the better the names will be.",
    "Try adding keywords that you want to see in your name, like 'tech', 'green', or 'global'.",
    "Experiment with different naming styles. 'Modern' names are often short and catchy, while 'Classic' names feel more established.",
  ],
  'email-campaign': [
    "Provide a detailed product description for the most relevant email copy.",
    "Select the campaign type that best matches your goal, whether it's a launch, a sale, or a newsletter.",
    "Experiment with different tones to see which one best fits your brand's voice.",
  ],
  // FIX: Added missing 'ebook-idea' property to the MODE_TIPS object.
  'ebook-idea': [
    "Combine different genres and themes for a unique story idea!",
    "The 'Protagonist' field helps you define your main character from the start.",
    "Click 'Generate Cover Art' on your idea to visualize the book!",
  ],
  // FIX: Add missing 'book-cover' property to the MODE_TIPS object to satisfy the Record type.
  'book-cover': [
    "A detailed synopsis with keywords about the mood and genre will create a more powerful cover.",
    "The AI generates the artwork only. You can add the title and author name later in an image editor.",
    "Experiment with different artistic styles like 'Photorealistic' or 'Fantasy Painting' to match your book's tone.",
  ],
  'book-mockup': [
    "Upload a cover design with a 9:16 aspect ratio for the best fit.",
    "The AI will realistically wrap your flat design onto the 3D book shape.",
    "Use this to create promotional images for your book launch!",
  ],
  // FIX: Added missing 'gif-generator' property to the MODE_TIPS object.
  'gif-generator': [
    "Describe an action that would look good in a loop, like a dancing cat or a spinning logo.",
    "The AI generates a short, looping video. You can download it as an MP4 and convert it to a GIF using an online tool.",
    "Adding 'looping animation' or 'animated GIF' to your prompt can help guide the style."
  ],
  // FIX: Added missing 'audio-to-text' mode to satisfy the Record<GeneratorMode, string[]> type.
  'audio-to-text': [
    "Click the microphone to start recording. I'll transcribe your speech in real-time.",
    "For best results, speak clearly and in a quiet environment.",
    "The transcription will appear on the right. You can copy the full text when you're done.",
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