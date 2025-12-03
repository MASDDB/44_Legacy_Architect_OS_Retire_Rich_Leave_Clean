import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const auditLogs = [
    {
      id: 1,
      action: 'Opt-out Added',
      user: 'John Smith',
      details: 'Added john.doe@email.com to suppression list',
      timestamp: '2025-01-15 14:30:25',
      type: 'opt-out',
      severity: 'info'
    },
    {
      id: 2,
      action: 'Template Violation Detected',
      user: 'System',
      details: 'Email template "Healthcare Reactivation" failed CAN-SPAM compliance check',
      timestamp: '2025-01-15 13:45:12',
      type: 'violation',
      severity: 'warning'
    },
    {
      id: 3,
      action: 'Campaign Paused',
      user: 'Sarah Wilson',
      details: 'Campaign "Q1 Solar Leads" paused due to compliance violation',
      timestamp: '2025-01-15 12:15:08',
      type: 'campaign',
      severity: 'critical'
    },
    {
      id: 4,
      action: 'Compliance Settings Updated',
      user: 'Admin',
      details: 'Updated TCPA compliance rules for voice campaigns',
      timestamp: '2025-01-15 11:20:45',
      type: 'settings',
      severity: 'info'
    },
    {
      id: 5,
      action: 'Data Export',
      user: 'John Smith',
      details: 'Exported compliance report for Q4 2024',
      timestamp: '2025-01-15 10:30:15',
      type: 'export',
      severity: 'info'
    },
    {
      id: 6,
      action: 'Violation Resolved',
      user: 'Sarah Wilson',
      details: 'Fixed missing unsubscribe link in email template',
      timestamp: '2025-01-15 09:45:30',
      type: 'resolution',
      severity: 'success'
    }
  ];

  const filteredLogs = auditLogs?.filter(log => {
    const matchesSearch = log?.action?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         log?.details?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         log?.user?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || log?.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'success':
        return 'text-success bg-success/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertTriangle';
      case 'warning':
        return 'AlertCircle';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Info';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'opt-out':
        return 'UserX';
      case 'violation':
        return 'AlertTriangle';
      case 'campaign':
        return 'Target';
      case 'settings':
        return 'Settings';
      case 'export':
        return 'Download';
      case 'resolution':
        return 'CheckCircle';
      default:
        return 'Activity';
    }
  };

  const handleExportLogs = () => {
    console.log('Exporting audit logs...');
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Audit Trail</h3>
            <p className="text-sm text-muted-foreground">
              Detailed logs of all compliance actions and system events
            </p>
          </div>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={handleExportLogs}
          >
            Export Logs
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'violation', 'opt-out', 'campaign', 'settings']?.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter?.charAt(0)?.toUpperCase() + filter?.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {filteredLogs?.map((log) => (
            <div key={log?.id} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-card rounded-lg">
                  <Icon name={getTypeIcon(log?.type)} size={16} />
                </div>
                <div className={`p-1 rounded-full ${getSeverityColor(log?.severity)}`}>
                  <Icon name={getSeverityIcon(log?.severity)} size={12} />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">{log?.action}</h4>
                  <span className="text-xs text-muted-foreground">{log?.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{log?.details}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>User: {log?.user}</span>
                  <span>Type: {log?.type}</span>
                  <span className={`px-2 py-1 rounded-full ${getSeverityColor(log?.severity)}`}>
                    {log?.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No audit logs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;