import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { AuthDebugger } from '../../../utils/authDebugger';

const LoginForm = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { signIn, loading, user, initialized, resendConfirmation } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [demoStatus, setDemoStatus] = useState(null);

  // Check demo user status on component mount
  useEffect(() => {
    const checkDemoUsers = async () => {
      try {
        const status = await AuthDebugger?.checkDemoUserStatus();
        setDemoStatus(status);
      } catch (error) {
        console.warn('Failed to check demo user status:', error);
      }
    };
    
    if (initialized) {
      checkDemoUsers();
    }
  }, [initialized]);

  // Redirect if already authenticated
  useEffect(() => {
    if (initialized && user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/main-dashboard');
    }
  }, [user, initialized, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      console.log('Attempting login with:', formData?.email);
      
      // Clean any corrupted auth data before login attempt
      AuthDebugger?.cleanCorruptedAuthData();
      
      await signIn(formData?.email?.trim(), formData?.password);
      
      console.log('Login successful, navigating to dashboard');
      
      // Navigate after successful login
      navigate('/main-dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if this is an email confirmation error
      if (error?.message?.includes('check your email and click the confirmation link')) {
        setShowResendButton(true);
        setResendEmail(formData?.email);
      }
      
      // Enhanced error handling
      let errorMessage = error?.message || 'Login failed. Please try again.';
      
      // Set user-friendly error message
      setErrors({
        general: errorMessage
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!resendEmail) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await resendConfirmation(resendEmail);
      
      setErrors({
        success: `New confirmation email sent to ${resendEmail}. Please check your inbox and spam folder.`
      });
      
    } catch (error) {
      console.error('Resend confirmation error:', error);
      setErrors({
        general: error?.message || 'Failed to resend confirmation email. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    const demoCredentials = {
      email: 'admin@crm-demo.com',
      password: 'demo123456'
    };
    
    try {
      console.log('Attempting demo login...');
      
      // Clean corrupted data before demo login
      AuthDebugger?.cleanCorruptedAuthData();
      
      await signIn(demoCredentials?.email, demoCredentials?.password);
      
      console.log('Demo login successful, navigating to dashboard');
      
      // Navigate after successful login
      navigate('/main-dashboard');
      
    } catch (error) {
      console.error('Demo login error:', error);
      
      setErrors({
        general: error?.message || 'Demo login failed. The demo users may need to be set up properly. Please try creating a new account instead.'
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCleanup = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('🧹 Starting auth cleanup...');
      
      const result = await AuthDebugger?.emergencyRecovery();
      
      if (result?.success) {
        setErrors({
          success: `✅ Auth cleanup completed! ${result?.recommendation}`
        });
        
        // Refresh the page after a delay
        setTimeout(() => {
          window.location?.reload();
        }, 2000);
      } else {
        setErrors({
          general: `❌ Cleanup failed: ${result?.error}. Please refresh the page manually.`
        });
      }
      
    } catch (error) {
      console.error('Cleanup error:', error);
      setErrors({
        general: '❌ Cleanup failed. Please refresh the page and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement password reset functionality later
    alert('Password reset functionality will be implemented. Please contact support for now.');
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for OAuth implementation
    alert(`${provider} login will be implemented using Supabase OAuth providers.`);
  };

  // Show loading if auth is still initializing
  if (!initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Initializing authentication...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors?.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700 flex-1">
                <p className="font-medium mb-2">Authentication Issue</p>
                <div className="whitespace-pre-line leading-relaxed">{errors?.general}</div>
                {showResendButton && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-red-800 text-xs font-medium transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Resend Confirmation Email'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {errors?.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-700">
                <p className="font-medium mb-1">Success!</p>
                <div className="whitespace-pre-line">{errors?.success}</div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Demo Credentials Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Users" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 flex-1">
              <p className="font-medium mb-2">🚀 Demo Credentials Available</p>
              
              {/* Demo Status Indicator */}
              {demoStatus?.data && (
                <div className="mb-3 p-2 bg-blue-100 rounded text-xs">
                  <p className="font-medium mb-1">Demo Status Check:</p>
                  {demoStatus?.data?.map((user, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${user?.can_login ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="font-mono text-xs">{user?.email}</span>
                      <span className="text-xs">({user?.status})</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="bg-blue-100 rounded p-2">
                  <p className="font-medium">Admin Account:</p>
                  <p className="font-mono text-xs">Email: admin@crm-demo.com</p>
                  <p className="font-mono text-xs">Password: demo123456</p>
                  <p className="text-xs text-blue-600">Full CRM system access</p>
                </div>
                <div className="bg-blue-100 rounded p-2">
                  <p className="font-medium">Sales Rep Account:</p>
                  <p className="font-mono text-xs">Email: sales@crm-demo.com</p>
                  <p className="font-mono text-xs">Password: demo123456</p>
                  <p className="text-xs text-blue-600">Standard user access</p>
                </div>
              </div>
              <p className="text-xs mt-2 text-blue-600">
                Use the demo login button below for automatic credential filling
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Settings" size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 flex-1">
              <p className="font-medium mb-2">🔧 Having Login Issues?</p>
              <div className="text-xs space-y-1 mb-3">
                <p>• If login fails repeatedly, try the auth cleanup button below</p>
                <p>• Demo accounts should work immediately after migration</p>
                <p>• New accounts require email confirmation</p>
                <p>• Check spam folder if confirmation email is missing</p>
              </div>
              <button
                type="button"
                onClick={handleAuthCleanup}
                className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-yellow-800 text-xs font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Cleaning...' : '🧹 Fix Auth Issues'}
              </button>
            </div>
          </div>
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@company.com"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading || loading}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading || loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            disabled={isLoading || loading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading || loading}
          />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-500"
            disabled={isLoading || loading}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={isLoading || loading}
          fullWidth
          className="h-12"
          disabled={isLoading || loading}
        >
          {isLoading || loading ? 'Signing In...' : 'Sign In to Dashboard'}
        </Button>

        {/* Enhanced Demo Login Button */}
        <Button
          type="button"
          onClick={handleDemoLogin}
          variant="outline"
          fullWidth
          className="h-12 text-blue-600 border-blue-300 hover:bg-blue-50"
          disabled={isLoading || loading}
        >
          {isLoading ? 'Connecting...' : '🧪 Quick Demo Login (admin@crm-demo.com)'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Sign Up Recommendation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="UserPlus" size={16} className="text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">✨ Recommended: Create New Account</p>
              <p className="text-xs">
                Sign up with any email for guaranteed access to all CRM features
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Google')}
            disabled={isLoading || loading}
          >
            <Icon name="Chrome" size={16} className="mr-2" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Microsoft')}
            disabled={isLoading || loading}
          >
            <Icon name="Building2" size={16} className="mr-2" />
            Microsoft
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-500 font-medium"
              disabled={isLoading || loading}
            >
              Create one now
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;