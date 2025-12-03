import React, { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, UserX, Activity } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { adminService } from '../../../services/adminService';

const SuperAdminPanel = () => {
  const { userProfile } = useAuth();
  const [sessionData, setSessionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Don't render if not super admin
  if (!adminService?.isSuperAdmin(userProfile)) {
    return null;
  }

  // Load session data on mount
  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    try {
      setIsLoading(true);
      const result = await adminService?.getActiveSessionsCount();
      if (result?.success) {
        setSessionData({
          activeSessions: result?.activeSessions || 0,
          totalUsers: result?.totalUsers || 0
        });
      }
    } catch (error) {
      showMessage(error?.message || 'Failed to load session data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllUsers = async () => {
    if (!window.confirm(
      '⚠️ CRITICAL ACTION: This will immediately log out all users system-wide.\n\n' +
      `• ${sessionData?.activeSessions || 0} active sessions will be terminated\n` +
      '• Users will need to sign in again\n' + '• This action cannot be undone\n\n'+ 'Continue with system-wide logout?'
    )) {
      return;
    }

    try {
      setIsLogoutLoading(true);
      const result = await adminService?.logoutAllUsers();
      
      if (result?.success) {
        showMessage(
          `✅ ${result?.message}. ${result?.affectedSessions || 0} sessions terminated.`,
          'success'
        );
        // Reload session data to show updated counts
        await loadSessionData();
      }
    } catch (error) {
      showMessage(error?.message || 'Failed to logout all users', 'error');
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-red-600 mr-2" />
        <h2 className="text-lg font-bold text-red-800">Super Admin Panel</h2>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : sessionData?.activeSessions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : sessionData?.totalUsers || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleLogoutAllUsers}
          disabled={isLogoutLoading || isLoading}
          variant="outline"
          className="w-full bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 disabled:opacity-50"
        >
          <div className="flex items-center justify-center">
            <UserX className="h-4 w-4 mr-2" />
            {isLogoutLoading ? 'Logging Out All Users...' : 'Logout All Users'}
          </div>
        </Button>

        <Button
          onClick={loadSessionData}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <div className="flex items-center justify-center">
            <Activity className="h-4 w-4 mr-2" />
            {isLoading ? 'Refreshing...' : 'Refresh Session Data'}
          </div>
        </Button>
      </div>

      {/* Warning Notice */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">System Administration</p>
            <p className="text-xs text-yellow-700 mt-1">
              Use these controls carefully. Logout all users will immediately terminate all active sessions except your own.
            </p>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg border ${
          messageType === 'success' ?'bg-green-50 border-green-200 text-green-800' :'bg-red-50 border-red-200 text-red-800'
        }`}>
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;