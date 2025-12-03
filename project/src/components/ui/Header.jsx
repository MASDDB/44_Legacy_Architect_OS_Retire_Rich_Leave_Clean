import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const { 
    user, 
    userProfile, 
    signOut, 
    loading,
    initialized,
    getUserDisplayName,
    getUserEmail, 
    getUserRole 
  } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Campaign "Q4 Reactivation" completed', time: '2 min ago', type: 'success', read: false },
    { id: 2, title: 'New leads imported successfully', time: '15 min ago', type: 'info', read: false },
    { id: 3, title: 'Compliance review required', time: '1 hour ago', type: 'warning', read: true }
  ]);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document?.addEventListener('mousedown', handleClickOutside);
    return () => document?.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (e) => {
    e?.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserMenuClick = (e) => {
    e?.stopPropagation();
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      setShowUserMenu(false);
      
      console.log('Initiating logout...');
      await signOut();
      
      console.log('Logout successful, redirecting...');
      
      // Force redirect after successful signout
      setTimeout(() => {
        window.location.href = '/user-authentication';
      }, 100);
      
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Even if signOut fails, force redirect to login page
      setTimeout(() => {
        window.location.href = '/user-authentication';
      }, 100);
      
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleProfileSettings = () => {
    setShowUserMenu(false);
    window.location.href = '/profile-settings';
  };

  const handleAccountSettings = () => {
    setShowUserMenu(false);
    window.location.href = '/account-settings';
  };

  // Get user initials
  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name === 'Loading...' || loading || !initialized) return '...';
    
    const words = name?.split(' ') || ['U'];
    if (words?.length >= 2) {
      return (words?.[0]?.[0] + words?.[1]?.[0])?.toUpperCase() || 'U';
    }
    return name?.slice(0, 2)?.toUpperCase() || 'U';
  };

  // Show loading state while auth is initializing
  if (loading || !initialized) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Database Reactivation
              </span>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile Menu Toggle - Only visible on mobile */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Icon name="Menu" size={20} />
          </Button>
        </div>

        {/* Logo - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Database" size={20} color="white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Database Reactivation
            </span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Authentication Status */}
          {user ? (
            <>
              {/* User Profile & Actions */}
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <div className="relative dropdown-container">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNotificationClick}
                    className="relative hover:bg-gray-100"
                  >
                    <Icon name="Bell" size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications?.map((notification) => (
                          <div
                            key={notification?.id}
                            className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                              !notification?.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification?.type === 'success' ? 'bg-green-500' :
                                notification?.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{notification?.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification?.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <Button variant="ghost" size="sm" className="w-full">
                          View All Notifications
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sign Out Button - Prominent Red Button */}
                <Button
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                  size="sm"
                >
                  {isSigningOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing Out...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </>
                  )}
                </Button>
                
                {/* User Profile Dropdown */}
                <div className="relative dropdown-container">
                  <Button
                    variant="ghost"
                    onClick={handleUserMenuClick}
                    className="flex items-center space-x-2 px-3 hover:bg-gray-100"
                    disabled={isSigningOut}
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getUserRole()}
                      </p>
                    </div>
                    <Icon name="ChevronDown" size={16} />
                  </Button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-600">{getUserEmail()}</p>
                        <p className="text-xs text-gray-500 mt-1">{getUserRole()}</p>
                        {userProfile?.id && (
                          <p className="text-xs text-gray-400 mt-1">ID: {userProfile?.id?.slice(0, 8)}...</p>
                        )}
                      </div>
                      <div className="py-2">
                        <button 
                          onClick={handleProfileSettings}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Icon name="User" size={16} />
                          <span>Profile Settings</span>
                        </button>
                        <button 
                          onClick={handleAccountSettings}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Icon name="Settings" size={16} />
                          <span>Account Settings</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                          <Icon name="HelpCircle" size={16} />
                          <span>Help & Support</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Not Authenticated - Show Sign In Button */
            (<div className="flex items-center space-x-2">
              <Button 
                onClick={() => window.location.href = '/user-authentication'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Icon name="LogIn" size={16} className="mr-2" />
                Sign In
              </Button>
            </div>)
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;