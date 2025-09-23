import React, { useState } from 'react';
import { LOGO_STYLES } from '../constants';

interface LogoGeneratorProps {
  onSubmit: (companyName: string, slogan: string, style: string, colors: string, iconDesc: string, negativePrompt: string) => void;
  isLoading: boolean;
}

const LogoGenerator: React.FC<LogoGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [companyName, setCompanyName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [style, setStyle] = useState(LOGO_STYLES[0]);
  const [colors, setColors] = useState('');
  const [iconDesc, setIconDesc] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('text, letters, words, font, signature, watermark');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim() && iconDesc.trim() && !isLoading) {
      onSubmit(companyName, slogan, style, colors, iconDesc, negativePrompt);
    }
  };

  const commonInputClasses = "w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="logo-company-name" className="block text-sm font-semibold text-gray-400 mb-1">Company Name</label>
          <input id="logo-company-name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Apex Innovations" className={commonInputClasses} disabled={isLoading} required />
        </div>
        <div>
          <label htmlFor="logo-slogan" className="block text-sm font-semibold text-gray-400 mb-1">Slogan (Optional)</label>
          <input id="logo-slogan" type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} placeholder="e.g., Engineering the Future" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
      <div>
        <label htmlFor="logo-icon-desc" className="block text-sm font-semibold text-gray-400 mb-1">Icon / Symbol Description</label>
        <textarea id="logo-icon-desc" value={iconDesc} onChange={(e) => setIconDesc(e.target.value)} placeholder="e.g., a stylized eagle's head combined with a circuit board pattern" className={`${commonInputClasses} h-24 resize-none`} disabled={isLoading} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="logo-style" className="block text-sm font-semibold text-gray-400 mb-1">Logo Style</label>
          <select id="logo-style" value={style} onChange={(e) => setStyle(e.target.value)} className={commonInputClasses} disabled={isLoading}>
            {LOGO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="logo-colors" className="block text-sm font-semibold text-gray-400 mb-1">Color Palette</label>
          <input id="logo-colors" type="text" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="e.g., deep blue and silver" className={commonInputClasses} disabled={isLoading} />
        </div>
      </div>
      <div>
        <label htmlFor="logo-negative" className="block text-sm font-semibold text-gray-400 mb-1">Things to Avoid</label>
        <input id="logo-negative" type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className={commonInputClasses} disabled={isLoading} />
      </div>
      <button
        type="submit"
        disabled={isLoading || !companyName.trim() || !iconDesc.trim()}
        className="w-full flex items-center justify-center px-6 py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Generating...' : 'Generate Logo'}
      </button>
    </form>
  );
};

export default LogoGenerator;
