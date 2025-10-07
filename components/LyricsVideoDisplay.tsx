import React from 'react';
import Loader from './Loader';
import { LyricsScene } from '../services/geminiService';

export interface StoryboardLyricsScene extends LyricsScene {
    imageUrl?: string;
    videoUrl?: string;
    isImageLoading?: boolean;
    isVideoLoading?: boolean;
}

interface LyricsVideoDisplayProps {
  storyboard: StoryboardLyricsScene[] | null;
  isLoading: boolean;
  progressMessage: string;
}

const LyricsVideoDisplay: React.FC<LyricsVideoDisplayProps> = ({ storyboard, isLoading, progressMessage }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading && (!storyboard || storyboard.length === 0) ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message={progressMessage || "Generating video from lyrics..."} />
        </div>
      ) : storyboard ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-6">
          <h3 className="text-xl font-bold text-indigo-400 text-center">{progressMessage}</h3>
          {storyboard.map((scene, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="flex flex-col justify-center gap-2">
                <p className="text-lg text-gray-300 leading-relaxed italic">"{scene.lyric}"</p>
              </div>
              <div className="relative w-full aspect-video bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                {scene.videoUrl ? (
                  <video src={scene.videoUrl} controls autoPlay muted loop className="w-full h-full object-contain rounded-md" />
                ) : scene.imageUrl ? (
                  <>
                    <img src={scene.imageUrl} alt={`Scene for "${scene.lyric}"`} className="w-full h-full object-cover" />
                    {scene.isVideoLoading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Loader message="Animating..." />
                        </div>
                    )}
                  </>
                ) : (
                   <Loader message="Generating visual..." />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V4a1 1 0 00-.804-1z" /></svg>
            <p className="mt-2 text-lg font-semibold">Your lyrics video will appear here</p>
            <p className="text-sm">Paste your lyrics and click "Generate" to start.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LyricsVideoDisplay;
