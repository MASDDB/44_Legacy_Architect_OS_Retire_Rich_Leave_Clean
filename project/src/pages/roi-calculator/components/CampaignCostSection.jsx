import React from 'react';
import { CreditCard, HelpCircle, TrendingDown } from 'lucide-react';

const CampaignCostSection = ({ databaseSize, percentage, cost }) => {
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(num);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const getCostTier = () => {
    if (databaseSize >= 100000) return { tier: 'Enterprise', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (databaseSize >= 50000) return { tier: 'Large Business', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (databaseSize >= 25000) return { tier: 'Medium Business', color: 'text-green-600', bg: 'bg-green-100' };
    if (databaseSize >= 10000) return { tier: 'Small Business', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { tier: 'Startup/SMB', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const tier = getCostTier();

  return (
    <div className="bg-white rounded-lg shadow-soft border p-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-amber-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Cost</h3>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-0 top-6 z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Auto-calculated based on database size. Larger databases benefit from economies of scale.
              </div>
            </div>
          </div>

          {/* Cost Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600">
                  {formatCurrency(cost)}
                </div>
                <div className="text-sm text-gray-600">
                  {percentage}% of potential revenue
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tier?.bg} ${tier?.color}`}>
                  {tier?.tier}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingDown className="h-4 w-4 text-amber-600" />
                <h4 className="text-sm font-medium text-amber-800">Economies of Scale</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">100,000+ contacts:</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">50,000-99,999:</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">25,000-49,999:</span>
                    <span className="font-medium">30%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">10,000-24,999:</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Under 10,000:</span>
                    <span className="font-medium">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700 font-medium">Your rate:</span>
                    <span className="font-bold text-amber-700">{percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Your database:</strong> {formatNumber(databaseSize)} contacts</p>
              <p className="mt-1">
                Campaign costs decrease with larger databases due to better negotiated rates, 
                bulk pricing, and improved operational efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCostSection;