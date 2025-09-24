

import React from 'react';
import { GeneratorMode } from '../constants';

interface ModeSelectorProps {
  mode: GeneratorMode;
  setMode: (mode: GeneratorMode) => void;
}

// Reusable Button component for the selector
const ModeButton: React.FC<{
    currentMode: GeneratorMode;
    targetMode: GeneratorMode;
    setMode: (mode: GeneratorMode) => void;
    children: React.ReactNode;
}> = ({ currentMode, targetMode, setMode, children }) => {
    const commonButtonClasses = "w-full p-2 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800";
    const isActive = currentMode === targetMode;
    const buttonClasses = `${commonButtonClasses} ${isActive ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700'}`;

    return (
        <button onClick={() => setMode(targetMode)} className={buttonClasses}>
            {children}
        </button>
    );
};


const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Category: Google Image Generator */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1">Image Generation</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 w-full bg-gray-800 rounded-lg p-1 border border-gray-700">
            <ModeButton currentMode={mode} targetMode="text-to-image" setMode={setMode}>Text-to-Image</ModeButton>
            <ModeButton currentMode={mode} targetMode="image-variations" setMode={setMode}>Variations</ModeButton>
            <ModeButton currentMode={mode} targetMode="avatar-generator" setMode={setMode}>Avatar</ModeButton>
            <ModeButton currentMode={mode} targetMode="creative-chat" setMode={setMode}>Creative Chat</ModeButton>
            <ModeButton currentMode={mode} targetMode="image-to-prompt" setMode={setMode}>Image-to-Prompt</ModeButton>
        </div>
      </div>

      {/* Category: Content & Marketing */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1">Content & Marketing</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 w-full bg-gray-800 rounded-lg p-1 border border-gray-700">
            <ModeButton currentMode={mode} targetMode="logo-generator" setMode={setMode}>Logo</ModeButton>
            <ModeButton currentMode={mode} targetMode="thumbnail-generator" setMode={setMode}>Thumbnail</ModeButton>
            <ModeButton currentMode={mode} targetMode="recreate-thumbnail" setMode={setMode}>Recreate</ModeButton>
            <ModeButton currentMode={mode} targetMode="product-studio" setMode={setMode}>Product Studio</ModeButton>
            <ModeButton currentMode={mode} targetMode="tshirt-mockup" setMode={setMode}>T-shirt Mockup</ModeButton>
            <ModeButton currentMode={mode} targetMode="ugc-ad" setMode={setMode}>UGC Ad</ModeButton>
            <ModeButton currentMode={mode} targetMode="flyer-generator" setMode={setMode}>Flyer</ModeButton>
            <ModeButton currentMode={mode} targetMode="blog-post" setMode={setMode}>Blog Post</ModeButton>
            <ModeButton currentMode={mode} targetMode="social-media-post" setMode={setMode}>Social Media</ModeButton>
        </div>
      </div>
      
      {/* Category: Video Tools */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2 px-1">Video Tools</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 w-full bg-gray-800 rounded-lg p-1 border border-gray-700">
            <ModeButton currentMode={mode} targetMode="text-to-video" setMode={setMode}>Text-to-Video</ModeButton>
            <ModeButton currentMode={mode} targetMode="video-green-screen" setMode={setMode}>Green Screen</ModeButton>
            <ModeButton currentMode={mode} targetMode="animate-image" setMode={setMode}>Animate Image</ModeButton>
            <ModeButton currentMode={mode} targetMode="explainer-video" setMode={setMode}>Explainer Video</ModeButton>
            <ModeButton currentMode={mode} targetMode="music-video" setMode={setMode}>Music Video</ModeButton>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;