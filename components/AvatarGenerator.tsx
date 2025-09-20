import React, { useState } from 'react';
import { AVATAR_GENDERS, AVATAR_AGES, AVATAR_HAIR_STYLES, AVATAR_COLORS, AVATAR_ART_STYLES } from '../constants';

interface AvatarGeneratorProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [gender, setGender] = useState(AVATAR_GENDERS[0]);
  const [age, setAge] = useState(AVATAR_AGES[2]);
  const [hairStyle, setHairStyle] = useState(AVATAR_HAIR_STYLES[0]);
  const [hairColor, setHairColor] = useState(AVATAR_COLORS[1]);
  const [eyeColor, setEyeColor] = useState(AVATAR_COLORS[1]);
  const [artStyle, setArtStyle] = useState(AVATAR_ART_STYLES[0].value);
  const [accessories, setAccessories] = useState('');
  const [background, setBackground] = useState('simple grey background');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const parts = [
      `close-up portrait of a ${age.toLowerCase()} ${gender.toLowerCase()}`,
      `with ${hairStyle.toLowerCase()} ${hairColor.toLowerCase()} hair`,
      `and ${eyeColor.toLowerCase()} eyes`,
    ];
    if (accessories.trim()) {
        parts.push(`wearing ${accessories.trim()}`);
    }
    parts.push(`, ${artStyle}`);
    if (background.trim()) {
        parts.push(`, ${background.trim()}`);
    } else {
        parts.push(`, plain background`);
    }

    const prompt = parts.join(', ');
    onSubmit(prompt);
  };
  
  const commonSelectClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 disabled:opacity-50";
  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="avatar-gender" className="block text-sm font-semibold text-gray-400 mb-1">Gender</label>
          <select id="avatar-gender" value={gender} onChange={(e) => setGender(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {AVATAR_GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="avatar-age" className="block text-sm font-semibold text-gray-400 mb-1">Age Group</label>
          <select id="avatar-age" value={age} onChange={(e) => setAge(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {AVATAR_AGES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="avatar-hair-style" className="block text-sm font-semibold text-gray-400 mb-1">Hair Style</label>
          <select id="avatar-hair-style" value={hairStyle} onChange={(e) => setHairStyle(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {AVATAR_HAIR_STYLES.map(hs => <option key={hs} value={hs}>{hs}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="avatar-hair-color" className="block text-sm font-semibold text-gray-400 mb-1">Hair Color</label>
          <select id="avatar-hair-color" value={hairColor} onChange={(e) => setHairColor(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {AVATAR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
            <label htmlFor="avatar-eye-color" className="block text-sm font-semibold text-gray-400 mb-1">Eye Color</label>
            <select id="avatar-eye-color" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
                {AVATAR_COLORS.slice(0, 5).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
         <div>
          <label htmlFor="avatar-art-style" className="block text-sm font-semibold text-gray-400 mb-1">Art Style</label>
          <select id="avatar-art-style" value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className={commonSelectClasses} disabled={isLoading}>
            {AVATAR_ART_STYLES.map(as => <option key={as.name} value={as.value}>{as.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="avatar-accessories" className="block text-sm font-semibold text-gray-400 mb-1">Accessories (optional)</label>
        <input id="avatar-accessories" type="text" value={accessories} onChange={(e) => setAccessories(e.target.value)} placeholder="e.g., glasses, a beanie, headphones" className={commonInputClasses} disabled={isLoading} />
      </div>
       <div>
        <label htmlFor="avatar-background" className="block text-sm font-semibold text-gray-400 mb-1">Background (optional)</label>
        <input id="avatar-background" type="text" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="e.g., in front of a neon sign, a forest at night" className={commonInputClasses} disabled={isLoading} />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Generating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a3.5 3.5 0 01-3.5-3.5V6a3.5 3.5 0 013.5-3.5h9A3.5 3.5 0 0118 6v6.5a3.5 3.5 0 01-3.5 3.5h-9zM10 5a2 2 0 100 4 2 2 0 000-4zM8 13a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /></svg>
            Generate Avatar
          </>
        )}
      </button>
    </form>
  );
};

export default AvatarGenerator;
