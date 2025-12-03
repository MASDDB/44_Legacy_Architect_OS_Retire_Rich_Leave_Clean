import React from 'react';

import Icon from '../../../components/AppIcon';

const FooterSection = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Integrations', href: '#integrations' },
      { label: 'API Documentation', href: '#api' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press Kit', href: '#press' },
      { label: 'Contact', href: '#contact' }
    ],
    resources: [
      { label: 'Help Center', href: '#help' },
      { label: 'Blog', href: '#blog' },
      { label: 'Case Studies', href: '#cases' },
      { label: 'Webinars', href: '#webinars' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'GDPR Compliance', href: '#gdpr' },
      { label: 'Security', href: '#security' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#twitter' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#linkedin' },
    { name: 'Facebook', icon: 'Facebook', href: '#facebook' },
    { name: 'YouTube', icon: 'Youtube', href: '#youtube' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Database" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Database Reactivation
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transform dormant leads into booked appointments with AI-powered multi-channel outreach. Stop spending on new leads when your database holds untapped revenue potential.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} />
                <span>support@databasereactivation.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} />
                <span>1-800-REACTIVATE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span>Austin, TX 78701</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks?.product?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks?.company?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks?.resources?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-muted/30 rounded-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Stay Updated with Database Reactivation Tips
              </h3>
              <p className="text-sm text-muted-foreground">
                Get weekly insights, case studies, and best practices delivered to your inbox.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Database Reactivation SaaS. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
            {footerLinks?.legal?.map((link, index) => (
              <a
                key={index}
                href={link?.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link?.label}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks?.map((social, index) => (
              <a
                key={index}
                href={social?.href}
                className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label={social?.name}
              >
                <Icon name={social?.icon} size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap justify-center items-center space-x-8 mt-8 pt-8 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Lock" size={16} className="text-success" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span>CAN-SPAM Certified</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Award" size={16} className="text-success" />
            <span>TCPA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;