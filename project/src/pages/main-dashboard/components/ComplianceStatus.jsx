import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceStatus = ({ complianceData }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'violation':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Shield', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'violation':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const overallStatus = complianceData?.items?.every(item => item?.status === 'compliant') 
    ? 'compliant' 
    : complianceData?.items?.some(item => item?.status === 'violation') 
    ? 'violation' :'warning';

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-foreground">Compliance Status</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(overallStatus)}`}>
            {overallStatus === 'compliant' ? 'All Clear' : overallStatus === 'violation' ? 'Action Required' : 'Review Needed'}
          </span>
        </div>
        <Button variant="ghost" size="sm" iconName="Settings" iconPosition="left">
          Manage
        </Button>
      </div>
      <div className="space-y-4">
        {complianceData?.items?.map((item) => {
          const { icon, color } = getStatusIcon(item?.status);
          
          return (
            <div key={item?.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <Icon name={icon} size={20} className={color} />
                <div>
                  <h3 className="font-medium text-foreground text-sm">{item?.title}</h3>
                  <p className="text-xs text-muted-foreground">{item?.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {item?.lastChecked && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.lastChecked)?.toLocaleDateString()}
                  </span>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Compliance Summary</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Last full audit: {new Date(complianceData.lastAudit)?.toLocaleDateString()} • 
          Next scheduled: {new Date(complianceData.nextAudit)?.toLocaleDateString()}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-muted-foreground">
            {complianceData?.items?.filter(item => item?.status === 'compliant')?.length} of {complianceData?.items?.length} items compliant
          </span>
          <Button variant="outline" size="sm">
            Run Audit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStatus;