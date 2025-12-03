import React from 'react';
import { Users, HelpCircle } from 'lucide-react';
import Input from '../../../components/ui/Input';

const DatabaseInputSection = ({ value, onChange, error }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const handleChange = (e) => {
    const newValue = parseInt(e?.target?.value?.replace(/,/g, ''), 10) || 0;
    onChange(newValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-soft border p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Database Size</h3>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Total number of customers/leads in your existing database that you want to reactivate
              </div>
            </div>
          </div>

          <Input
            type="text"
            value={formatNumber(value)}
            onChange={handleChange}
            placeholder="1,000"
            error={error}
            className="text-lg font-medium"
          />

          <p className="mt-2 text-sm text-gray-600">
            Enter the total number of customers in your database
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInputSection;