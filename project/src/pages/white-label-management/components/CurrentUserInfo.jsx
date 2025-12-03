import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentUserInfo = ({ onClose }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading user information...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center py-12">
          <Icon name="UserX" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No User Logged In</h3>
          <p className="text-muted-foreground mb-6">
            Please log in to view user information and access the application features.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            <Icon name="LogIn" size={16} />
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'super_admin': 'Super Administrator',
      'admin': 'Administrator', 
      'sales_rep': 'Sales Representative',
      'manager': 'Manager',
      'user': 'User'
    };
    return roleMap?.[role] || role || 'User';
  };

  const getRoleBadgeColor = (role) => {
    const colorMap = {
      'super_admin': 'bg-red-100 text-red-800',
      'admin': 'bg-purple-100 text-purple-800',
      'sales_rep': 'bg-blue-100 text-blue-800',
      'manager': 'bg-green-100 text-green-800',
      'user': 'bg-gray-100 text-gray-800'
    };
    return colorMap?.[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Current User Information</h2>
          <p className="text-muted-foreground">View details about the currently logged-in user</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            <Icon name="X" size={16} />
            Close
          </Button>
        )}
      </div>
      {/* User Status Card */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-start gap-6">
          {/* User Avatar */}
          <div className="bg-primary/10 rounded-full p-4 flex-shrink-0">
            <Icon name="User" size={32} className="text-primary" />
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {userProfile?.full_name || user?.user_metadata?.full_name || 'Unknown User'}
                </h3>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(userProfile?.role)}`}>
                  {getRoleDisplayName(userProfile?.role)}
                </span>
                {userProfile?.is_active ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* User Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Account Information</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="text-foreground font-mono text-xs">{user?.id?.substring(0, 8)}...</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email Verified:</span>
                    <span className={user?.email_confirmed_at ? 'text-success' : 'text-destructive'}>
                      {user?.email_confirmed_at ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-foreground">
                      {user?.phone || userProfile?.phone || 'Not provided'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="text-foreground capitalize">
                      {user?.app_metadata?.provider || 'email'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Session Information</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Sign In:</span>
                    <span className="text-foreground text-xs">
                      {formatDate(user?.last_sign_in_at)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Created:</span>
                    <span className="text-foreground text-xs">
                      {formatDate(user?.created_at)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Updated:</span>
                    <span className="text-foreground text-xs">
                      {formatDate(userProfile?.updated_at)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Zone:</span>
                    <span className="text-foreground">
                      {Intl.DateTimeFormat()?.resolvedOptions()?.timeZone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Profile Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h4 className="font-medium text-foreground mb-4">Quick Actions</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile-settings'}>
            <Icon name="Settings" size={14} />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
            <Icon name="LogOut" size={14} />
            Sign Out
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location?.reload()}>
            <Icon name="RefreshCw" size={14} />
            Refresh Data
          </Button>
        </div>
      </div>
      {/* Debug Information (only for development) */}
      {process.env?.NODE_ENV === 'development' && (
        <details className="bg-card rounded-lg border border-border p-6">
          <summary className="font-medium text-foreground cursor-pointer">
            Debug Information (Development Only)
          </summary>
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="font-medium text-sm text-foreground mb-2">Raw User Object:</h5>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40 text-muted-foreground">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <h5 className="font-medium text-sm text-foreground mb-2">Raw User Profile Object:</h5>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40 text-muted-foreground">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      )}
    </div>
  );
};

export default CurrentUserInfo;