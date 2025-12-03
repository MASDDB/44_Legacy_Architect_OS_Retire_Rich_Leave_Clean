import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Tom Reynolds",
      title: "Owner, Reynolds HVAC",
      company: "HVAC Services - $2.3M valuation",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: `I was stuck in the business 60 hours a week. The Exit Audit showed me exactly where I was bleeding money. We turned on the Cash-Boost mission and recovered $127K from old customers in 90 days. Now I work 30 hours a week and the business is worth 40% more because it doesn't depend on me.`,
      results: {
        metric: "$127K",
        description: "Revenue Recovered",
        timeframe: "90 Days"
      },
      rating: 5
    },
    {
      id: 2,
      name: "Maria Santos",
      title: "Owner, Santos Plumbing & Drain",
      company: "Plumbing Services - Exit in 18 months",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      content: `I had no idea how un-sellable my business was until Legacy Architect OS scored my Exit Readiness at 34%. The Data Room mission helped me organize 8 years of chaos into clean reports. Now buyers see a real asset, not just a job I created for myself. On track to exit next year at 4.2x EBITDA.`,
      results: {
        metric: "34% → 78%",
        description: "Exit Readiness Score",
        timeframe: "8 Months"
      },
      rating: 5
    },
    {
      id: 3,
      name: "Jake Morrison",
      title: "Founder, Morrison Electric",
      company: "Electrical Contractor - Pre-exit prep",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      content: `The AI Reception mission was a game-changer. We were missing 40% of incoming calls. Now our AI answers 24/7, qualifies leads, and books them directly into our calendar. We picked up 18 jobs in the first month that we would have lost. My bookkeeper said it's like hiring 2 CSRs for free.`,
      results: {
        metric: "18",
        description: "Jobs Booked (Previously Missed)",
        timeframe: "First Month"
      },
      rating: 5
    },
    {
      id: 4,
      name: "Linda Park",
      title: "Co-Owner, Park Family Heating & Cooling",
      company: "HVAC - Buyer negotiations in progress",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content: `We wanted to retire but the business wasn't worth what we thought. Legacy Architect OS showed us the leaks and helped us fix them. Nine months later, we have clean books, documented processes, and three offers on the table. The buyer said our Data Room was the best they've seen in our industry.`,
      results: {
        metric: "3 Offers",
        description: "Competitive Buyer Interest",
        timeframe: "9 Months"
      },
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  };

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon name="Star" size={16} />
            <span>Customer Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Owners Who Built Exit-Ready Businesses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how service business owners reduced owner dependence, recovered revenue, and built assets buyers actually want.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative">
          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 shadow-elevated">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Testimonial Content */}
              <div className="lg:col-span-2">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonials?.[currentTestimonial]?.rating)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={20} className="text-warning fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                  "{testimonials?.[currentTestimonial]?.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <Image
                    src={testimonials?.[currentTestimonial]?.avatar}
                    alt={testimonials?.[currentTestimonial]?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonials?.[currentTestimonial]?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials?.[currentTestimonial]?.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials?.[currentTestimonial]?.company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Card */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-xl p-6 border border-success/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      {testimonials?.[currentTestimonial]?.results?.metric}
                    </div>
                    <div className="text-sm font-medium text-foreground mb-1">
                      {testimonials?.[currentTestimonial]?.results?.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      in {testimonials?.[currentTestimonial]?.results?.timeframe}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentTestimonial ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {testimonials?.map((testimonial, index) => (
            <div
              key={testimonial?.id}
              className={`bg-card border border-border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                index === currentTestimonial ? 'ring-2 ring-primary' : 'hover:shadow-elevated'
              }`}
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {testimonial?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial?.company}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-3">
                "{testimonial?.content?.substring(0, 100)}..."
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;