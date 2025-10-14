import React, { useState } from 'react';
import TTSButton from './TTSButton';

interface AudioTranscriptionDisplayProps {
  finalText: string;
  interimText: string;
  isRecording: boolean;
}

const AudioTranscriptionDisplay: React.FC<AudioTranscriptionDisplayProps> = ({ finalText, interimText, isRecording }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = () => {
    const fullText = (finalText + interimText).trim();
    if (!fullText) return;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const hasText = (finalText + interimText).trim().length > 0;

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {hasText && (
          <div className="absolute top-3 right-3 flex gap-2">
            <TTSButton textToSpeak={finalText + interimText} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors" />
            <button
              onClick={handleCopy}
              disabled={!hasText}
              className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" /></svg>
              {copyStatus === 'copied' ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
      )}
      <div className="flex-grow w-full h-full overflow-y-auto pr-2 pb-4 text-lg leading-relaxed">
        {hasText ? (
          <>
            <span className="text-gray-200 whitespace-pre-wrap">{finalText}</span>
            <span className="text-indigo-300 whitespace-pre-wrap">{interimText}</span>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                <path d="M5.5 8.5a.5.5 0 01.5.5v1a4 4 0 004 4H10a.5.5 0 010 1H8.5a5 5 0 01-5-5v-1a.5.5 0 01.5-.5z" />
                <path d="M10 12H9.5a4 4 0 00-4-4v-1a.5.5 0 011 0v1a3 3 0 013 3z" />
              </svg>
              <p className="mt-2 text-lg font-semibold">Your transcription will appear here</p>
              <p className="text-sm">Click "Start Recording" to begin.</p>
            </div>
          </div>
        )}
      </div>
       {isRecording && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm font-semibold text-red-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Recording
        </div>
      )}
    </div>
  );
};

export default AudioTranscriptionDisplay;