import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment':
        return { icon: 'Calendar', color: 'text-success' };
      case 'lead_update':
        return { icon: 'User', color: 'text-primary' };
      case 'campaign':
        return { icon: 'Zap', color: 'text-warning' };
      case 'system':
        return { icon: 'Bell', color: 'text-muted-foreground' };
      default:
        return { icon: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => {
          const { icon, color } = getActivityIcon(activity?.type);
          
          return (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${color}`}>
                <Icon name={icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{activity?.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatTime(activity?.timestamp)}</p>
              </div>
              {activity?.priority === 'high' && (
                <div className="w-2 h-2 bg-error rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;