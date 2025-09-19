import React, { useState, useEffect, useRef } from 'react';

interface CreativeChatProps {
  onSubmit: (prompt: string) => void;
  onSave: () => void;
  onReset: () => void;
  chatHistory: string[];
  currentImage: string | null;
  isLoading: boolean;
}

const CreativeChat: React.FC<CreativeChatProps> = ({ onSubmit, onSave, onReset, chatHistory, currentImage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleFormSubmit(event);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-grow bg-gray-800/50 p-3 rounded-lg border border-gray-700 min-h-[200px] max-h-[300px] overflow-y-auto">
        {chatHistory.length === 0 ? (
          <p className="text-gray-400 h-full flex items-center justify-center">
            Chat history will appear here. Start by describing an image...
          </p>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} className="mb-2 p-2 bg-gray-700/60 rounded-md text-gray-200 text-sm">
                <span className="font-semibold text-indigo-400">You: </span>{message}
            </div>
          ))
        )}
        <div ref={historyEndRef} />
      </div>
      
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={currentImage ? "What should we change or add?" : "Describe the image you want to create..."}
          className="w-full h-24 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
          disabled={isLoading}
          aria-label="Chat prompt"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
                type="button"
                onClick={onReset}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-red-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
                Start Over
            </button>
            <button
                type="button"
                onClick={onSave}
                disabled={isLoading || !currentImage}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-green-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
                Save Image
            </button>
            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Thinking...
                    </>
                ) : "Send"}
            </button>
        </div>
      </form>
    </div>
  );
};

export default CreativeChat;