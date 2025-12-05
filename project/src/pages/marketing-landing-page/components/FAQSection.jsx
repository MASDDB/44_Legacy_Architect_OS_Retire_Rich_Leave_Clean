import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "What is the Hidden Profit + Exit Audit and how long does it take?",
      answer: `The Hidden Profit + Exit Audit is a 15-20 minute guided questionnaire that scores your AI Readiness and Exit Readiness (0-100), then shows exactly where revenue is leaking and which missions to turn on first. You get immediate results with personalized mission recommendations tailored to your business.`
    },
    {
      question: "Is this platform compliant with TCPA and other regulations?",
      answer: `Absolutely. Compliance is built into every mission. We automatically include opt-out mechanisms in all communications, maintain detailed consent records, and provide TCPA-conscious templates. Our legal team regularly updates compliance protocols so you're always protected.`
    },
    {
      question: "What types of service businesses work best with Legacy Architect OS?",
      answer: `We're built specifically for owner-operated service businesses in HVAC, plumbing, electrical, roofing, and similar trades. If you have 500+ past customers, miss calls regularly, or want to exit in 3-5 years, this platform will show immediate ROI.`
    },
    {
      question: "How do the missions work? Do I have to activate all of them?",
      answer: `No. Missions are modular and focused: Cash-Boost (past customer reactivation), AI Reception (missed calls), Reviews & Reputation, and Data Room (exit prep). You turn on what you need, when you need it. Most owners start with one mission and add more as they see results.`
    },
    {
      question: "Can I integrate this with my existing CRM or calendar?",
      answer: `Yes, we integrate with major CRM platforms (Salesforce, HubSpot, ServiceTitan, Housecall Pro) and calendars (Google Calendar, Outlook, Calendly). Our team handles the technical setup during onboarding to ensure seamless data flow.`
    },
    {
      question: "What's the difference between Guided AI Partnership and Legacy Architect OS Pro?",
      answer: `Guided AI Partnership means our team handles mission setup, campaign creation, and optimization for you. You just review results and take appointments. Legacy Architect OS Pro gives you full platform access to run missions yourself with training and ongoing support. Choose based on your available time.`
    },
    {
      question: "How does the Agency/Multi-Location License work?",
      answer: `The Agency License lets you offer Legacy Architect OS under your brand to clients, or run it across multiple business locations you own. You get a fully branded platform, client management tools, marketing materials, and revenue sharing opportunities.`
    },
    {
      question: "What if my customer database is old or messy?",
      answer: `That's exactly where we shine. The Hidden Profit + Exit Audit identifies which customers are most likely to respond regardless of how old the data is. We've successfully reactivated customer lists that were 3-5 years old. Our compliance engine ensures all outreach is legal and appropriate.`
    },
    {
      question: "Do you provide training and ongoing support?",
      answer: `Yes, all plans include comprehensive training. Guided AI Partnership clients get regular strategy calls. Legacy Architect OS Pro includes live onboarding sessions and ongoing email/chat support. Agency License partners receive extensive training, certification programs, and dedicated partner support.`
    },
    {
      question: "What's your money-back guarantee policy?",
      answer: `We offer a 30-day money-back guarantee on all plans. If you're not satisfied with the results or platform performance within 30 days, we'll refund your payment. For Guided AI Partnership clients, we guarantee measurable mission results within 90 days or continue working at no additional cost.`
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-warning/10 text-warning px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="HelpCircle" size={16} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Got Questions? We Have Answers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about building an exit-ready service business. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs?.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">
                  {faq?.question}
                </h3>
                <div className="flex-shrink-0">
                  <Icon
                    name={openFAQ === index ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className="text-muted-foreground"
                  />
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq?.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team of exit-readiness experts is here to help. Schedule a free consultation to discuss your business, exit timeline, and get personalized mission recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="Clock" size={16} />
                <span className="text-sm font-medium">Free 30-minute consultation</span>
              </div>
              <div className="flex items-center space-x-2 text-success">
                <Icon name="MessageCircle" size={16} />
                <span className="text-sm font-medium">Live chat support</span>
              </div>
              <div className="flex items-center space-x-2 text-success">
                <Icon name="Phone" size={16} />
                <span className="text-sm font-medium">Same-day response</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;