import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location?.pathname?.split('/')?.filter((x) => x);

  const breadcrumbMap = {
    'main-dashboard': { label: 'Dashboard', icon: 'Home' },
    'lead-import-manager': { label: 'Lead Import', icon: 'Upload' },
    'campaign-builder': { label: 'Campaign Builder', icon: 'Zap' },
    'analytics-dashboard': { label: 'Analytics', icon: 'BarChart3' },
    'calendar-integration': { label: 'Calendar Integration', icon: 'Calendar' },
    'compliance-center': { label: 'Compliance Center', icon: 'Shield' },
    'white-label-management': { label: 'White Label', icon: 'Palette' },
    'user-authentication': { label: 'Authentication', icon: 'Lock' },
    'marketing-landing-page': { label: 'Landing Page', icon: 'Globe' }
  };

  if (pathnames?.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        to="/main-dashboard"
        className="flex items-center space-x-1 hover:text-foreground transition-colors"
      >
        <Icon name="Home" size={14} />
        <span>Dashboard</span>
      </Link>
      {pathnames?.map((pathname, index) => {
        const routeTo = `/${pathnames?.slice(0, index + 1)?.join('/')}`;
        const isLast = index === pathnames?.length - 1;
        const breadcrumbInfo = breadcrumbMap?.[pathname];

        if (!breadcrumbInfo) {
          return null;
        }

        return (
          <React.Fragment key={pathname}>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
            {isLast ? (
              <div className="flex items-center space-x-1 text-foreground font-medium">
                <Icon name={breadcrumbInfo?.icon} size={14} />
                <span>{breadcrumbInfo?.label}</span>
              </div>
            ) : (
              <Link
                to={routeTo}
                className="flex items-center space-x-1 hover:text-foreground transition-colors"
              >
                <Icon name={breadcrumbInfo?.icon} size={14} />
                <span>{breadcrumbInfo?.label}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;