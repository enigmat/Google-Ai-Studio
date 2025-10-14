import React from 'react';
import { useTTSSettings } from '../contexts/TTSSettingsContext';

interface TTSSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TTSSettingsModal: React.FC<TTSSettingsModalProps> = ({ isOpen, onClose }) => {
  const { voices, voice, setVoice, rate, setRate, pitch, setPitch } = useTTSSettings();

  if (!isOpen) return null;

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = voices.find(v => v.voiceURI === e.target.value) || null;
    setVoice(selectedVoice);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tts-settings-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="tts-settings-modal-title" className="text-2xl font-bold text-indigo-400 mb-6">Voice Settings</h2>
        
        <div className="space-y-6">
            <div>
                <label htmlFor="voice-select" className="block text-sm font-semibold text-gray-400 mb-2">Voice</label>
                <select 
                    id="voice-select" 
                    value={voice?.voiceURI || ''}
                    onChange={handleVoiceChange}
                    className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {voices.map(v => (
                        <option key={v.voiceURI} value={v.voiceURI}>{`${v.name} (${v.lang})`}</option>
                    ))}
                    {voices.length === 0 && <option>Loading voices...</option>}
                </select>
            </div>

            <div>
                <label htmlFor="rate-slider" className="block text-sm font-semibold text-gray-400 mb-2">Speed: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{rate.toFixed(1)}x</span></label>
                <input 
                    type="range"
                    id="rate-slider"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
            
             <div>
                <label htmlFor="pitch-slider" className="block text-sm font-semibold text-gray-400 mb-2">Pitch: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{pitch.toFixed(1)}</span></label>
                <input 
                    type="range"
                    id="pitch-slider"
                    min="0"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>
        </div>
        
        <div className="flex justify-end mt-8">
            <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default TTSSettingsModal;
