import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ProfileSettings = () => {
  const { user, userProfile, updateProfile, initialized } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    full_name: '',
    phone: '',
    company: '',
    role: '',
    timezone: '',
    bio: ''
  });

  // ENHANCEMENT: Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile?.first_name || '',
        last_name: userProfile?.last_name || '',
        full_name: userProfile?.full_name || '',
        phone: userProfile?.phone || '',
        company: userProfile?.company || '',
        role: userProfile?.role || userProfile?.user_type || '',
        timezone: userProfile?.timezone || 'America/New_York',
        bio: userProfile?.bio || ''
      });
    } else if (user?.user_metadata) {
      // Fallback to auth metadata if profile doesn't exist yet
      setFormData({
        first_name: user?.user_metadata?.first_name || '',
        last_name: user?.user_metadata?.last_name || '',
        full_name: user?.user_metadata?.full_name || '',
        phone: user?.user_metadata?.phone || '',
        company: user?.user_metadata?.company || '',
        role: user?.user_metadata?.role || 'sales_rep',
        timezone: 'America/New_York',
        bio: ''
      });
    }
  }, [user, userProfile]);

  // ENHANCEMENT: Client-side validation function
  const validateForm = () => {
    const errors = {};
    
    // At least one name field is required
    if (!formData?.first_name?.trim() && !formData?.last_name?.trim() && !formData?.full_name?.trim()) {
      errors.names = 'Please provide at least a first name, last name, or full name.';
    }
    
    // Phone validation (if provided)
    if (formData?.phone?.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex?.test(formData?.phone?.replace(/[\s\-\(\)]/g, ''))) {
        errors.phone = 'Please enter a valid phone number.';
      }
    }
    
    // Bio length validation
    if (formData?.bio && formData?.bio?.length > 500) {
      errors.bio = 'Bio must be 500 characters or less.';
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    
    // Clear error for this field when user starts typing
    if (formErrors?.[name] || formErrors?.names) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors?.[name];
        if (name === 'first_name' || name === 'last_name' || name === 'full_name') {
          delete newErrors?.names;
        }
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-update full_name when first_name or last_name changes
    if (name === 'first_name' || name === 'last_name') {
      const updatedFormData = { ...formData, [name]: value };
      const fullName = `${updatedFormData?.first_name || ''} ${updatedFormData?.last_name || ''}`?.trim();
      if (fullName) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          full_name: fullName
        }));
      }
    }
  };

  // ENHANCEMENT: Handle field blur for validation
  const handleBlur = (e) => {
    const { name } = e?.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const errors = validateForm();
    setFormErrors(errors);
  };

  // ENHANCED: Improved submit handler with better error handling and timeout
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors)?.length > 0) {
      setFormErrors(errors);
      setMessage({
        type: 'error',
        text: 'Please fix the validation errors below.'
      });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    setFormErrors({});

    try {
      console.log('Submitting profile update with data:', formData);
      
      // ENHANCEMENT: Add explicit timeout and better error handling with retry logic
      let lastError;
      let attempts = 0;
      const maxAttempts = 2;
      
      while (attempts < maxAttempts) {
        attempts++;
        try {
          const updatePromise = updateProfile(formData);
          
          // 15 second timeout for profile update
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Profile update is taking too long. Please check your connection and try again.'));
            }, 15000);
          });

          await Promise.race([updatePromise, timeoutPromise]);
          
          console.log('Profile update completed successfully');
          
          setMessage({
            type: 'success',
            text: 'Profile updated successfully!'
          });

          // Clear message after 5 seconds
          setTimeout(() => {
            setMessage({ type: '', text: '' });
          }, 5000);
          
          // Exit retry loop on success
          break;
          
        } catch (error) {
          lastError = error;
          
          // Only retry on network/timeout errors
          if (attempts < maxAttempts && (
            error?.message?.includes('timeout') ||
            error?.message?.includes('Failed to fetch') ||
            error?.message?.includes('NetworkError')
          )) {
            console.log(`Attempt ${attempts} failed, retrying...`, error?.message);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            continue;
          }
          
          throw error;
        }
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      
      // ENHANCEMENT: More specific error handling
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error?.message?.includes('timeout') || error?.message?.includes('timed out')) {
        errorMessage = 'Profile update timed out. Please check your internet connection and try again.';
      } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        errorMessage = 'Cannot connect to the server. Please check your internet connection and try again.';
      } else if (error?.message?.includes('permission denied') || error?.message?.includes('RLS')) {
        errorMessage = 'You do not have permission to update this profile. Please sign in again and try.';
      } else if (error?.message?.includes('Invalid data')) {
        errorMessage = 'Please check your input data and try again.';
      } else if (error?.message?.includes('duplicate key') || error?.message?.includes('already exists')) {
        errorMessage = 'Some information you entered is already in use. Please try different values.';
      } else if (error?.message) {
        errorMessage = error?.message;
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });

      // Clear error message after 10 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 10000);
      
    } finally {
      // CRITICAL FIX: Always set loading to false
      setLoading(false);
    }
  };

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (UTC-5)' },
    { value: 'America/Chicago', label: 'Central Time (UTC-6)' },
    { value: 'America/Denver', label: 'Mountain Time (UTC-7)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (UTC-8)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'Europe/Paris', label: 'Central European Time (UTC+1)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (UTC+9)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (UTC+10)' }
  ];

  // ENHANCEMENT: Better loading state handling
  if (!initialized) {
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Loading Profile Settings</h2>
              <p className="text-muted-foreground">
                Please wait while we initialize your profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              <Icon name="User" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access your profile settings.
              </p>
              <Button onClick={() => window.location.href = '/user-authentication'}>
                Sign In to Continue
              </Button>
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>

                {message?.text && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    message?.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={message?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                        size={16} 
                      />
                      <span>{message?.text}</span>
                    </div>
                  </div>
                )}

                {/* ENHANCEMENT: Connection Status Indicator */}
                <div className={`mb-6 p-4 rounded-lg border ${
                  navigator.onLine && user && initialized 
                    ? 'bg-green-50 border-green-200' :'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Icon name="Wifi" size={16} className={
                      navigator.onLine && user && initialized 
                        ? 'text-green-600' :'text-amber-600'
                    } />
                    <div className={`text-sm ${
                      navigator.onLine && user && initialized 
                        ? 'text-green-800' :'text-amber-800'
                    }`}>
                      <p className="font-medium">System Status</p>
                      <div className="text-xs mt-1 space-y-1">
                        <div>
                          {navigator.onLine ? '✅ Connected to server' : '❌ No internet connection'}
                        </div>
                        <div>
                          {user ? '✅ User authenticated' : '❌ Not authenticated'}
                        </div>
                        <div>
                          {initialized ? '✅ System initialized' : '⚠️ System loading'}
                        </div>
                        <div>
                          {userProfile ? '✅ Profile loaded' : '⚠️ Profile not loaded'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields with Enhanced Validation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <Input
                        name="first_name"
                        value={formData?.first_name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your first name"
                        disabled={loading}
                        className={formErrors?.names && touched?.first_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <Input
                        name="last_name"
                        value={formData?.last_name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your last name"
                        disabled={loading}
                        className={formErrors?.names && touched?.last_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                      />
                    </div>
                  </div>

                  {/* Show names validation error */}
                  {formErrors?.names && (
                    <div className="text-red-600 text-sm flex items-center space-x-1">
                      <Icon name="AlertCircle" size={14} />
                      <span>{formErrors?.names}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      name="full_name"
                      value={formData?.full_name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      disabled={loading}
                      className={formErrors?.names && touched?.full_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed from profile settings. Contact support if needed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        value={formData?.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your phone number"
                        disabled={loading}
                        className={formErrors?.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                      />
                      {formErrors?.phone && (
                        <div className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                          <Icon name="AlertCircle" size={14} />
                          <span>{formErrors?.phone}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company
                      </label>
                      <Input
                        name="company"
                        value={formData?.company}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your company name"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Role
                      </label>
                      <Input
                        name="role"
                        value={formData?.role}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your role"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={formData?.timezone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {timezones?.map((tz) => (
                          <option key={tz?.value} value={tz?.value}>
                            {tz?.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bio
                      <span className="text-xs text-muted-foreground ml-2">
                        ({formData?.bio?.length || 0}/500)
                      </span>
                    </label>
                    <textarea
                      name="bio"
                      value={formData?.bio}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      disabled={loading}
                      className={`w-full px-3 py-2 border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        formErrors?.bio ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {formErrors?.bio && (
                      <div className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                        <Icon name="AlertCircle" size={14} />
                        <span>{formErrors?.bio}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.location.href = '/main-dashboard'}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading || Object.keys(formErrors)?.length > 0}>
                      {loading ? (
                        <>
                          <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Icon name="Save" size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Profile Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {(formData?.first_name?.[0] || '') + (formData?.last_name?.[0] || '') || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {formData?.full_name || `${formData?.first_name} ${formData?.last_name}` || 'No name set'}
                      </p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Company</span>
                      <span className="text-sm text-foreground">{formData?.company || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Role</span>
                      <span className="text-sm text-foreground">{formData?.role || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Timezone</span>
                      <span className="text-sm text-foreground">
                        {timezones?.find(tz => tz?.value === formData?.timezone)?.label || 'Eastern Time'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span className="text-sm text-foreground">Email Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={16} className="text-primary" />
                    <span className="text-sm text-foreground">Account Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Joined {user?.created_at ? new Date(user?.created_at)?.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      }) : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ENHANCEMENT: Quick Actions Panel */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/main-dashboard'}
                    disabled={loading}
                  >
                    <Icon name="Home" size={16} className="mr-2" />
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/user-authentication'}
                    disabled={loading}
                  >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;