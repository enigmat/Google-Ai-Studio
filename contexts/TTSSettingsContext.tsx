import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface TTSSettings {
  voice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  voices: SpeechSynthesisVoice[];
}

const TTSSettingsContext = createContext<TTSSettings | undefined>(undefined);

const SETTINGS_KEY = 'tts-settings';

export const TTSSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  useEffect(() => {
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const { rate: savedRate, pitch: savedPitch } = JSON.parse(savedSettings);
        setRate(savedRate || 1);
        setPitch(savedPitch || 1);
        // The voice object itself needs to be found in the voices list after it loads
      }
    } catch (e) {
      console.error("Failed to load TTS settings", e);
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        let voiceToSet = availableVoices[0]; // Default to the first voice

        // Try to restore saved voice
        try {
            const savedSettings = localStorage.getItem(SETTINGS_KEY);
            if (savedSettings) {
                const { voiceURI } = JSON.parse(savedSettings);
                const savedVoice = availableVoices.find(v => v.voiceURI === voiceURI);
                if (savedVoice) {
                    voiceToSet = savedVoice;
                }
            }
        } catch(e) { console.error("Failed to parse saved voice", e); }

        setVoice(voiceToSet);
      }
    };

    loadVoices();
    // Voices can load asynchronously. The 'voiceschanged' event is the correct way to get the full list.
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  // Effect to save settings whenever they change
  useEffect(() => {
    // Only save if a voice has been selected to avoid overwriting on initial load
    if (voice) { 
        try {
            const settingsToSave = {
                voiceURI: voice.voiceURI,
                rate,
                pitch,
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave));
        } catch (e) {
            console.error("Failed to save TTS settings", e);
        }
    }
  }, [voice, rate, pitch]);


  const value = { voices, voice, setVoice, rate, setRate, pitch, setPitch };

  return (
    <TTSSettingsContext.Provider value={value}>
      {children}
    </TTSSettingsContext.Provider>
  );
};

export const useTTSSettings = () => {
  const context = useContext(TTSSettingsContext);
  if (context === undefined) {
    throw new Error('useTTSSettings must be used within a TTSSettingsProvider');
  }
  return context;
};
