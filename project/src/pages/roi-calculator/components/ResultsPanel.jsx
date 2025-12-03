import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingDown
} from 'lucide-react';

const ResultsPanel = ({ calculations, roiStatus, errors }) => {
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

  const formatPercentage = (num) => {
    return `${num?.toFixed(1)}%`;
  };

  const getROIStatusConfig = () => {
    switch (roiStatus) {
      case 'excellent':
        return {
          icon: CheckCircle,
          text: 'Excellent ROI',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200'
        };
      case 'positive':
        return {
          icon: TrendingUp,
          text: 'Positive ROI',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200'
        };
      case 'break-even':
        return {
          icon: Calculator,
          text: 'Break-even',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200'
        };
      case 'negative':
        return {
          icon: TrendingDown,
          text: 'Negative ROI',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      default:
        return {
          icon: AlertTriangle,
          text: 'Invalid Input',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200'
        };
    }
  };

  const statusConfig = getROIStatusConfig();
  const StatusIcon = statusConfig?.icon;

  // Show validation errors
  if (!calculations?.isValid) {
    return (
      <div className="bg-white rounded-lg shadow-soft border p-6 sticky top-6">
        <div className="text-center py-8">
          <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Fix Errors to Calculate</h3>
          <div className="text-sm text-red-600 space-y-1">
            {Object.entries(errors)?.map(([field, error]) => (
              <p key={field}>• {error}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft border sticky top-6">
      {/* Header */}
      <div className={`px-6 py-4 border-b rounded-t-lg ${statusConfig?.bg} ${statusConfig?.border}`}>
        <div className="flex items-center space-x-3">
          <StatusIcon className={`h-6 w-6 ${statusConfig?.color}`} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">ROI Analysis</h3>
            <p className={`text-sm ${statusConfig?.color} font-medium`}>
              {statusConfig?.text}
            </p>
          </div>
        </div>
      </div>
      {/* Results */}
      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Reactivated Customers</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(calculations?.reactivatedCustomers || 0)}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Potential Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculations?.potentialRevenue || 0)}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Calculator className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Campaign Cost</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(calculations?.campaignCost || 0)}
            </div>
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Net ROI</span>
            <span className={`font-bold text-lg ${
              (calculations?.netROI || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(calculations?.netROI || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">ROI Percentage</span>
            <span className={`font-bold text-lg ${
              (calculations?.roiPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(calculations?.roiPercentage || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cost per Reactivation</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(calculations?.costPerReactivation || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly ROI</span>
            <span className={`font-medium ${
              (calculations?.monthlyROI || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(calculations?.monthlyROI || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Break-even Rate</span>
            <span className="font-medium text-gray-900">
              {formatPercentage(calculations?.breakEvenRate || 0)}
            </span>
          </div>
        </div>

        {/* ROI Status Indicator */}
        {roiStatus !== 'invalid' && (
          <div className={`rounded-lg p-4 ${statusConfig?.bg} ${statusConfig?.border} border`}>
            <div className="flex items-start space-x-3">
              <StatusIcon className={`h-5 w-5 ${statusConfig?.color} mt-0.5 flex-shrink-0`} />
              <div className="flex-1">
                <h4 className={`font-medium ${statusConfig?.color}`}>
                  {statusConfig?.text}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {roiStatus === 'excellent' && 'Outstanding returns! This campaign shows exceptional potential.'}
                  {roiStatus === 'positive' && 'Good returns expected. This campaign should be profitable.'}
                  {roiStatus === 'break-even' && 'Campaign covers costs. Consider optimizing for better returns.'}
                  {roiStatus === 'negative' && 'Campaign may lose money. Adjust parameters or reconsider strategy.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;