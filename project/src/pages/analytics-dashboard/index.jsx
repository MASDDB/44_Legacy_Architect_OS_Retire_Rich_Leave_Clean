import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import MetricsOverview from './components/MetricsOverview';
import CampaignPerformanceChart from './components/CampaignPerformanceChart';
import LeadLifecycleTracker from './components/LeadLifecycleTracker';
import CampaignComparisonTable from './components/CampaignComparisonTable';
import RevenueAnalytics from './components/RevenueAnalytics';
import AppointmentMetrics from './components/AppointmentMetrics';
import ExportControls from './components/ExportControls';
import RealTimeNotifications from './components/RealTimeNotifications';
import AIPersonalizationAnalytics from './components/AIPersonalizationAnalytics';

const AnalyticsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'BarChart3' },
    { id: 'campaigns', name: 'Campaigns', icon: 'Target' },
    { id: 'leads', name: 'Lead Analytics', icon: 'TrendingUp' },
    { id: 'revenue', name: 'Revenue', icon: 'DollarSign' },
    { id: 'ai-personalization', name: 'AI Personalization', icon: 'Brain' },
    { id: 'export', name: 'Export', icon: 'Download' },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleExport = (exportConfig) => {
    console.log('Exporting analytics data:', exportConfig);
    // Handle export logic here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <MetricsOverview timeRange={timeRange} onTimeRangeChange={setTimeRange} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <CampaignPerformanceChart />
              </div>
              <div>
                <RealTimeNotifications />
              </div>
            </div>
            <LeadLifecycleTracker />
          </div>
        );
      case 'campaigns':
        return (
          <div className="space-y-8">
            <CampaignPerformanceChart />
            <CampaignComparisonTable />
            <LeadLifecycleTracker />
          </div>
        );
      case 'leads':
        return <LeadLifecycleTracker />;
      case 'revenue':
        return <RevenueAnalytics />;
      case 'appointments':
        return <AppointmentMetrics />;
      case 'ai-personalization':
        return <AIPersonalizationAnalytics />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-60'
      } pt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive campaign performance tracking and ROI analysis
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={refreshing}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh Data
              </Button>
              <ExportControls onExport={handleExport} />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in-50 duration-200">
            {renderTabContent()}
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-12 p-6 bg-card rounded-lg border border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Common tasks and navigation shortcuts
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" iconName="Upload">
                  Import New Leads
                </Button>
                <Button variant="outline" size="sm" iconName="Zap">
                  Create Campaign
                </Button>
                <Button variant="outline" size="sm" iconName="Calendar">
                  Schedule Review
                </Button>
                <Button variant="outline" size="sm" iconName="Settings">
                  Configure Alerts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;