import React from 'react';
import { Target, HelpCircle } from 'lucide-react';

const ReactivationRateSection = ({ value, onChange, error }) => {
  const handleSliderChange = (e) => {
    onChange(parseFloat(e?.target?.value));
  };

  const handleInputChange = (e) => {
    const newValue = parseFloat(e?.target?.value) || 1.0;
    const clampedValue = Math.max(0.5, Math.min(75, newValue));
    onChange(clampedValue);
  };

  const getReactivationLevel = () => {
    if (value <= 2) return { label: 'Conservative', color: 'text-blue-600' };
    if (value <= 10) return { label: 'Moderate', color: 'text-yellow-600' };
    if (value <= 25) return { label: 'Optimistic', color: 'text-orange-600' };
    return { label: 'Aggressive', color: 'text-red-600' };
  };

  const level = getReactivationLevel();

  return (
    <div className="bg-white rounded-lg shadow-soft border p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-indigo-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Expected Reactivation Rate</h3>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Percentage of dormant customers you expect to reactivate through your campaign
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Value Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={value}
                  onChange={handleInputChange}
                  min="0.5"
                  max="75"
                  step="0.5"
                  className="text-2xl font-bold text-indigo-600 bg-transparent border-none outline-none focus:ring-0 p-0 w-20"
                />
                <span className="text-2xl font-bold text-indigo-600">%</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${level?.color}`}>
                  {level?.label}
                </span>
                <p className="text-xs text-gray-500">Expectation Level</p>
              </div>
            </div>

            {/* Range Slider */}
            <div className="relative">
              <input
                type="range"
                min={0.5}
                max={75}
                step={0.5}
                value={value}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gradient"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((value - 0.5) / (75 - 0.5)) * 100}%, #E5E7EB ${((value - 0.5) / (75 - 0.5)) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5%</span>
                <span>37.75%</span>
                <span>75%</span>
              </div>
            </div>

            {/* Benchmark Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Industry Benchmarks:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• Cold leads: 0.5-2%</div>
                <div>• Warm leads: 2-5%</div>
                <div>• Previous customers: 5-15%</div>
                <div>• Engaged prospects: 10-25%</div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <p className="text-sm text-gray-600">
              Industry average: 1-3% for cold reactivation campaigns
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .slider-gradient::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }

        .slider-gradient::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default ReactivationRateSection;