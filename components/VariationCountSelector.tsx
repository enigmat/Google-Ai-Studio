import React from 'react';
import { VARIATION_COUNTS } from '../constants';

type VariationCount = typeof VARIATION_COUNTS[number];

interface VariationCountSelectorProps {
  count: number;
  setCount: (count: VariationCount) => void;
  isLoading: boolean;
}

const VariationCountSelector: React.FC<VariationCountSelectorProps> = ({ count, setCount, isLoading }) => {
  return (
    <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Number of variations:</h3>
        <div className="flex items-center gap-2">
            {VARIATION_COUNTS.map((num) => (
                <button
                    key={num}
                    onClick={() => setCount(num)}
                    disabled={isLoading}
                    className={`
                        px-4 py-2 rounded-lg font-semibold transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${count === num
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                    `}
                >
                    {num}
                </button>
            ))}
        </div>
    </div>
  );
};

export default VariationCountSelector;
