import React, { useRef, useState, useEffect } from 'react';
import Loader from './Loader';
import { GeneratorMode } from '../constants';

interface VideoDisplayProps {
  previewVideoUrl: string | null;
  finalVideoUrl: string | null;
  isLoading: boolean;
  isPreviewLoading: boolean;
  mode?: GeneratorMode;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ previewVideoUrl, finalVideoUrl, isLoading, isPreviewLoading, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLooping, setIsLooping] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [exportFormat, setExportFormat] = useState('mp4');

  const playbackRates = [0.5, 1, 1.5, 2];
  const exportFormats = ['mp4', 'mov', 'avi'];

  const handleDownload = () => {
    const urlToDownload = finalVideoUrl || previewVideoUrl;
    if (!urlToDownload) return;
    const link = document.createElement('a');
    link.href = urlToDownload;
    link.download = `ai-generated-video-${finalVideoUrl ? 'final' : 'preview'}.${exportFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCurrentlyLoading = isLoading || isPreviewLoading;
  const videoToShow = finalVideoUrl || previewVideoUrl;
  const isShowingPreview = !finalVideoUrl && !!previewVideoUrl;
  const isGifMode = mode === 'gif-generator';

  useEffect(() => {
    // Reset playback speed when the video source changes
    setPlaybackRate(1);
  }, [videoToShow]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLooping;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [isLooping, playbackRate, videoToShow]);


  let loadingMessage = 'Generating...';
  if (isPreviewLoading) {
    loadingMessage = 'Generating a quick preview...';
  } else if (isLoading) {
    loadingMessage = isGifMode ? 'Generating GIF...' : 'Rendering the final cut...';
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-full aspect-video bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center p-4 transition-all duration-300">
        {isCurrentlyLoading ? (
          <Loader message={loadingMessage} />
        ) : videoToShow ? (
          <div className="relative w-full h-full">
              <video
                  ref={videoRef}
                  src={videoToShow}
                  controls
                  autoPlay
                  muted
                  className="w-full h-full object-contain rounded-md"
              />
              {isShowingPreview && (
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg select-none">
                      PREVIEW
                  </span>
              )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-lg font-semibold">Your generated video will appear here</p>
            <p className="text-sm">Enter a prompt and click "Generate Preview" to start.</p>
          </div>
        )}
      </div>
      
      {!isCurrentlyLoading && videoToShow && (
        <div className="w-full flex flex-col items-center gap-3">
            {isGifMode && (
                 <p className="text-sm text-center text-gray-400">
                    This is a short, looping video. Download as MP4 and use an online tool to convert to GIF format.
                </p>
            )}
            {isShowingPreview && !isGifMode && (
                 <p className="text-sm text-center text-gray-400">
                    This is a 2-second preview. Like what you see? Generate the full video!
                </p>
            )}
             <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
                {/* Playback speed controls */}
                <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                    <span className="text-xs font-semibold text-gray-400 px-2 select-none">SPEED</span>
                    {playbackRates.map(rate => (
                        <button
                            key={rate}
                            onClick={() => setPlaybackRate(rate)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                                playbackRate === rate ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {rate}x
                        </button>
                    ))}
                </div>

                {/* Loop toggle */}
                <button
                    onClick={() => setIsLooping(prev => !prev)}
                    className={`flex items-center justify-center p-2.5 font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all ${
                        isLooping ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500'
                    }`}
                    aria-label={isLooping ? "Disable looping" : "Enable looping"}
                    title={isLooping ? "Disable Loop" : "Enable Loop"}
                >
                    {isLooping ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15.707 4.293a1 1 0 010 1.414L4.293 15.707a1 1 0 01-1.414-1.414L15.707 4.293z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
                 {/* Export format selector */}
                <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                    <span className="text-xs font-semibold text-gray-400 px-2 select-none">FORMAT</span>
                    {exportFormats.map(format => (
                        <button
                            key={format}
                            onClick={() => setExportFormat(format)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                                exportFormat === format ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            .{format}
                        </button>
                    ))}
                </div>
                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all"
                  aria-label="Download video"
                  title="Download Video"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download {isShowingPreview ? 'Preview' : 'Video'}</span>
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default VideoDisplay;
