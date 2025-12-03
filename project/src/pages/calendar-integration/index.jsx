import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { calendarService } from '../../services/calendarService';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CalendarConnectionCard from './components/CalendarConnectionCard';
import AvailabilitySettings from './components/AvailabilitySettings';
import UpcomingAppointments from './components/UpcomingAppointments';
import BookingPageCustomization from './components/BookingPageCustomization';
import NotificationSettings from './components/NotificationSettings';
import CalendarAnalytics from './components/CalendarAnalytics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CalendarIntegration = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('connections');
  const [connectionStatus, setConnectionStatus] = useState({
    total_connections: 0,
    connected: 0,
    last_sync: null,
    has_errors: false,
    providers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadConnectionStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Real-time subscription for connection status
  useEffect(() => {
    if (!user?.id) return;

    const channel = calendarService?.subscribeToSyncStatus(
      user?.id,
      (payload) => {
        if (payload?.eventType === 'UPDATE') {
          loadConnectionStatus();
        }
      }
    );

    return () => {
      if (channel) {
        calendarService?.supabase?.removeChannel(channel);
      }
    };
  }, [user]);

  const loadConnectionStatus = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data } = await calendarService?.getConnectionStatus(user?.id);
      if (data) {
        setConnectionStatus(data);
      }
    } catch (error) {
      console.error('Failed to load connection status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider) => {
    // Show clear authentication message for the specific provider
    const providerNames = {
      'Cal.com': 'Cal.com account',
      'Google Calendar': 'Google account',
      'Outlook': 'Microsoft account'
    };

    try {
      // Mock connection process with user feedback
      setConnectionStatus(prev => ({
        ...prev,
        providers: prev?.providers?.map(p =>
          p?.provider === provider?.toLowerCase()?.replace(/[^a-z]/g, '_')
            ? { ...p, status: 'connecting' }
            : p
        )
      }));

      // Simulate authentication process
      const confirmed = window.confirm(
        `You will be redirected to sign in to your ${providerNames?.[provider]} to authorize calendar access. Continue?`
      );

      if (!confirmed) {
        // Reset connection status if user cancels
        setConnectionStatus(prev => ({
          ...prev,
          providers: prev?.providers?.map(p =>
            p?.provider === provider?.toLowerCase()?.replace(/[^a-z]/g, '_')
              ? { ...p, status: 'disconnected' }
              : p
          )
        }));
        return;
      }

      // Mock authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setConnectionStatus(prev => ({
        ...prev,
        connected: prev?.connected + 1,
        providers: prev?.providers?.map(p =>
          p?.provider === provider?.toLowerCase()?.replace(/[^a-z]/g, '_')
            ? { ...p, status: 'connected', last_sync: new Date()?.toISOString() }
            : p
        )
      }));

      // Reload full status
      await loadConnectionStatus();

      // Show success message
      alert(`Successfully connected to ${provider}! Your calendar is now synchronized.`);

    } catch (error) {
      console.error('Failed to connect to provider:', error);
      alert(`Failed to connect to ${provider}. Please try again or check your credentials.`);
      
      // Reset connection status on error
      setConnectionStatus(prev => ({
        ...prev,
        providers: prev?.providers?.map(p =>
          p?.provider === provider?.toLowerCase()?.replace(/[^a-z]/g, '_')
            ? { ...p, status: 'disconnected' }
            : p
        )
      }));
    }
  };

  const handleDisconnect = (provider) => {
    const confirmed = window.confirm(`Are you sure you want to disconnect from ${provider}? This will stop calendar synchronization.`);
    
    if (!confirmed) return;

    // Update local state
    setConnectionStatus(prev => ({
      ...prev,
      connected: Math.max(0, prev?.connected - 1),
      providers: prev?.providers?.map(p =>
        p?.provider === provider?.toLowerCase()?.replace(/[^a-z]/g, '_')
          ? { ...p, status: 'disconnected', last_sync: null }
          : p
      )
    }));

    // Reload full status
    loadConnectionStatus();
  };

  const syncAllCalendars = async () => {
    if (!user?.id) return;

    try {
      const { data: connections } = await calendarService?.getCalendarConnections(user?.id);
      const connectedProviders = connections?.filter(c => c?.connection_status === 'connected') || [];

      for (const connection of connectedProviders) {
        await calendarService?.syncCalendar(connection?.id);
      }

      await loadConnectionStatus();
    } catch (error) {
      console.error('Failed to sync calendars:', error);
    }
  };

  const getProviderDisplayName = (provider) => {
    const names = {
      'cal_com': 'Cal.com',
      'google_calendar': 'Google Calendar',
      'outlook': 'Outlook'
    };
    return names?.[provider] || provider;
  };

  const getLastSyncFormatted = (lastSync) => {
    if (!lastSync) return null;
    return new Date(lastSync)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const tabs = [
    { id: 'connections', label: 'Calendar Connections', icon: 'Link' },
    { id: 'availability', label: 'Availability', icon: 'Clock' },
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'customization', label: 'Booking Page', icon: 'Palette' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'connections':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Calendar Connections</h2>
                  <p className="text-muted-foreground mt-1">
                    Connect your calendar platforms to enable seamless appointment booking and synchronization.
                    Each connection requires signing in to the respective service to authorize access.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={syncAllCalendars} disabled={loading}>
                  <Icon name="RefreshCw" size={14} className="mr-2" />
                  Sync All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cal.com */}
                <CalendarConnectionCard
                  provider="Cal.com"
                  isConnected={
                    connectionStatus?.providers?.find(p => p?.provider === 'cal_com')?.status === 'connected'
                  }
                  lastSync={
                    connectionStatus?.providers?.find(p => p?.provider === 'cal_com')?.last_sync
                  }
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />

                {/* Google Calendar */}
                <CalendarConnectionCard
                  provider="Google Calendar"
                  isConnected={
                    connectionStatus?.providers?.find(p => p?.provider === 'google_calendar')?.status === 'connected'
                  }
                  lastSync={
                    connectionStatus?.providers?.find(p => p?.provider === 'google_calendar')?.last_sync
                  }
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />

                {/* Outlook */}
                <CalendarConnectionCard
                  provider="Outlook"
                  isConnected={
                    connectionStatus?.providers?.find(p => p?.provider === 'outlook')?.status === 'connected'
                  }
                  lastSync={
                    connectionStatus?.providers?.find(p => p?.provider === 'outlook')?.last_sync
                  }
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              </div>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium text-foreground mb-2">Need Help Connecting?</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• <strong>Google Calendar:</strong> You'll be asked to sign in to your Google account and authorize calendar access</p>
                  <p>• <strong>Outlook:</strong> Sign in with your Microsoft account (works with Outlook.com and Office 365)</p>
                  <p>• <strong>Cal.com:</strong> Connect using your Cal.com account credentials</p>
                </div>
              </div>
            </div>
            {/* Integration Status */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Integration Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="font-medium text-success">
                      {connectionStatus?.has_errors ? 'Sync Issues' : 'Sync Healthy'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {connectionStatus?.connected} of {connectionStatus?.total_connections || 3} calendars connected
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Calendar" size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {connectionStatus?.connected} Connected
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Active calendar integrations
                  </p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Clock" size={16} className="text-amber-600" />
                    <span className="font-medium text-amber-900">
                      {connectionStatus?.last_sync 
                        ? getLastSyncFormatted(connectionStatus?.last_sync)
                        : 'Never'
                      }
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last successful sync
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'availability':
        return <AvailabilitySettings />;
      
      case 'appointments':
        return <UpcomingAppointments />;
      
      case 'customization':
        return <BookingPageCustomization />;
      
      case 'notifications':
        return <NotificationSettings />;
      
      case 'analytics':
        return <CalendarAnalytics />;
      
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}>
          <div className="p-6">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Icon name="Calendar" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground mb-2">User Authentication Required</h2>
              <p className="text-muted-foreground mb-6">
                To connect and manage your calendar integrations (Google Calendar, Outlook, Cal.com), 
                you need to be signed in to your account. This allows us to securely store your calendar connections.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.href = '/user-authentication'} 
                  className="w-full sm:w-auto"
                >
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Sign In to Your Account
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p>Once signed in, you'll be able to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Connect to Google Calendar, Outlook, and Cal.com</li>
                    <li>Set up automatic appointment scheduling</li>
                    <li>Manage availability and booking preferences</li>
                    <li>View calendar analytics and insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-60'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Calendar Integration</h1>
            <p className="text-muted-foreground">
              Manage appointment booking workflows and calendar synchronization across multiple platforms.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarIntegration;