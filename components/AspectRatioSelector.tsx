import React from 'react';
import { ASPECT_RATIOS } from '../constants';

type AspectRatio = typeof ASPECT_RATIOS[number];

interface AspectRatioSelectorProps {
  selectedAspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  isLoading: boolean;
  isReferenceActive: boolean;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedAspectRatio, setAspectRatio, isLoading, isReferenceActive }) => {
  const isDisabled = isLoading || isReferenceActive;
  const title = isReferenceActive ? "Aspect ratio is determined by the reference image." : undefined;
  
  return (
    <div title={title}>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Aspect Ratio:</h3>
      <div className="flex flex-wrap gap-2">
        {ASPECT_RATIOS.map((ratio) => (
          <button
            key={ratio}
            onClick={() => setAspectRatio(ratio)}
            disabled={isDisabled}
            className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${selectedAspectRatio === ratio && !isReferenceActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300'
              }
              ${!isReferenceActive ? 'hover:bg-gray-600' : ''}
               ${isReferenceActive ? 'bg-indigo-900 text-gray-400' : ''}
            `}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;