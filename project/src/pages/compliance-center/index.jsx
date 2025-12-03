import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ComplianceStatusCard from './components/ComplianceStatusCard';
import OptOutManagement from './components/OptOutManagement';
import TemplateValidator from './components/TemplateValidator';
import AuditTrail from './components/AuditTrail';
import IndustryRules from './components/IndustryRules';
import ViolationAlerts from './components/ViolationAlerts';
import LegalTemplateLibrary from './components/LegalTemplateLibrary';
import Icon from '../../components/AppIcon';

const ComplianceCenter = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const complianceStats = [
    {
      title: 'GDPR Compliance',
      status: 'compliant',
      description: 'General Data Protection Regulation adherence',
      violations: 0,
      lastChecked: '2 hours ago'
    },
    {
      title: 'CAN-SPAM Compliance',
      status: 'warning',
      description: 'Email marketing compliance status',
      violations: 2,
      lastChecked: '1 hour ago'
    },
    {
      title: 'TCPA Compliance',
      status: 'violation',
      description: 'Telephone Consumer Protection Act status',
      violations: 1,
      lastChecked: '30 minutes ago'
    },
    {
      title: 'HIPAA Compliance',
      status: 'compliant',
      description: 'Healthcare data protection compliance',
      violations: 0,
      lastChecked: '4 hours ago'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'violations', name: 'Violations', icon: 'AlertTriangle' },
    { id: 'opt-out', name: 'Opt-Out Management', icon: 'UserX' },
    { id: 'templates', name: 'Template Validator', icon: 'FileCheck' },
    { id: 'library', name: 'Legal Library', icon: 'BookOpen' },
    { id: 'industry', name: 'Industry Rules', icon: 'Building2' },
    { id: 'audit', name: 'Audit Trail', icon: 'FileText' }
  ];

  const handleViewDetails = (title) => {
    console.log('Viewing details for:', title);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceStats?.map((stat, index) => (
                <ComplianceStatusCard
                  key={index}
                  title={stat?.title}
                  status={stat?.status}
                  description={stat?.description}
                  violations={stat?.violations}
                  lastChecked={stat?.lastChecked}
                  onViewDetails={() => handleViewDetails(stat?.title)}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('violations')}
                    className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="AlertTriangle" size={16} className="text-error" />
                      <span className="text-sm font-medium text-foreground">Review Active Violations</span>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="FileCheck" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">Validate Templates</span>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('opt-out')}
                    className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="UserX" size={16} className="text-warning" />
                      <span className="text-sm font-medium text-foreground">Manage Opt-Outs</span>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Compliance Score</span>
                    <span className="text-lg font-semibold text-warning">78%</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Active Campaigns</span>
                      <p className="font-medium text-foreground">24</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Compliant Campaigns</span>
                      <p className="font-medium text-success">21</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Violations</span>
                      <p className="font-medium text-error">3</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Opt-Out Requests</span>
                      <p className="font-medium text-foreground">147</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'violations':
        return <ViolationAlerts />;
      case 'opt-out':
        return <OptOutManagement />;
      case 'templates':
        return <TemplateValidator />;
      case 'library':
        return <LegalTemplateLibrary />;
      case 'industry':
        return <IndustryRules />;
      case 'audit':
        return <AuditTrail />;
      default:
        return null;
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
        sidebarCollapsed ? 'ml-16' : 'ml-60'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Compliance Center</h1>
                <p className="text-muted-foreground">
                  Ensure regulatory adherence across all outreach campaigns
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-3 py-1 bg-success/10 text-success rounded-full">
                  <Icon name="Shield" size={14} />
                  <span className="text-sm font-medium">Protected</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last scan: {new Date()?.toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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
          </div>
          
          {/* Tab Content */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplianceCenter;