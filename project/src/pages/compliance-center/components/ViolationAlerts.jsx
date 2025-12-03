import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViolationAlerts = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  const violations = [
    {
      id: 1,
      type: 'critical',
      title: 'Missing Unsubscribe Link',
      description: 'Email template "Healthcare Reactivation Q1" is missing required unsubscribe mechanism',
      campaign: 'Healthcare Reactivation Q1',
      regulation: 'CAN-SPAM Act',
      detectedAt: '2025-01-15 14:30:25',
      status: 'active',
      affectedContacts: 1247,
      suggestedAction: 'Add unsubscribe link to email footer and republish template'
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Opt-out Rate Detected',
      description: 'SMS campaign showing 15% opt-out rate, exceeding recommended threshold of 10%',
      campaign: 'Solar Lead Reactivation',
      regulation: 'TCPA',
      detectedAt: '2025-01-15 13:45:12',
      status: 'monitoring',
      affectedContacts: 892,
      suggestedAction: 'Review message content and reduce sending frequency'
    },
    {
      id: 3,
      type: 'critical',
      title: 'Consent Record Missing',
      description: 'Voice campaign targeting contacts without documented consent records',
      campaign: 'Insurance Follow-up',
      regulation: 'TCPA',
      detectedAt: '2025-01-15 12:15:08',
      status: 'paused',
      affectedContacts: 456,
      suggestedAction: 'Verify consent records before resuming voice outreach'
    },
    {
      id: 4,
      type: 'info',
      title: 'Data Retention Review Due',
      description: 'Healthcare campaign data approaching 7-year retention limit',
      campaign: 'Healthcare Reactivation 2018',
      regulation: 'HIPAA',
      detectedAt: '2025-01-15 11:20:45',
      status: 'scheduled',
      affectedContacts: 2341,
      suggestedAction: 'Review and archive or delete data as per retention policy'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'info':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-error text-error-foreground';
      case 'monitoring':
        return 'bg-warning text-warning-foreground';
      case 'paused':
        return 'bg-muted text-muted-foreground';
      case 'scheduled':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleResolveViolation = (violationId) => {
    console.log('Resolving violation:', violationId);
  };

  const handleDismissAlert = (violationId) => {
    console.log('Dismissing alert:', violationId);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Violation Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Real-time compliance violations and corrective actions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {violations?.filter(v => v?.status === 'active')?.length} active violations
            </span>
            <Button variant="outline" iconName="RefreshCw" size="sm">
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {violations?.map((violation) => (
            <div
              key={violation?.id}
              className={`p-4 border rounded-lg ${getTypeColor(violation?.type)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <Icon name={getTypeIcon(violation?.type)} size={20} />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{violation?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{violation?.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Campaign: {violation?.campaign}</span>
                      <span>Regulation: {violation?.regulation}</span>
                      <span>Detected: {violation?.detectedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(violation?.status)}`}>
                    {violation?.status?.charAt(0)?.toUpperCase() + violation?.status?.slice(1)}
                  </span>
                </div>
              </div>

              <div className="bg-card/50 p-3 rounded-lg mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Affected Contacts</span>
                  <span className="text-sm text-foreground">{violation?.affectedContacts?.toLocaleString()}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Suggested Action:</strong> {violation?.suggestedAction}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  iconName="CheckCircle"
                  iconPosition="left"
                  onClick={() => handleResolveViolation(violation?.id)}
                >
                  Resolve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  onClick={() => setSelectedAlert(violation)}
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => handleDismissAlert(violation?.id)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>

        {violations?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">All Clear!</h4>
            <p className="text-muted-foreground">No compliance violations detected at this time.</p>
          </div>
        )}
      </div>
      {/* Violation Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Violation Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAlert(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">{selectedAlert?.title}</h4>
                <p className="text-muted-foreground">{selectedAlert?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-foreground">Campaign</span>
                  <p className="text-sm text-muted-foreground">{selectedAlert?.campaign}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Regulation</span>
                  <p className="text-sm text-muted-foreground">{selectedAlert?.regulation}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Detected At</span>
                  <p className="text-sm text-muted-foreground">{selectedAlert?.detectedAt}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Affected Contacts</span>
                  <p className="text-sm text-muted-foreground">{selectedAlert?.affectedContacts?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium text-foreground mb-2">Recommended Action</h5>
                <p className="text-sm text-muted-foreground">{selectedAlert?.suggestedAction}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  onClick={() => {
                    handleResolveViolation(selectedAlert?.id);
                    setSelectedAlert(null);
                  }}
                >
                  Mark as Resolved
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationAlerts;