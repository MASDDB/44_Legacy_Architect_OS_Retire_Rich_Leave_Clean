import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthHeader from './components/AuthHeader';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TrustSignals from './components/TrustSignals';

const UserAuthentication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, initialized } = useAuth();
  const requestedTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(requestedTab === 'register' ? 'register' : 'login');

  // Redirect if already authenticated
  useEffect(() => {
    // Only redirect if auth is initialized and user exists
    if (initialized && user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/main-dashboard');
    }
  }, [user, initialized, navigate]);

  useEffect(() => {
    if (requestedTab === 'register' || requestedTab === 'login') {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  // Show loading while auth is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-lg">
            <AuthHeader activeTab={activeTab} />
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <AuthTabs 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />
              
              {activeTab === 'login' ? (
                <LoginForm onSwitchToRegister={handleSwitchToRegister} />
              ) : (
                <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
              )}
            </div>
            
            <div className="mt-8">
              <TrustSignals />
            </div>
          </div>
        </div>

        {/* Right Side - Feature Showcase (Desktop Only) */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-600 p-12 items-center justify-center">
          <div className="max-w-md text-center text-white">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Transform Dormant Leads into Revenue
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Our AI-powered platform reactivates your existing database through personalized multi-channel campaigns, delivering up to 300% ROI improvement.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">AI-powered lead scoring and segmentation</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">Multi-channel campaigns (Voice, SMS, Email)</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">Automated appointment booking</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90">Full compliance with GDPR, CAN-SPAM, TCPA</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold mb-2">85% Success Rate</div>
              <div className="text-white/80">Average lead reactivation across all industries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuthentication;
