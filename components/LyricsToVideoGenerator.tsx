import React, { useState } from 'react';

interface LyricsToVideoGeneratorProps {
  onSubmit: (textContent: string) => void;
  isLoading: boolean;
}

const LyricsToVideoGenerator: React.FC<LyricsToVideoGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [lyrics, setLyrics] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lyrics.trim() && !isLoading) {
      onSubmit(lyrics);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="lyrics-content" className="block text-sm font-semibold text-gray-400 mb-1">
          Paste song lyrics here
        </label>
        <textarea
          id="lyrics-content"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="e.g., In the twilight glow, I see you..."
          className="w-full h-64 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
          disabled={isLoading}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !lyrics.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Generating...
          </>
        ) : (
          'Generate Lyrics Video'
        )}
      </button>
    </form>
  );
};

export default LyricsToVideoGenerator;
