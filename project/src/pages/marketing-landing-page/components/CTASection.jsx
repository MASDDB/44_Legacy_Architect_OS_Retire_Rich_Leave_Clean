import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/user-authentication');
  };

  const handleScheduleDemo = () => {
    // Demo scheduling functionality would be implemented here
    console.log('Schedule demo clicked');
  };

  const stats = [
    {
      number: "500+",
      label: "Service Businesses Using",
      icon: "Building2"
    },
    {
      number: "$12M+",
      label: "Revenue Recovered",
      icon: "DollarSign"
    },
    {
      number: "47%",
      label: "Avg. Owner Dependence Reduction",
      icon: "TrendingUp"
    },
    {
      number: "82%",
      label: "Avg. Exit-Readiness Score",
      icon: "Target"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Icon name="Rocket" size={16} />
            <span>Ready to Transform Your Business?</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Stop Building a Job.
            <span className="block text-blue-600">Start Building a Legacy.</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join service business owners who've stopped working 60-hour weeks and started building an asset they can sell. Your exit starts with knowing where the leaks are — let our Hidden Profit + Exit Audit show you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="default"
              size="xl"
              onClick={handleGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className="px-8 py-4 text-lg"
            >
              Start Your Free Trial
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={handleScheduleDemo}
              iconName="Calendar"
              iconPosition="left"
              className="px-8 py-4 text-lg"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground mb-16">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>Start with Hidden Profit + Exit Audit</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span>Mission-by-mission pricing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CreditCard" size={16} className="text-success" />
              <span>Built for service businesses</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-success" />
              <span>Exit-ready in 12-24 months</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={stat?.icon} size={24} className="text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stat?.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Final Urgency Section */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-warning mb-4">
            <Icon name="Clock" size={20} />
            <span className="font-semibold">Limited Time Offer</span>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-4">
            Get Started Today and Receive the Exit-Readiness Accelerator Package
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-green-600">
              <Icon name="Activity" size={16} />
              <span className="text-sm">Free Hidden Profit + Exit Audit ($500 value)</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Icon name="FileText" size={16} />
              <span className="text-sm">Exit-readiness roadmap ($400 value)</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Icon name="Users" size={16} />
              <span className="text-sm">1-on-1 mission strategy call ($1,200 value)</span>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            This exclusive accelerator package is only available for the first 50 service business owners this month. Don't wait another year to start building your exit.
          </p>

          <Button
            variant="default"
            size="lg"
            onClick={handleGetStarted}
            iconName="Zap"
            iconPosition="left"
            className="px-8 py-4"
          >
            Claim Your Bonus Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;