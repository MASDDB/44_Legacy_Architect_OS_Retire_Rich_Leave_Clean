import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignStatusPanel = ({ campaigns }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'paused':
        return 'bg-warning text-warning-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Active Campaigns</h2>
        <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
          New Campaign
        </Button>
      </div>
      <div className="space-y-4">
        {campaigns?.map((campaign) => (
          <div key={campaign?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className="font-medium text-foreground">{campaign?.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign?.status)}`}>
                  {campaign?.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon name={campaign?.status === 'active' ? 'Pause' : 'Play'} size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Icon name="Settings" size={16} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-lg font-semibold text-foreground">{campaign?.totalLeads}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Contacted</p>
                <p className="text-lg font-semibold text-foreground">{campaign?.contacted}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Appointments</p>
                <p className="text-lg font-semibold text-success">{campaign?.appointments}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{campaign?.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(campaign?.progress)}`}
                  style={{ width: `${campaign?.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignStatusPanel;