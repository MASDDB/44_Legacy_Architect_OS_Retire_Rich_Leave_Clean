import React, { useState } from 'react';
import { calendarService } from '../../../services/calendarService';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarConnectionCard = ({ provider, isConnected, lastSync, onConnect, onDisconnect }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProviderInfo = (provider) => {
    const providers = {
      'Cal.com': {
        icon: 'Calendar',
        color: 'bg-blue-500',
        description: 'Connect your Cal.com account for seamless scheduling',
        website: 'https://cal.com'
      },
      'Google Calendar': {
        icon: 'Chrome',
        color: 'bg-red-500',
        description: 'Sync with Google Calendar for unified scheduling',
        website: 'https://calendar.google.com'
      },
      'Outlook': {
        icon: 'Mail',
        color: 'bg-blue-600',
        description: 'Integrate with Microsoft Outlook calendar',
        website: 'https://outlook.com'
      }
    };
    return providers?.[provider] || providers?.['Cal.com'];
  };

  const handleConnect = async () => {
    if (!user?.id) {
      setError('Please sign in to connect your calendar');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock connection data - in real app, this would come from OAuth flow
      const mockConnectionData = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        external_calendar_id: `cal_${provider?.toLowerCase()?.replace(/[^a-z]/g, '_')}_${user?.id}`,
        external_account_email: user?.email || `user@${provider?.toLowerCase()?.replace(/[^a-z]/g, '')}.example`,
        settings: {
          sync_enabled: true,
          webhook_enabled: true,
          default_event_type: 'meeting'
        }
      };

      const { error: connectError } = await calendarService?.connectCalendar(
        user?.id,
        provider?.toLowerCase()?.replace(/[^a-z]/g, '_'),
        mockConnectionData
      );

      if (connectError) {
        throw new Error(connectError);
      }

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onConnect) {
        onConnect(provider);
      }
    } catch (err) {
      setError(err?.message || 'Failed to connect calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Get connection ID first
      const { data: connections } = await calendarService?.getCalendarConnections(user?.id);
      const connection = connections?.find(c => 
        c?.provider === provider?.toLowerCase()?.replace(/[^a-z]/g, '_')
      );

      if (!connection) {
        throw new Error('Connection not found');
      }

      const { error: disconnectError } = await calendarService?.disconnectCalendar(connection?.id);

      if (disconnectError) {
        throw new Error(disconnectError);
      }

      if (onDisconnect) {
        onDisconnect(provider);
      }
    } catch (err) {
      setError(err?.message || 'Failed to disconnect calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Get connection ID
      const { data: connections } = await calendarService?.getCalendarConnections(user?.id);
      const connection = connections?.find(c => 
        c?.provider === provider?.toLowerCase()?.replace(/[^a-z]/g, '_')
      );

      if (!connection) {
        throw new Error('Connection not found');
      }

      const { error: syncError } = await calendarService?.syncCalendar(connection?.id);

      if (syncError) {
        throw new Error(syncError);
      }

      // Refresh the parent component to show updated sync time
      if (onConnect) {
        onConnect(provider);
      }
    } catch (err) {
      setError(err?.message || 'Failed to sync calendar');
    } finally {
      setLoading(false);
    }
  };

  const providerInfo = getProviderInfo(provider);
  const formatLastSync = (lastSync) => {
    if (!lastSync) return null;
    return new Date(lastSync)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${providerInfo?.color} flex items-center justify-center`}>
            <Icon name={providerInfo?.icon} size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{provider}</h4>
            <p className="text-sm text-muted-foreground">Calendar Integration</p>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-success' : 'bg-muted-foreground'
          }`} />
          <span className={`text-sm font-medium ${
            isConnected ? 'text-success' : 'text-muted-foreground'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">
        {providerInfo?.description}
      </p>
      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        </div>
      )}
      {/* Last Sync Info */}
      {isConnected && lastSync && (
        <div className="bg-muted rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="RotateCw" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Last synced</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatLastSync(lastSync)}
            </span>
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Icon name="RotateCw" size={14} className="mr-2 animate-spin" />
              ) : (
                <Icon name="RefreshCw" size={14} className="mr-2" />
              )}
              Sync Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={loading}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              {loading ? (
                <Icon name="Loader2" size={14} className="animate-spin" />
              ) : (
                <Icon name="Unlink" size={14} />
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={14} className="mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Icon name="Link" size={14} className="mr-2" />
                Connect {provider}
              </>
            )}
          </Button>
        )}
      </div>
      {/* Quick Stats for Connected Providers */}
      {isConnected && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sync Status</span>
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={14} className="text-success" />
              <span className="text-success font-medium">Healthy</span>
            </div>
          </div>
        </div>
      )}
      {/* Help Link */}
      <div className="mt-3 text-center">
        <a
          href={providerInfo?.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center space-x-1"
        >
          <span>Visit {provider}</span>
          <Icon name="ExternalLink" size={12} />
        </a>
      </div>
    </div>
  );
};

export default CalendarConnectionCard;