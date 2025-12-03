import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SolutionSection = () => {
  const solutionFeatures = [
    {
      icon: "Activity",
      title: "AI + Exit Audit",
      description: "In 15–20 minutes, our system scores your AI Readiness and Exit Readiness, then shows exactly where money is leaking and which missions to turn on first."
    },
    {
      icon: "Target",
      title: "Mission-Based Automation",
      description: "Turn on focused missions like Cash-Boost (past customer reactivation), 24/7 AI Reception (missed calls), Review & Reputation, and Buyer-Ready Data Room — without learning 10 different tools."
    },
    {
      icon: "TrendingUp",
      title: "Direct Revenue & Exit Value Impact",
      description: "See the impact of each mission in real numbers: recovered revenue, booked jobs, reduced owner dependence, and progress toward your target exit valuation."
    },
    {
      icon: "Shield",
      title: "Compliance-First, Owner-Friendly",
      description: "Built with TCPA-conscious outreach, opt-out handling, and plain-English dashboards so you and your team always know what's happening — and why."
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Icon name="Lightbulb" size={16} />
                <span>The Solution</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Turn Daily Operations Into an Exit-Ready, Wealth-Building Machine
              </h2>
              <p className="text-xl text-gray-700">
                Legacy Architect OS is your AI-powered control center for turning a busy, owner-dependent service business into a clean, documented, and data-driven asset. We start with an AI + Exit Audit, then activate targeted "missions" that plug leaks, boost cash flow, and build the buyer-ready story investors love.
              </p>
            </div>

            <div className="space-y-6">
              {solutionFeatures?.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name={feature?.icon} size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature?.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Success Callout */}
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="TrendingUp" size={20} className="text-green-600 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Proven Results</h4>
                  <p className="text-gray-700">
                    Owners using Legacy Architect OS report more booked jobs within weeks from existing leads, fewer missed calls, and a clearer path to an exit that doesn't depend on them showing up every day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
                alt="Business dashboard showing successful lead reactivation campaigns"
                className="rounded-2xl shadow-elevated w-full h-96 object-cover"
              />
              
              {/* Overlay Success Stats */}
              <div className="absolute top-4 left-4 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-lg">
                <div className="text-lg font-bold">+247%</div>
                <div className="text-xs">Average ROI</div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                <div className="text-lg font-bold">89%</div>
                <div className="text-xs">Response Rate</div>
              </div>

              {/* Floating Process Steps */}
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span className="text-sm font-medium">Upload Database</span>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-sm font-medium">AI Analyzes Leads</span>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-sm font-medium">Automated Outreach</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;