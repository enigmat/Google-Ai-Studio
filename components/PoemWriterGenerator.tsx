import React, { useState } from 'react';
import { POEM_STYLES, POEM_MOODS } from '../constants';

interface PoemWriterGeneratorProps {
  onSubmit: (topic: string, style: string, mood: string) => void;
  isLoading: boolean;
}

const PoemWriterGenerator: React.FC<PoemWriterGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState(POEM_STYLES[0]);
  const [mood, setMood] = useState(POEM_MOODS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic, style, mood);
    }
  };
  
  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="poem-topic" className="block text-sm font-semibold text-gray-400 mb-1">
          Topic / Subject
        </label>
        <textarea
            id="poem-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The sound of rain on a tin roof, a city waking up at dawn..."
            className="w-full h-28 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
            disabled={isLoading}
            required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="poem-style" className="block text-sm font-semibold text-gray-400 mb-1">
            Poetic Style
          </label>
          <select id="poem-style" value={style} onChange={(e) => setStyle(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {POEM_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="poem-mood" className="block text-sm font-semibold text-gray-400 mb-1">
            Mood / Tone
          </label>
          <select id="poem-mood" value={mood} onChange={(e) => setMood(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {POEM_MOODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !topic.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Writing...
          </>
        ) : (
          'Generate Poem'
        )}
      </button>
    </form>
  );
};

export default PoemWriterGenerator;
