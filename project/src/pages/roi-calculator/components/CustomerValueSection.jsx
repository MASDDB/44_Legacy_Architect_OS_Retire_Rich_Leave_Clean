import React from 'react';
import { DollarSign, HelpCircle } from 'lucide-react';

const CustomerValueSection = ({ value, onChange, error }) => {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(num);
  };

  const handleSliderChange = (e) => {
    onChange(parseInt(e?.target?.value, 10));
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e?.target?.value?.replace(/\$|,/g, ''), 10) || 500;
    const clampedValue = Math.max(500, Math.min(25000, newValue));
    onChange(clampedValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-soft border p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Average Customer Value</h3>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Average lifetime value of a customer or typical transaction value
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Value Display */}
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formatCurrency(value)}
                onChange={handleInputChange}
                className="text-2xl font-bold text-green-600 bg-transparent border-none outline-none focus:ring-0 p-0 w-auto"
              />
              <span className="text-sm text-gray-500">
                Range: $500 - $25,000
              </span>
            </div>

            {/* Range Slider */}
            <div className="relative">
              <input
                type="range"
                min={500}
                max={25000}
                step={50}
                value={value}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${((value - 500) / (25000 - 500)) * 100}%, #E5E7EB ${((value - 500) / (25000 - 500)) * 100}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$500</span>
                <span>$12,750</span>
                <span>$25,000</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <p className="text-sm text-gray-600">
              Adjust the slider or click the value to edit directly
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default CustomerValueSection;