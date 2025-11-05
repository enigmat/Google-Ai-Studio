import React, { useState } from 'react';
import Loader from './Loader';
import { EbookTopic } from '../services/geminiService';
import TTSButton from './TTSButton';

interface EbookTopicDisplayProps {
  topics: EbookTopic[] | null;
  isLoading: boolean;
  onSelectTopic: (topic: string, description: string) => void;
  sources: any[] | null;
  onSaveTopics: (topics: EbookTopic[]) => void;
}

const GroundingSourcesDisplay: React.FC<{ sources: any[] }> = ({ sources }) => (
    <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Information sourced from:</h4>
        <ul className="flex flex-wrap gap-2">
            {sources.map((source, index) => {
                const uri = source.web?.uri;
                if (!uri) return null;
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


const EbookTopicDisplay: React.FC<EbookTopicDisplayProps> = ({ topics, isLoading, onSelectTopic, sources, onSaveTopics }) => {
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    if (topics) {
      onSaveTopics(topics);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Searching for trending topics..." />
        </div>
      ) : topics ? (
        <div className="w-full h-full overflow-y-auto pr-2 space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={justSaved || isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {justSaved ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            <span>Saved!</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-3.125L5 16V4z" /></svg>
                            <span>Save All Topics</span>
                        </>
                    )}
                </button>
            </div>
           {sources && sources.length > 0 && <GroundingSourcesDisplay sources={sources} />}
          {topics.map((item, index) => (
            <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col gap-3">
                <div>
                    <h3 className="text-xl font-bold text-indigo-400">{item.topic}</h3>
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map(kw => <span key={kw} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{kw}</span>)}
                </div>
                <div className="flex justify-end items-center mt-2 gap-2 border-t border-gray-700/50 pt-3">
                  <TTSButton textToSpeak={`Topic: ${item.topic}. Description: ${item.description}`} className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600" />
                  <button
                      onClick={() => onSelectTopic(item.topic, item.description)}
                      className="flex-grow text-sm font-semibold px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                      Write Chapter for this Topic
                  </button>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <p className="mt-2 text-lg font-semibold">Your ebook topic ideas will appear here</p>
            <p className="text-sm">Enter a keyword to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookTopicDisplay;