import React from 'react';
import Icon from '../../../components/AppIcon';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, trend = "up" }) => {
  // Use optional chaining for all prop access
  const displayTitle = title || 'No Title';
  const displayValue = value?.toString() || '0';
  const displayChange = change?.toString() || '0';
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
          trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {trend === "up" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{displayChange}%</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{displayValue}</h3>
        <p className="text-sm text-gray-600">{displayTitle}</p>
      </div>
    </div>
  );
};

export default MetricCard;