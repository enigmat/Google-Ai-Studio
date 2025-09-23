import React from 'react';
import Loader from './Loader';
import { VideoScene } from '../services/geminiService';

interface StoryboardScene extends VideoScene {
    videoUrl?: string;
}

interface ExplainerVideoDisplayProps {
  storyboard: StoryboardScene[] | null;
  isLoading: boolean;
  progressMessage: string;
}

const ExplainerVideoDisplay: React.FC<ExplainerVideoDisplayProps> = ({ storyboard, isLoading, progressMessage }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading && (!storyboard || storyboard.length === 0) ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message={progressMessage || "Generating explainer video..."} />
        </div>
      ) : storyboard ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-6">
          <h3 className="text-xl font-bold text-indigo-400 text-center">{progressMessage}</h3>
          {storyboard.map((scene, index) => (
            <div key={scene.sceneNumber} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-indigo-400">Scene {scene.sceneNumber}</h4>
                <p className="text-sm text-gray-300 leading-relaxed italic">"{scene.script}"</p>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-semibold text-gray-400">Visuals:</span> {scene.visualDescription}
                </p>
              </div>
              <div className="w-full aspect-video bg-gray-800 rounded-md flex items-center justify-center">
                {scene.videoUrl ? (
                  <video src={scene.videoUrl} controls autoPlay muted loop className="w-full h-full object-contain rounded-md" />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="animate-spin mx-auto h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-xs mt-2">Generating video...</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-lg font-semibold">Your video storyboard will appear here</p>
            <p className="text-sm">Paste your text and click "Generate" to start.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplainerVideoDisplay;