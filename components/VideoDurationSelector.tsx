import React from 'react';

interface VideoDurationSelectorProps {
  duration: number;
  setDuration: (duration: number) => void;
  isLoading: boolean;
}

const MIN_DURATION = 1;
const MAX_DURATION = 8; // Reduced from 10 to a more stable value

const VideoDurationSelector: React.FC<VideoDurationSelectorProps> = ({ duration, setDuration, isLoading }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-700/50">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-400">
          Video Duration:
        </h3>
        <span className="px-3 py-1 bg-gray-700 text-white font-mono text-sm rounded-md w-16 text-center">
          {duration}s
        </span>
      </div>
      <input
        type="range"
        min={MIN_DURATION}
        max={MAX_DURATION}
        step="1"
        value={duration}
        onChange={handleSliderChange}
        disabled={isLoading}
        className="w-full h-8"
        aria-label="Video duration selector"
      />
    </div>
  );
};

export default VideoDurationSelector;