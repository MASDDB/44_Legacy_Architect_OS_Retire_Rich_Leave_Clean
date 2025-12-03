import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: "Activity",
      title: "See Exactly Where the Leaks Are",
      description: "The AI + Exit Audit pinpoints missed revenue (calls, quotes, past customers) and tells you which missions to activate first."
    },
    {
      icon: "Target",
      title: "Turn On Missions That Match Your Goals",
      description: "Cash-Boost, AI Reception, Reviews & Reputation, Data Room — choose what fits, see the impact in days, not months."
    },
    {
      icon: "TrendingUp",
      title: "Generate Revenue Now",
      description: "Recover lost income from past customers, missed calls, and dead quotes while the system is already building your exit story."
    },
    {
      icon: "FileText",
      title: "Build a Buyer-Ready Data Room",
      description: "Clean documentation, structured reports, and a clear valuation story that investors and buyers trust."
    },
    {
      icon: "UserCheck",
      title: "Reduce Owner Dependence",
      description: "Automate the work you used to do manually so the business can run without you — the #1 thing buyers look for."
    },
    {
      icon: "Shield",
      title: "Stay Compliant & Confident",
      description: "TCPA-conscious outreach, opt-out handling, and plain-English dashboards mean you always know what's happening."
    },
    {
      icon: "Clock",
      title: "Launch in Minutes, See Results in Days",
      description: "Mission-based setup is simple. No ten-tool learning curve — just turn on what you need and watch the system work."
    },
    {
      icon: "BarChart3",
      title: "Track Real Exit-Readiness Progress",
      description: "Live dashboards show recovered revenue, reduced owner hours, and progress toward your target valuation."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="CheckCircle" size={16} />
            <span>Benefits & Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Service Business Owners Choose Legacy Architect OS
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join owners who want more than just busy days — they want a business that pays them now AND when they leave.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits?.map((benefit, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-elevated transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name={benefit?.icon} size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit?.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Build Your Legacy?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join service business owners who've reduced owner dependence, recovered hidden revenue, and are building an exit-ready asset.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Start with AI + Exit Audit</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Mission-by-mission pricing</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Built for service businesses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;