import React, { useState, useRef, useEffect, useCallback } from 'react';
import { startAudioTranscriptionSession, transcribeAudioFromFile } from '../services/geminiService';

interface AudioToTextGeneratorProps {
  onTranscriptionUpdate: (chunk: string, isTurnComplete: boolean) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
  setError: (error: string | null) => void;
  isFileProcessing: boolean;
  setIsFileProcessing: (isProcessing: boolean) => void;
}

const AudioToTextGenerator: React.FC<AudioToTextGeneratorProps> = ({ onTranscriptionUpdate, onRecordingStateChange, setError, isFileProcessing, setIsFileProcessing }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const sessionPromiseRef = useRef<ReturnType<typeof startAudioTranscriptionSession>['sessionPromise'] | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const handleStop = useCallback(async () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close());
      sessionPromiseRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        await audioContextRef.current.close();
      } catch(e) { console.error("Error closing audio context", e); }
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setIsConnecting(false);
    onRecordingStateChange(false);
  }, [onRecordingStateChange]);

  const handleStart = async () => {
    setError(null);
    setIsConnecting(true);
    setSelectedFile(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const { sessionPromise, createBlob } = startAudioTranscriptionSession({
        onOpen: () => {
          setIsConnecting(false);
          setIsRecording(true);
          onRecordingStateChange(true);
          
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
          scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

          scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            if (sessionPromiseRef.current) {
              sessionPromiseRef.current.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            }
          };

          sourceRef.current.connect(scriptProcessorRef.current);
          scriptProcessorRef.current.connect(audioContextRef.current.destination);
        },
        onTranscriptionUpdate,
        onError: (err) => {
          setError(err.message);
          handleStop();
        },
        onClose: () => {
          handleStop();
        },
      });
      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error("Error getting user media or starting session:", err);
      setError("Could not start recording. Please ensure microphone permissions are granted and try again.");
      setIsConnecting(false);
    }
  };
  
  // File upload handlers
  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('audio/')) {
        setError('Please upload a valid audio file (MP3, WAV, etc.).');
        return;
      }
      setError(null);
      handleStop(); // Stop any live recording
      setSelectedFile(file);
    }
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  }, []);

  const handleTranscribeFile = async () => {
      if (!selectedFile || isFileProcessing || isRecording) return;
      setError(null);
      setIsFileProcessing(true);
      onRecordingStateChange(false);
      try {
          const fullText = await transcribeAudioFromFile(selectedFile);
          onTranscriptionUpdate(fullText, true);
      } catch (err: any) {
          setError(err.message || "Failed to transcribe the file.");
      } finally {
          setIsFileProcessing(false);
      }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleStop();
    };
  }, [handleStop]);

  const liveButtonDisabled = isConnecting || isFileProcessing;
  const fileButtonDisabled = isConnecting || isRecording || isFileProcessing || !selectedFile;

  return (
    <div className="flex flex-col gap-6 w-full">
        {/* --- LIVE TRANSCRIPTION --- */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-gray-300">Live Transcription</h3>
            <button
                onClick={isRecording ? handleStop : handleStart}
                disabled={liveButtonDisabled}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-gray-800
                ${isRecording ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}
                ${liveButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {isConnecting && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                )}
                {!isConnecting && (isRecording ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" /><path d="M5.5 8.5a.5.5 0 01.5.5v1a4 4 0 004 4H10a.5.5 0 010 1H8.5a5 5 0 01-5-5v-1a.5.5 0 01.5-.5z" /><path d="M10 12H9.5a4 4 0 00-4-4v-1a.5.5 0 011 0v1a3 3 0 013 3z" /></svg>
                ))}
                <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
            </button>
            <p className="text-sm font-semibold text-gray-300 h-5">
                {isConnecting ? "Connecting..." : isRecording ? "Recording... Click to stop" : "Use your microphone"}
            </p>
        </div>

        <div className="text-center my-2 font-bold text-gray-500">OR</div>

        {/* --- FILE TRANSCRIPTION --- */}
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-gray-300">Transcribe from File</h3>
            <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                htmlFor="audio-file-upload"
                className={`w-full p-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-white transition-all duration-300 flex items-center justify-center
                ${isRecording || isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
            >
                {selectedFile ? (
                    <div className="text-center text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <p className="mt-2 text-sm font-semibold truncate max-w-xs">{selectedFile.name}</p>
                        <button onClick={(e) => { e.preventDefault(); setSelectedFile(null); }} className="text-xs text-red-400 hover:underline mt-1">Clear</button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
                        <p className="text-xs">.mp3, .wav</p>
                    </div>
                )}
            </label>
            <input
                id="audio-file-upload"
                type="file"
                accept=".mp3,.wav,audio/*"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
                disabled={isRecording || isConnecting}
            />
             <button
                onClick={handleTranscribeFile}
                disabled={fileButtonDisabled}
                className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
                {isFileProcessing ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Transcribing...
                </>
                ) : (
                'Transcribe File'
                )}
            </button>
        </div>
    </div>
  );
};

export default AudioToTextGenerator;