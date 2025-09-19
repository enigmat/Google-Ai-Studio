import React from 'react';

type GeneratorMode = 'text-to-image' | 'ugc-ad' | 'text-to-video' | 'animate-image' | 'image-to-prompt' | 'creative-chat' | 'product-studio' | 'tshirt-mockup' | 'blog-post';

interface ModeSelectorProps {
  mode: GeneratorMode;
  setMode: (mode: GeneratorMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  const commonButtonClasses = "w-full p-2 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800";
  const activeButtonClasses = "bg-indigo-600 text-white";
  const inactiveButtonClasses = "bg-transparent text-gray-400 hover:bg-gray-700";
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full bg-gray-800 rounded-lg p-1 border border-gray-700">
      <button
        onClick={() => setMode('text-to-image')}
        className={`${commonButtonClasses} ${mode === 'text-to-image' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        Text-to-Image
      </button>
       <button
        onClick={() => setMode('creative-chat')}
        className={`${commonButtonClasses} ${mode === 'creative-chat' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        Creative Chat
      </button>
      <button
        onClick={() => setMode('image-to-prompt')}
        className={`${commonButtonClasses} ${mode === 'image-to-prompt' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        Image-to-Prompt
      </button>
       <button
        onClick={() => setMode('blog-post')}
        className={`${commonButtonClasses} ${mode === 'blog-post' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        Blog Post
      </button>
      <button
        onClick={() => setMode('product-studio')}
        className={`${commonButtonClasses} ${mode === 'product-studio' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        Product Studio
      </button>
      <button
        onClick={() => setMode('tshirt-mockup')}
        className={`${commonButtonClasses} ${mode === 'tshirt-mockup' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        T-shirt Mockup
      </button>
      <button
        onClick={() => setMode('ugc-ad')}
        className={`${commonButtonClasses} ${mode === 'ugc-ad' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        UGC Ad
      </button>
      <button
        onClick={() => setMode('text-to-video')}
        className={`${commonButtonClasses} ${mode === 'text-to-video' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        Text-to-Video
      </button>
      <button
        onClick={() => setMode('animate-image')}
        className={`${commonButtonClasses} ${mode === 'animate-image' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        Animate Image
      </button>
    </div>
  );
};

export default ModeSelector;