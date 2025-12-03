import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { adminService } from '../../../services/adminService';
import {
  Activity,
  TrendingUp,
  Zap,
  Upload,
  BarChart3,
  Calendar,
  Shield,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Activity,
  TrendingUp,
  Zap,
  Upload,
  BarChart3,
  Calendar,
  Shield
};

const QuickActions = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const isSuperAdmin = adminService?.isSuperAdmin(userProfile);

  const quickActions = [
    {
      title: 'Run AI + Exit Audit',
      description: 'See where the leaks are, how buyer-ready you are, and which missions to turn on first',
      icon: 'Activity',
      color: 'blue',
      path: '/ai-audit',
      featured: true
    },
    {
      title: 'Run Cash-Boost Mission',
      description: 'Generate revenue from past customers',
      icon: 'TrendingUp',
      color: 'green',
      path: '/cash-boost'
    },
    {
      title: 'Create Campaign',
      description: 'Build a new reactivation campaign',
      icon: 'Zap',
      color: 'purple',
      path: '/campaign-builder'
    },
    {
      title: 'Import Leads',
      description: 'Upload new lead database',
      icon: 'Upload',
      color: 'indigo',
      path: '/lead-import-manager'
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: 'BarChart3',
      color: 'teal',
      path: '/analytics-dashboard'
    },
    {
      title: 'Calendar Setup',
      description: 'Configure appointment booking',
      icon: 'Calendar',
      color: 'orange',
      path: '/calendar-integration'
    }
  ];

  if (isSuperAdmin) {
    quickActions.push({
      title: 'System Admin',
      description: 'Manage users and system settings',
      icon: 'Shield',
      color: 'red',
      path: '#admin',
      isAdmin: true
    });
  }

  const handleActionClick = (action) => {
    if (action.isAdmin) {
      const adminPanel = document.querySelector('[data-admin-panel]');
      if (adminPanel) {
        adminPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate(action.path);
    }
  };

  const getColorClasses = (color, isFeatured, isAdmin) => {
    if (isAdmin) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200 hover:border-red-300',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        titleColor: 'text-red-900',
        descColor: 'text-red-700'
      };
    }

    if (isFeatured) {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-300 hover:border-blue-400',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        titleColor: 'text-gray-900',
        descColor: 'text-gray-700'
      };
    }

    const colorMap = {
      blue: { iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      green: { iconBg: 'bg-green-100', iconColor: 'text-green-600' },
      purple: { iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
      indigo: { iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
      teal: { iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
      orange: { iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
      red: { iconBg: 'bg-red-100', iconColor: 'text-red-600' }
    };

    return {
      bg: 'bg-white',
      border: 'border-gray-200 hover:border-gray-300',
      iconBg: colorMap[color]?.iconBg || 'bg-gray-100',
      iconColor: colorMap[color]?.iconColor || 'text-gray-600',
      titleColor: 'text-gray-900',
      descColor: 'text-gray-600'
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const IconComponent = iconMap[action.icon];
          const colors = getColorClasses(action.color, action.featured, action.isAdmin);

          return (
            <button
              key={action.title}
              onClick={() => handleActionClick(action)}
              className={`
                ${colors.bg} ${colors.border}
                border-2 rounded-lg p-5
                text-left transition-all duration-200
                hover:shadow-md hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                group relative
              `}
            >
              {action.featured && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className={`${colors.iconBg} ${colors.iconColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {IconComponent && <IconComponent size={24} />}
                </div>

                <h3 className={`${colors.titleColor} font-semibold text-base mb-2 pr-16`}>
                  {action.title}
                </h3>

                <p className={`${colors.descColor} text-sm leading-relaxed mb-3 flex-grow`}>
                  {action.description}
                </p>

                <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  <span>Get started</span>
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
