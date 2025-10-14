import React, { useState } from 'react';
import Loader from './Loader';
import { EbookIdea } from '../services/geminiService';
import TTSButton from './TTSButton';

interface EbookIdeaDisplayProps {
  idea: EbookIdea | null;
  isLoading: boolean;
  onGenerateCoverClick: (title: string, synopsis: string) => void;
}

const EbookIdeaDisplay: React.FC<EbookIdeaDisplayProps> = ({ idea, isLoading, onGenerateCoverClick }) => {
  const [isCopied, setIsCopied] = useState(false);

  const formatTextForCopy = (ideaToCopy: EbookIdea): string => {
    return `Title: ${ideaToCopy.title}\n\nLogline: ${ideaToCopy.logline}\n\nSummary:\n${ideaToCopy.summary}\n\nCharacters:\n${ideaToCopy.characters.map(c => `- ${c.name}: ${c.description}`).join('\n')}\n\nThemes:\n- ${ideaToCopy.themes.join('\n- ')}`;
  };

  const handleCopy = () => {
    if (!idea) return;
    navigator.clipboard.writeText(formatTextForCopy(idea)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const textToSpeak = idea ? formatTextForCopy(idea) : '';

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message="Brewing a new story..." />
        </div>
      ) : idea ? (
        <>
          <div className="absolute top-3 right-3 flex gap-2">
             <TTSButton textToSpeak={textToSpeak} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors" />
            <button onClick={handleCopy} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors">
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none w-full h-full overflow-y-auto pr-2 pb-16">
            <h1 className="!text-purple-400 !mb-2">{idea.title}</h1>
            <p className="italic text-gray-400 !mt-0">{idea.logline}</p>
            
            <h2 className="!text-indigo-400">Summary</h2>
            <p className="whitespace-pre-wrap">{idea.summary}</p>

            <h2 className="!text-indigo-400">Main Characters</h2>
            <ul>
              {idea.characters.map(char => (
                <li key={char.name}><strong>{char.name}:</strong> {char.description}</li>
              ))}
            </ul>

            <h2 className="!text-indigo-400">Key Themes</h2>
            <div className="flex flex-wrap gap-2">
                {idea.themes.map(theme => (
                    <span key={theme} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">{theme}</span>
                ))}
            </div>
          </div>
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                    onClick={() => onGenerateCoverClick(idea.title, idea.summary)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2.586l-1.707-1.707a1 1 0 00-1.414 0L7 14.586V9a1 1 0 00-2 0v6.586l-1.293-1.293a1 1 0 00-1.414 1.414L4.586 17H5V5zm10 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                    Generate Cover Art
                </button>
            </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <p className="mt-2 text-lg font-semibold">Your ebook ideas will appear here</p>
            <p className="text-sm">Use the filters to generate a new book concept.</p>
          </div>
        </div>
      )}
      <style>{`
        .prose h1, .prose h2 {
          border: none;
        }
      `}</style>
    </div>
  );
};

export default EbookIdeaDisplay;