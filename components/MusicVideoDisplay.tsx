import React from 'react';
import Loader from './Loader';
import { MusicVideoScene } from '../services/geminiService';

interface MusicVideoDisplayProps {
  storyboard: MusicVideoScene[] | null;
  isLoading: boolean;
}

const MusicVideoDisplay: React.FC<MusicVideoDisplayProps> = ({ storyboard, isLoading }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Directing your music video..." />
        </div>
      ) : storyboard ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-6">
          <h3 className="text-xl font-bold text-indigo-400 text-center mb-4">Music Video Storyboard</h3>
          {storyboard.map((scene) => (
            <div key={scene.sceneNumber} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-indigo-400">Scene {scene.sceneNumber}</h4>
                    <span className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded">{scene.timestamp}</span>
                </div>
                <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-gray-400">Shot:</span> <span className="text-gray-300">{scene.cameraShot}</span></p>
                    <p><span className="font-semibold text-gray-400">Action:</span> <span className="text-gray-300">{scene.action}</span></p>
                    <p><span className="font-semibold text-gray-400">Visuals:</span> <span className="text-gray-300">{scene.visualDescription}</span></p>
                </div>
            </div>
          ))}
          <p className="text-xs text-gray-500 text-center pt-4">Tip: Use the 'Visuals' description in the Text-to-Video generator to create clips for each scene!</p>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0116 8v4a1 1 0 01-1.447.894l-2-1.111V8.222l2-1.116z" /></svg>
            <p className="mt-2 text-lg font-semibold">Your music video script will appear here</p>
            <p className="text-sm">Describe your song to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicVideoDisplay;
