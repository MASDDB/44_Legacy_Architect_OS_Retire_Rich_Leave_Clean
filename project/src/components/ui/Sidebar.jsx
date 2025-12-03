import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    campaigns: true,
    tools: true,
    exitReadiness: false,
    platform: false,
    business: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const navigationSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      items: [
        {
          path: '/main-dashboard',
          label: 'Overview',
          icon: 'Home',
          description: 'Performance overview and quick actions'
        }
      ]
    },
    {
      id: 'campaigns',
      title: 'Campaign Management',
      icon: 'Target',
      items: [
        {
          path: '/lead-import-manager',
          label: 'Lead Import',
          icon: 'Upload',
          description: 'Import and manage lead databases'
        },
        {
          path: '/campaign-builder',
          label: 'Campaign Builder',
          icon: 'Zap',
          description: 'Create and configure reactivation campaigns'
        },
        {
          path: '/analytics-dashboard',
          label: 'Analytics',
          icon: 'BarChart3',
          description: 'Campaign performance and insights'
        }
      ]
    },
    {
      id: 'tools',
      title: 'Business Tools',
      icon: 'Calculator',
      items: [
        {
          path: '/roi-calculator',
          label: 'ROI Calculator',
          icon: 'Calculator',
          description: 'Calculate database reactivation ROI and booking potential'
        },
        {
          path: '/email-center',
          label: 'Email Center',
          icon: 'Mail',
          description: 'Manage email campaigns and templates'
        }
      ]
    },
    {
      id: 'exitReadiness',
      title: 'Exit Readiness',
      icon: 'TrendingUp',
      items: [
        {
          path: '/exit-readiness',
          label: 'Exit Dashboard',
          icon: 'TrendingUp',
          description: 'Exit readiness score and overview'
        },
        {
          path: '/exit-readiness/assessment',
          label: 'Exit Score',
          icon: 'Target',
          description: '3-minute exit readiness assessment'
        },
        {
          path: '/exit-readiness/data-room',
          label: 'Data Room',
          icon: 'FolderOpen',
          description: 'M&A data room (Folders 0-10)'
        },
        {
          path: '/exit-readiness/financials',
          label: 'Financials',
          icon: 'DollarSign',
          description: 'EBITDA calculator and financial analysis'
        },
        {
          path: '/exit-readiness/contracts',
          label: 'Contracts',
          icon: 'FileText',
          description: 'Contract index and change-of-control analysis'
        },
        {
          path: '/exit-readiness/rfis',
          label: 'RFIs',
          icon: 'MessageSquare',
          description: 'Request for Information tracker'
        },
        {
          path: '/exit-readiness/kpis',
          label: 'KPIs',
          icon: 'BarChart3',
          description: 'Key performance indicators dashboard'
        },
        {
          path: '/exit-readiness/working-capital',
          label: 'Working Capital',
          icon: 'Wallet',
          description: 'Working capital calculator'
        }
      ]
    },
    {
      id: 'platform',
      title: 'Platform Settings',
      icon: 'Settings',
      items: [
        {
          path: '/calendar-integration',
          label: 'Calendar Integration',
          icon: 'Calendar',
          description: 'Manage appointment scheduling'
        },
        {
          path: '/compliance-center',
          label: 'Compliance Center',
          icon: 'Shield',
          description: 'Data protection and compliance tools'
        }
      ]
    },
    {
      id: 'business',
      title: 'Business Management',
      icon: 'Building2',
      items: [
        {
          path: '/white-label-management',
          label: 'White Label',
          icon: 'Palette',
          description: 'Brand customization and reseller tools'
        }
      ]
    }
  ];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border z-100 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Navigation
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-6 w-6"
              >
                <Icon name="PanelLeftClose" size={14} />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-6 w-6"
              >
                <Icon name="PanelLeftOpen" size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigationSections?.map((section) => (
            <div key={section?.id} className="space-y-2">
              {/* Section Header */}
              <button
                onClick={() => !isCollapsed && toggleSection(section?.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title={isCollapsed ? section?.title : ''}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={section?.icon} size={18} className="text-muted-foreground" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium text-foreground">
                      {section?.title}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <Icon
                    name="ChevronDown"
                    size={16}
                    className={`text-muted-foreground transition-transform ${
                      expandedSections?.[section?.id] ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Section Items */}
              {(expandedSections?.[section?.id] || isCollapsed) && (
                <div className={`space-y-1 ${isCollapsed ? '' : 'ml-4'}`}>
                  {section?.items?.map((item) => (
                    <NavLink
                      key={item?.path}
                      to={item?.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 p-2 rounded-lg transition-colors group ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        } ${isCollapsed ? 'justify-center' : ''}`
                      }
                      title={isCollapsed ? item?.label : item?.description}
                    >
                      <Icon name={item?.icon} size={16} />
                      {!isCollapsed && (
                        <div className="flex-1">
                          <span className="text-sm font-medium block">
                            {item?.label}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Database Reactivation SaaS</p>
              <p>Version 2.1.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;