import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NavigationHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' }
  ];

  const handleLogin = () => {
    navigate('/user-authentication');
  };

  const handleGetStarted = () => {
    navigate('/user-authentication');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href) => {
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Layers" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-tight">
                Legacy Architect OS
              </span>
              <span className="text-[10px] text-muted-foreground leading-none hidden sm:block">
                Exit-Ready AI OS for Service Businesses
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item?.href)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
              >
                {item?.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleLogin}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button
              variant="default"
              onClick={handleGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item?.href)}
                  className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {item?.label}
                </button>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2">
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="w-full justify-center"
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  onClick={handleGetStarted}
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="w-full justify-center"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;