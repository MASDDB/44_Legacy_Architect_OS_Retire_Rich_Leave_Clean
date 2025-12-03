import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ResellerTable from './components/ResellerTable';
import BrandingControls from './components/BrandingControls';
import OnboardingWorkflow from './components/OnboardingWorkflow';
import SalesKitManager from './components/SalesKitManager';
import RevenueTracker from './components/RevenueTracker';
import RoyaltyConfiguration from './components/RoyaltyConfiguration';
import CurrentUserInfo from './components/CurrentUserInfo';

const WhiteLabelManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [selectedReseller, setSelectedReseller] = useState(null);

  // Mock reseller data
  const resellers = [
    {
      id: 1,
      company: 'Solar Solutions Pro',
      contact: 'Michael Rodriguez',
      email: 'michael@solarsolutionspro.com',
      domain: 'app.solarsolutionspro.com',
      status: 'active',
      monthlyRevenue: 28400,
      commission: 5680,
      commissionRate: 20,
      joinDate: '2024-08-15',
      branding: {
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        primaryColor: '#1E40AF',
        secondaryColor: '#6366F1',
        accentColor: '#F59E0B',
        customDomain: 'app.solarsolutionspro.com',
        companyName: 'Solar Solutions Pro',
        tagline: 'Powering Your Future',
        supportEmail: 'support@solarsolutionspro.com',
        supportPhone: '+1 (555) 123-4567'
      },
      royalty: {
        commissionType: 'percentage',
        commissionRate: 20,
        payoutFrequency: 'monthly',
        minimumPayout: 100,
        paymentMethod: 'stripe',
        stripeAccountId: 'acct_1234567890',
        autoPayouts: true,
        tieredCommission: false,
        bonusStructure: false
      }
    },
    {
      id: 2,
      company: 'Insurance Connect Hub',
      contact: 'Sarah Chen',
      email: 'sarah@insuranceconnect.com',
      domain: 'platform.insuranceconnect.com',
      status: 'active',
      monthlyRevenue: 22100,
      commission: 4420,
      commissionRate: 20,
      joinDate: '2024-09-02',
      branding: {
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        primaryColor: '#059669',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
        customDomain: 'platform.insuranceconnect.com',
        companyName: 'Insurance Connect Hub',
        tagline: 'Connecting You to Better Coverage',
        supportEmail: 'help@insuranceconnect.com',
        supportPhone: '+1 (555) 987-6543'
      }
    },
    {
      id: 3,
      company: 'Home Services Elite',
      contact: 'David Thompson',
      email: 'david@homeserviceselite.com',
      domain: 'app.homeserviceselite.com',
      status: 'pending',
      monthlyRevenue: 0,
      commission: 0,
      commissionRate: 20,
      joinDate: '2025-01-02',
      branding: {
        primaryColor: '#7C3AED',
        secondaryColor: '#8B5CF6',
        accentColor: '#F59E0B',
        customDomain: 'app.homeserviceselite.com',
        companyName: 'Home Services Elite',
        tagline: 'Excellence in Every Service',
        supportEmail: 'support@homeserviceselite.com'
      }
    },
    {
      id: 4,
      company: 'Financial Advisory Network',
      contact: 'Lisa Martinez',
      email: 'lisa@financialadvisorynet.com',
      domain: 'portal.financialadvisorynet.com',
      status: 'inactive',
      monthlyRevenue: 15200,
      commission: 3040,
      commissionRate: 20,
      joinDate: '2024-07-20',
      branding: {
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        primaryColor: '#DC2626',
        secondaryColor: '#EF4444',
        accentColor: '#F59E0B',
        customDomain: 'portal.financialadvisorynet.com',
        companyName: 'Financial Advisory Network',
        tagline: 'Your Financial Future Starts Here'
      }
    },
    {
      id: 5,
      company: 'Healthcare Reactivation Co',
      contact: 'Dr. James Wilson',
      email: 'james@healthcarereactivation.com',
      domain: 'system.healthcarereactivation.com',
      status: 'suspended',
      monthlyRevenue: 18900,
      commission: 3780,
      commissionRate: 20,
      joinDate: '2024-06-10',
      branding: {
        primaryColor: '#0D9488',
        secondaryColor: '#14B8A6',
        accentColor: '#F59E0B',
        customDomain: 'system.healthcarereactivation.com',
        companyName: 'Healthcare Reactivation Co',
        tagline: 'Reconnecting Patients with Care'
      }
    }
  ];

  const handleViewDetails = (reseller) => {
    setSelectedReseller(reseller);
    setActiveView('details');
  };

  const handleEditReseller = (reseller) => {
    setSelectedReseller(reseller);
    setActiveView('branding');
  };

  const handleToggleStatus = (reseller) => {
    console.log(`Toggling status for ${reseller?.company}`);
  };

  const handleStartOnboarding = () => {
    setActiveView('onboarding');
  };

  const handleBrandingSave = (brandingData) => {
    console.log('Saving branding data:', brandingData);
    setActiveView('overview');
  };

  const handleOnboardingComplete = (formData) => {
    console.log('Onboarding completed:', formData);
    setActiveView('overview');
  };

  const handleRoyaltySave = (config) => {
    console.log('Saving royalty config:', config);
    setActiveView('overview');
  };

  const getActiveResellers = () => resellers?.filter(r => r?.status === 'active')?.length;
  const getTotalRevenue = () => resellers?.reduce((sum, r) => sum + r?.monthlyRevenue, 0);
  const getTotalCommission = () => resellers?.reduce((sum, r) => sum + r?.commission, 0);
  const getAverageCommissionRate = () => {
    const activeResellers = resellers?.filter(r => r?.status === 'active');
    return activeResellers?.length > 0 
      ? (activeResellers?.reduce((sum, r) => sum + r?.commissionRate, 0) / activeResellers?.length)?.toFixed(1)
      : 0;
  };

  const renderContent = () => {
    switch (activeView) {
      case 'user-info':
        return (
          <CurrentUserInfo onClose={() => setActiveView('overview')} />
        );
      
      case 'branding':
        return (
          <BrandingControls
            selectedReseller={selectedReseller}
            onSave={handleBrandingSave}
            onCancel={() => setActiveView('overview')}
          />
        );
      
      case 'onboarding':
        return (
          <OnboardingWorkflow
            reseller={selectedReseller}
            onComplete={handleOnboardingComplete}
            onCancel={() => setActiveView('overview')}
          />
        );
      
      case 'sales-kit':
        return (
          <SalesKitManager
            selectedReseller={selectedReseller}
            onClose={() => setActiveView('overview')}
          />
        );
      
      case 'revenue':
        return (
          <RevenueTracker
            selectedReseller={selectedReseller}
          />
        );
      
      case 'royalty':
        return (
          <RoyaltyConfiguration
            selectedReseller={selectedReseller}
            onSave={handleRoyaltySave}
            onCancel={() => setActiveView('overview')}
          />
        );
      
      case 'details':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedReseller?.company}</h2>
                <p className="text-muted-foreground">Reseller Details & Management</p>
              </div>
              <Button variant="outline" onClick={() => setActiveView('overview')}>
                <Icon name="ArrowLeft" size={16} />
                Back to Overview
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveView('branding')}
                className="h-20 flex-col"
              >
                <Icon name="Palette" size={24} className="mb-2" />
                <span>Customize Branding</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveView('royalty')}
                className="h-20 flex-col"
              >
                <Icon name="CreditCard" size={24} className="mb-2" />
                <span>Royalty Settings</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveView('sales-kit')}
                className="h-20 flex-col"
              >
                <Icon name="FolderOpen" size={24} className="mb-2" />
                <span>Sales Kit</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveView('revenue')}
                className="h-20 flex-col"
              >
                <Icon name="BarChart3" size={24} className="mb-2" />
                <span>Revenue Tracking</span>
              </Button>
            </div>

            <RevenueTracker selectedReseller={selectedReseller} />
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon name="Building2" size={20} className="text-primary" />
                  </div>
                  <span className="text-sm text-success font-medium">+2 this month</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">{getActiveResellers()}</h3>
                <p className="text-sm text-muted-foreground">Active Resellers</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-success/10 rounded-full p-3">
                    <Icon name="DollarSign" size={20} className="text-success" />
                  </div>
                  <span className="text-sm text-primary font-medium">+18% MoM</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">${getTotalRevenue()?.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">Total Monthly Revenue</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-warning/10 rounded-full p-3">
                    <Icon name="TrendingUp" size={20} className="text-warning" />
                  </div>
                  <span className="text-sm text-muted-foreground">20% avg</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">${getTotalCommission()?.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">Total Commission</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-secondary/10 rounded-full p-3">
                    <Icon name="Percent" size={20} className="text-secondary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Standard</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">{getAverageCommissionRate()}%</h3>
                <p className="text-sm text-muted-foreground">Avg Commission Rate</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleStartOnboarding}>
                <Icon name="Plus" size={16} />
                Add New Reseller
              </Button>
              <Button variant="outline" onClick={() => setActiveView('sales-kit')}>
                <Icon name="FolderOpen" size={16} />
                Manage Sales Kit
              </Button>
              <Button variant="outline" onClick={() => setActiveView('user-info')}>
                <Icon name="User" size={16} />
                View Current User
              </Button>
              <Button variant="outline">
                <Icon name="Download" size={16} />
                Export Report
              </Button>
            </div>
            
            {/* Reseller Table */}
            <ResellerTable
              resellers={resellers}
              onViewDetails={handleViewDetails}
              onEditReseller={handleEditReseller}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      }`}>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">White Label Management</h1>
                  <p className="text-muted-foreground mt-2">
                    Manage reseller accounts, branding, and commission structures
                  </p>
                </div>
                {activeView === 'overview' && (
                  <div className="flex items-center space-x-2">
                    <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                      {getActiveResellers()} Active
                    </div>
                    <div className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium">
                      1 Pending
                    </div>
                  </div>
                )}
              </div>
            </div>

            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhiteLabelManagement;