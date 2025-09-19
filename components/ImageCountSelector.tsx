import React from 'react';

interface ImageCountSelectorProps {
  count: number;
  setCount: (count: number) => void;
  isLoading: boolean;
  isReferenceActive: boolean;
}

const counts = [1, 2, 4];

const ImageCountSelector: React.FC<ImageCountSelectorProps> = ({ count, setCount, isLoading, isReferenceActive }) => {
  const isDisabled = isLoading || isReferenceActive;
  const title = isReferenceActive ? "Image count is fixed to 1 when using a reference image." : undefined;

  return (
    <div title={title}>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Number of images to generate:</h3>
        <div className="flex items-center gap-2">
            {counts.map((num) => (
                <button
                    key={num}
                    onClick={() => setCount(num)}
                    disabled={isDisabled}
                    className={`
                        px-4 py-2 rounded-lg font-semibold transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${count === num && !isReferenceActive
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-gray-700 text-gray-300'
                        }
                        ${!isReferenceActive ? 'hover:bg-gray-600' : ''}
                        ${isReferenceActive && num === 1 ? 'bg-indigo-900 text-gray-400' : ''}
                    `}
                >
                    {num}
                </button>
            ))}
        </div>
    </div>
  );
};

export default ImageCountSelector;