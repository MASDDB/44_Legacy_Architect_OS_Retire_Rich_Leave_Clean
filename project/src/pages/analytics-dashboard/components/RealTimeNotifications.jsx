import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock real-time notifications
  const mockNotifications = [
    {
      id: 'notif_001',
      type: 'campaign_milestone',
      title: 'Campaign Milestone Reached',
      message: 'Q4 Solar Reactivation has reached 500 appointments booked!',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      icon: 'Target',
      priority: 'high',
      read: false
    },
    {
      id: 'notif_002',
      type: 'revenue_update',
      title: 'Revenue Goal Achieved',
      message: 'Monthly revenue target of $100k exceeded with $127,450',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      icon: 'DollarSign',
      priority: 'high',
      read: false
    },
    {
      id: 'notif_003',
      type: 'lead_conversion',
      title: 'High Conversion Rate Alert',
      message: 'Healthcare campaign showing 32% conversion rate - 15% above average',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      icon: 'TrendingUp',
      priority: 'medium',
      read: true
    },
    {
      id: 'notif_004',
      type: 'appointment_reminder',
      title: 'Appointment Confirmation Needed',
      message: '23 appointments scheduled for tomorrow require confirmation',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'Calendar',
      priority: 'medium',
      read: true
    },
    {
      id: 'notif_005',
      type: 'system_update',
      title: 'Campaign Performance Update',
      message: 'Weekly analytics report is now available for download',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: 'BarChart3',
      priority: 'low',
      read: true
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newNotification = {
        id: `notif_${Date.now()}`,
        type: 'live_update',
        title: 'Live Update',
        message: `New appointment booked - ${Math.floor(Math.random() * 100)} total today`,
        timestamp: new Date(),
        icon: 'Bell',
        priority: 'low',
        read: false
      };

      setNotifications(prev => [newNotification, ...prev?.slice(0, 9)]);
    }, 30000); // Add new notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev?.map(notif =>
        notif?.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev?.map(notif => ({ ...notif, read: true }))
    );
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'campaign_milestone': return 'Target';
      case 'revenue_update': return 'DollarSign';
      case 'lead_conversion': return 'TrendingUp';
      case 'appointment_reminder': return 'Calendar';
      case 'system_update': return 'BarChart3';
      case 'live_update': return 'Bell';
      default: return 'Bell';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Icon name="Bell" size={20} className="text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Live Updates</h3>
            <p className="text-sm text-muted-foreground">
              Real-time campaign notifications and alerts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Notifications List */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-y-auto`}>
        {notifications?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                  !notification?.read ? 'bg-muted/20' : ''
                }`}
                onClick={() => markAsRead(notification?.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    notification?.priority === 'high' ? 'bg-error/10' :
                    notification?.priority === 'medium' ? 'bg-warning/10' : 'bg-primary/10'
                  }`}>
                    <Icon 
                      name={getNotificationIcon(notification?.type)} 
                      size={16} 
                      className={
                        notification?.priority === 'high' ? 'text-error' :
                        notification?.priority === 'medium' ? 'text-warning' : 'text-primary'
                      }
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${
                        !notification?.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification?.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        {!notification?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(notification?.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification?.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      {notifications?.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            iconName="ExternalLink"
            iconPosition="right"
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default RealTimeNotifications;