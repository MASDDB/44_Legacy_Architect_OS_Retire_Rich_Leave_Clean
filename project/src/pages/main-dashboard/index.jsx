import React, { useState, useEffect, useMemo } from 'react';
import { Users, Target, Calendar, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import MetricCard from './components/MetricCard';
import CampaignStatusPanel from './components/CampaignStatusPanel';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import UpcomingAppointments from './components/UpcomingAppointments';
import HotLeads from './components/HotLeads';
import ComplianceStatus from './components/ComplianceStatus';
import PerformanceChart from './components/PerformanceChart';
import SuperAdminPanel from './components/SuperAdminPanel';
import { useAnalytics, useLeads, useAppointments } from '../../hooks/useSupabaseData';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';

const MainDashboard = () => {
  const { user, userProfile, signOut } = useAuth();
  const { analytics, loading: analyticsLoading } = useAnalytics();
  const { leads, loading: leadsLoading, error: leadsError } = useLeads();
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const [dashboardError, setDashboardError] = useState(null);

  // Check if user is super admin
  const isSuperAdmin = adminService?.isSuperAdmin(userProfile);

  // Enhanced error handling
  useEffect(() => {
    if (leadsError || appointmentsError) {
      console.error('Dashboard data loading errors:', { leadsError, appointmentsError });
      setDashboardError('Unable to load dashboard data. Please try refreshing the page.');
    }
  }, [leadsError, appointmentsError]);

  // Filter data for current user using optional chaining with better null handling
  const userLeads = React.useMemo(() => {
    if (!leads || !user?.id) return [];
    return leads?.filter(lead => lead?.assigned_to === user?.id) || [];
  }, [leads, user?.id]);

  const userAppointments = React.useMemo(() => {
    if (!appointments || !user?.id) return [];
    return appointments?.filter(appointment => 
      appointment?.assigned_to === user?.id && 
      new Date(appointment?.scheduled_at) >= new Date()
    ) || [];
  }, [appointments, user?.id]);

  // Get hot leads (high priority, recent activity)
  const hotLeads = React.useMemo(() => {
    return userLeads?.filter(lead => 
      lead?.priority === 'high' || lead?.priority === 'urgent'
    )?.slice(0, 5) || [];
  }, [userLeads]);

  const isLoading = analyticsLoading || leadsLoading || appointmentsLoading;

  // Handle sign out with proper error handling
  const handleSignOut = async () => {
    try {
      await signOut();
      // Force redirect after successful signout
      window.location.href = '/user-authentication';
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if signOut fails, redirect to login
      window.location.href = '/user-authentication';
    }
  };

  // Enhanced loading state with user profile check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your CRM dashboard...</p>
          {!userProfile && (
            <p className="text-sm text-gray-500 mt-2">Setting up your profile...</p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar onToggle={() => {}} />
          <main className="flex-1 ml-64 p-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center max-w-md">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Loading Error</h2>
                <p className="text-gray-600 mb-4">{dashboardError}</p>
                <button 
                  onClick={() => window.location?.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check if user has no data - show welcome state
  const hasNoData = !userLeads?.length && !userAppointments?.length && !analytics?.totalLeads;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar onToggle={() => {}} />
        
        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {userProfile?.full_name || user?.email || 'User'}!
                {isSuperAdmin && (
                  <span className="ml-3 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full font-medium">
                    Super Admin
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                {hasNoData 
                  ? "Let's get your CRM set up with some initial data" : "Here's what's happening with your CRM today"}
              </p>
            </div>
          </div>

          {/* Super Admin Panel - Only show for super admins */}
          {isSuperAdmin && (
            <div className="mb-8" data-admin-panel>
              <SuperAdminPanel />
            </div>
          )}

          {/* No Data State */}
          {hasNoData ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to your CRM Dashboard!</h3>
                <p className="text-gray-600 mb-6">
                  It looks like you're just getting started. Let's add some data to see your dashboard come to life.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.href = '/lead-import-manager'}
                    className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Import Leads
                  </button>
                  <button 
                    onClick={() => window.location.href = '/campaign-builder'}
                    className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Target className="h-5 w-5 mr-2" />
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Total Leads"
                  value={userLeads?.length || 0}
                  change="12"
                  icon={Users}
                  trend="up"
                />
                <MetricCard
                  title="Active Campaigns" 
                  value={analytics?.activeCampaigns || 0}
                  change="8"
                  icon={Target}
                  trend="up"
                />
                <MetricCard
                  title="Upcoming Appointments"
                  value={userAppointments?.length || 0}
                  change="5"
                  icon={Calendar}
                  trend="up"
                />
                <MetricCard
                  title="Conversion Rate"
                  value={`${analytics?.conversionRate || 0}%`}
                  change="3"
                  icon={TrendingUp}
                  trend="up"
                />
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Performance Chart */}
                <div className="xl:col-span-2">
                  <PerformanceChart data={analytics || {}} />
                </div>

                {/* Quick Actions */}
                <QuickActions />

                {/* Hot Leads */}
                <HotLeads leads={hotLeads} />

                {/* Upcoming Appointments */}
                <UpcomingAppointments appointments={userAppointments?.slice(0, 5) || []} />

                {/* Campaign Status */}
                <CampaignStatusPanel campaigns={analytics?.campaigns || []} />

                {/* Activity Feed */}
                <ActivityFeed activities={analytics?.activities || []} />

                {/* Compliance Status */}
                <ComplianceStatus complianceData={analytics?.compliance || {}} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;