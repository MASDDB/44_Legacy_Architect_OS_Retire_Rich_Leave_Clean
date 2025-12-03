import React, { useState } from 'react';
import { Calendar, ExternalLink, MessageSquare } from 'lucide-react';
import Button from '../../../components/ui/Button';

const CalBookingWidget = ({ roiData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(num);
  };

  const handleBookConsultation = () => {
    setIsLoading(true);
    
    // Simulate booking widget loading
    setTimeout(() => {
      // In a real implementation, this would open Cal.com booking widget
      // For now, we'll open a new window/tab to a booking link
      const bookingParams = new URLSearchParams({
        roi: roiData?.roiPercentage?.toFixed(1) || '0',
        revenue: roiData?.potentialRevenue || 0,
        customers: roiData?.reactivatedCustomers || 0
      });
      
      // Replace with actual Cal.com booking link
      const bookingUrl = `https://cal.com/database-reactivation-consultation?${bookingParams?.toString()}`;
      window.open(bookingUrl, '_blank');
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg text-white p-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
        <p className="text-blue-100 text-sm">
          Your analysis shows potential for {formatCurrency(roiData?.netROI || 0)} in net ROI. 
          Let's discuss your database reactivation strategy.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold">{formatCurrency(roiData?.potentialRevenue || 0)}</div>
          <div className="text-xs text-blue-200">Potential Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{(roiData?.roiPercentage || 0)?.toFixed(1)}%</div>
          <div className="text-xs text-blue-200">ROI</div>
        </div>
      </div>

      {/* Booking Button */}
      <Button
        onClick={handleBookConsultation}
        loading={isLoading}
        className="w-full bg-white text-blue-600 hover:bg-gray-50 font-semibold py-3 mb-4"
        size="lg"
      >
        {!isLoading && <Calendar className="w-5 h-5 mr-2" />}
        Book Strategy Consultation
      </Button>

      {/* Fallback Link */}
      <div className="text-center">
        <a
          href="https://cal.com/database-reactivation-consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-200 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Direct booking link
        </a>
      </div>

      {/* Benefits List */}
      <div className="mt-6 pt-4 border-t border-blue-500">
        <h4 className="font-medium mb-3 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          What you'll get:
        </h4>
        <ul className="text-sm space-y-2 text-blue-100">
          <li>• Custom reactivation strategy for your database</li>
          <li>• Multi-channel campaign recommendations</li>
          <li>• Implementation timeline and milestones</li>
          <li>• ROI optimization techniques</li>
        </ul>
      </div>

      {/* Embedded Cal.com Widget Container */}
      <div id="cal-booking-widget" className="hidden mt-4">
        {/* Cal.com widget would be embedded here in a real implementation */}
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-600 text-sm text-center">
            Cal.com booking widget would appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalBookingWidget;