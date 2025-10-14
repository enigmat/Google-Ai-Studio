import React, { useState, useEffect, useRef } from 'react';
import { useTTSSettings } from '../contexts/TTSSettingsContext';

interface TTSButtonProps {
  textToSpeak: string;
  className?: string;
  isHtml?: boolean;
}

const TTSButton: React.FC<TTSButtonProps> = ({ textToSpeak, className, isHtml = false }) => {
  const { voice, rate, pitch } = useTTSSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Using a ref to hold the utterance allows us to have a stable reference inside the onend callback
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanText = (text: string): string => {
    if (!isHtml) return text;
    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        // Add pauses after block elements to improve flow
        tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote').forEach(el => {
            el.insertAdjacentText('beforeend', '. ');
        });
        return tempDiv.textContent || tempDiv.innerText || '';
    } catch (e) {
        console.error("Could not parse HTML for TTS", e);
        return '';
    }
  };

  const handleToggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSpeaking) {
      window.speechSynthesis.cancel(); // This will trigger the 'onend' event
    } else {
      window.speechSynthesis.cancel(); // Stop any other speech from other buttons
      
      const cleanedText = cleanText(textToSpeak);
      if (!cleanedText.trim()) return;

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utteranceRef.current = utterance;

      // Apply settings from context
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;

      const handleEnd = () => {
        // Only update state if this is the utterance that ended
        if(utteranceRef.current === utterance) {
            setIsSpeaking(false);
            utteranceRef.current = null;
        }
      };

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = handleEnd;
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        handleEnd();
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Cleanup on unmount. If this component is speaking, stop it.
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const buttonClasses = className || "p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500";
  
  const soundOnIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>;
  const soundOffIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

  return (
    <button onClick={handleToggleSpeech} className={buttonClasses} title={isSpeaking ? "Stop speaking" : "Read aloud"}>
      {isSpeaking ? soundOnIcon : soundOffIcon}
    </button>
  );
};

export default TTSButton;
