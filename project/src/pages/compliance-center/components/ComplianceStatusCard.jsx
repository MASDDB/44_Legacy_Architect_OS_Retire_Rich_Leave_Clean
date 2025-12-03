import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceStatusCard = ({ title, status, description, violations, lastChecked, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'violation':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'violation':
        return 'XCircle';
      default:
        return 'Clock';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
            <Icon name={getStatusIcon(status)} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          View Details
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
          </span>
        </div>

        {violations > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Violations</span>
            <span className="text-sm font-medium text-error">{violations}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Checked</span>
          <span className="text-sm text-foreground">{lastChecked}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStatusCard;