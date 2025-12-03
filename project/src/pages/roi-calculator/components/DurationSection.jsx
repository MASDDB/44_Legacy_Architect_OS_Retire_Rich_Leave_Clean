import React from 'react';
import { Calendar, HelpCircle } from 'lucide-react';
import Input from '../../../components/ui/Input';

const DurationSection = ({ value, onChange, error }) => {
  const handleChange = (e) => {
    const newValue = parseInt(e?.target?.value, 10) || 1;
    onChange(Math.max(1, newValue));
  };

  const getDurationText = () => {
    if (value === 1) return 'month';
    return 'months';
  };

  return (
    <div className="bg-white rounded-lg shadow-soft border p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Duration</h3>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                How many months you plan to run your reactivation campaign
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-32">
              <Input
                type="number"
                value={value}
                onChange={handleChange}
                min="1"
                max="24"
                error={error}
                className="text-lg font-medium text-center"
              />
            </div>
            <div className="flex-1">
              <span className="text-lg text-gray-600">{getDurationText()}</span>
            </div>
          </div>

          {/* Duration Recommendations */}
          <div className="mt-4 bg-purple-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-purple-800 mb-2">Recommended Duration:</h4>
            <div className="text-xs text-purple-700 space-y-1">
              <div>• <strong>1-3 months:</strong> Initial reactivation push</div>
              <div>• <strong>3-6 months:</strong> Sustained engagement campaign</div>
              <div>• <strong>6+ months:</strong> Long-term nurturing program</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Most successful campaigns run for 3-6 months to allow multiple touchpoints
          </p>
        </div>
      </div>
    </div>
  );
};

export default DurationSection;