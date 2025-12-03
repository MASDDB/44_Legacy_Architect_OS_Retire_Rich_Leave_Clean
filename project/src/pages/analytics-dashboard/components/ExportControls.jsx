import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportControls = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'last_30_days',
    startDate: '',
    endDate: '',
    metrics: {
      campaign_performance: true,
      lead_lifecycle: true,
      revenue_analytics: true,
      appointment_metrics: true,
      roi_analysis: false,
      industry_breakdown: false
    },
    includeCharts: false,
    includeRawData: true
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values for spreadsheet analysis' },
    { value: 'excel', label: 'Excel', description: 'Microsoft Excel format with multiple sheets' },
    { value: 'pdf', label: 'PDF', description: 'Formatted report with charts and summaries' }
  ];

  const dateRangeOptions = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const metricOptions = [
    { key: 'campaign_performance', label: 'Campaign Performance', description: 'Reactivation rates, appointments, ROI' },
    { key: 'lead_lifecycle', label: 'Lead Lifecycle', description: 'Hot/Warm/Cold progression and conversion rates' },
    { key: 'revenue_analytics', label: 'Revenue Analytics', description: 'Revenue, costs, profit margins' },
    { key: 'appointment_metrics', label: 'Appointment Metrics', description: 'Booking rates, confirmations, no-shows' },
    { key: 'roi_analysis', label: 'ROI Analysis', description: 'Return on investment calculations' },
    { key: 'industry_breakdown', label: 'Industry Breakdown', description: 'Performance by industry vertical' }
  ];

  const handleMetricChange = (metricKey, checked) => {
    setExportConfig(prev => ({
      ...prev,
      metrics: {
        ...prev?.metrics,
        [metricKey]: checked
      }
    }));
  };

  const handleExport = () => {
    const selectedMetrics = Object.entries(exportConfig?.metrics)?.filter(([key, value]) => value)?.map(([key]) => key);

    if (selectedMetrics?.length === 0) {
      alert('Please select at least one metric to export.');
      return;
    }

    const exportData = {
      ...exportConfig,
      selectedMetrics,
      timestamp: new Date()?.toISOString()
    };

    // Simulate export process
    console.log('Exporting data:', exportData);
    
    if (onExport) {
      onExport(exportData);
    }

    // Show success message
    alert(`Export initiated! Your ${exportConfig?.format?.toUpperCase()} report will be ready shortly.`);
    setIsOpen(false);
  };

  const getSelectedCount = () => {
    return Object.values(exportConfig?.metrics)?.filter(Boolean)?.length;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="Download"
        iconPosition="left"
      >
        Export Data
      </Button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Export Modal */}
          <div className="absolute right-0 top-12 w-96 bg-popover border border-border rounded-lg shadow-elevated z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-popover-foreground">Export Analytics</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium text-popover-foreground mb-3 block">
                  Export Format
                </label>
                <div className="space-y-2">
                  {formatOptions?.map((format) => (
                    <label key={format?.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value={format?.value}
                        checked={exportConfig?.format === format?.value}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, format: e?.target?.value }))}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="text-sm font-medium text-popover-foreground">
                          {format?.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format?.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium text-popover-foreground mb-3 block">
                  Date Range
                </label>
                <select
                  value={exportConfig?.dateRange}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, dateRange: e?.target?.value }))}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {dateRangeOptions?.map((option) => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>

                {exportConfig?.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Input
                      type="date"
                      label="Start Date"
                      value={exportConfig?.startDate}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, startDate: e?.target?.value }))}
                      className="text-sm"
                    />
                    <Input
                      type="date"
                      label="End Date"
                      value={exportConfig?.endDate}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, endDate: e?.target?.value }))}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Metrics Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-popover-foreground">
                    Metrics to Include
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {getSelectedCount()} selected
                  </span>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {metricOptions?.map((metric) => (
                    <div key={metric?.key} className="flex items-start space-x-3">
                      <Checkbox
                        checked={exportConfig?.metrics?.[metric?.key]}
                        onChange={(e) => handleMetricChange(metric?.key, e?.target?.checked)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm font-medium text-popover-foreground">
                          {metric?.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {metric?.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={exportConfig?.includeCharts}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, includeCharts: e?.target?.checked }))}
                  />
                  <div>
                    <div className="text-sm font-medium text-popover-foreground">
                      Include Charts
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Export visual charts and graphs (PDF only)
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={exportConfig?.includeRawData}
                    onChange={(e) => setExportConfig(prev => ({ ...prev, includeRawData: e?.target?.checked }))}
                  />
                  <div>
                    <div className="text-sm font-medium text-popover-foreground">
                      Include Raw Data
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Export detailed data points for analysis
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleExport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportControls;