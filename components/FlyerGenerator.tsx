import React, { useState } from 'react';
import { FLYER_STYLES } from '../constants';

interface FlyerGeneratorProps {
  onSubmit: (title: string, date: string, time: string, location: string, info: string, style: string, color: string) => void;
  isLoading: boolean;
}

const FlyerGenerator: React.FC<FlyerGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [info, setInfo] = useState('');
  const [style, setStyle] = useState(FLYER_STYLES[0]);
  const [color, setColor] = useState('Blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && !isLoading) {
      onSubmit(title, date, time, location, info, style, color);
    }
  };

  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="flyer-title" className="block text-sm font-semibold text-gray-400 mb-1">Event Title</label>
        <input id="flyer-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Summer Music Festival" className={commonInputClasses} disabled={isLoading} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="flyer-date" className="block text-sm font-semibold text-gray-400 mb-1">Date</label>
          <input id="flyer-date" type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g., August 15th" className={commonInputClasses} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="flyer-time" className="block text-sm font-semibold text-gray-400 mb-1">Time</label>
          <input id="flyer-time" type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 7 PM - 11 PM" className={commonInputClasses} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="flyer-location" className="block text-sm font-semibold text-gray-400 mb-1">Location</label>
          <input id="flyer-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Central Park" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
      <div>
        <label htmlFor="flyer-info" className="block text-sm font-semibold text-gray-400 mb-1">Key Information</label>
        <textarea id="flyer-info" value={info} onChange={(e) => setInfo(e.target.value)} placeholder="e.g., Featuring DJ Sparkle and The Cosmic Rays. Free entry." className={`${commonInputClasses} h-24 resize-none`} disabled={isLoading} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="flyer-style" className="block text-sm font-semibold text-gray-400 mb-1">Visual Style</label>
          <select id="flyer-style" value={style} onChange={(e) => setStyle(e.target.value)} className={commonInputClasses} disabled={isLoading}>
            {FLYER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="flyer-color" className="block text-sm font-semibold text-gray-400 mb-1">Primary Color</label>
          <input id="flyer-color" type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g., Vibrant Orange" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Designing...
          </>
        ) : (
          'Generate Flyer'
        )}
      </button>
    </form>
  );
};

export default FlyerGenerator;