import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'GDPR Compliant',
      description: 'Data protection certified'
    },
    {
      icon: 'CheckCircle',
      title: 'SOC 2 Type II',
      description: 'Security audited'
    }
  ];

  const complianceBadges = [
    'GDPR', 'CAN-SPAM', 'TCPA', 'CCPA'
  ];

  return (
    <div className="space-y-6">
      {/* Security Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex-shrink-0">
              <Icon name={badge?.icon} size={20} className="text-success" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{badge?.title}</div>
              <div className="text-xs text-muted-foreground">{badge?.description}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Compliance Badges */}
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-2">Compliant with:</div>
        <div className="flex justify-center space-x-4">
          {complianceBadges?.map((badge, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-xs font-medium text-muted-foreground rounded"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      {/* Privacy Links */}
      <div className="flex justify-center space-x-6 text-xs">
        <a href="#" className="text-muted-foreground hover:text-foreground">
          Privacy Policy
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground">
          Terms of Service
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground">
          Cookie Policy
        </a>
      </div>
      {/* Customer Support */}
      <div className="text-center p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="Headphones" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Need Help?</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Our support team is available 24/7 to assist you
        </p>
        <div className="flex justify-center space-x-4 text-xs">
          <a href="mailto:support@dbreactivation.com" className="text-primary hover:text-primary/80">
            support@dbreactivation.com
          </a>
          <span className="text-muted-foreground">|</span>
          <a href="tel:+1-800-555-0123" className="text-primary hover:text-primary/80">
            1-800-555-0123
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;