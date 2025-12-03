import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AuthHeader = ({ activeTab }) => {
  const getHeaderContent = () => {
    if (activeTab === 'login') {
      return {
        title: 'Welcome Back',
        subtitle: 'Sign in to access your database reactivation dashboard',
        highlight: 'Reactivate dormant leads and boost your ROI'
      };
    } else {
      return {
        title: 'Start Your Free Trial',
        subtitle: 'Join thousands of businesses reactivating their databases',
        highlight: 'No credit card required • 14-day free trial'
      };
    }
  };

  const content = getHeaderContent();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <Link to="/marketing-landing-page" className="inline-flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Icon name="Database" size={24} color="white" />
        </div>
        <div className="text-left">
          <div className="text-lg font-bold text-foreground">Database Reactivation</div>
          <div className="text-xs text-muted-foreground">SaaS Platform</div>
        </div>
      </Link>
      {/* Header Content */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          {content?.title}
        </h1>
        <p className="text-muted-foreground">
          {content?.subtitle}
        </p>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
          <Icon name="Sparkles" size={14} />
          <span>{content?.highlight}</span>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">10K+</div>
          <div className="text-xs text-muted-foreground">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">2.5M+</div>
          <div className="text-xs text-muted-foreground">Leads Reactivated</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">85%</div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;