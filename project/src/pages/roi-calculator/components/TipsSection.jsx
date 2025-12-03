import React from 'react';
import { Lightbulb, Target, Users, BarChart3, MessageSquare } from 'lucide-react';

const TipsSection = () => {
  const tips = [
    {
      icon: Target,
      title: 'Segment Your Database',
      description: 'Group customers by engagement level, purchase history, and demographics for better targeting.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: MessageSquare,
      title: 'Multi-Channel Approach',
      description: 'Combine email, SMS, social media, and direct mail for maximum reach and engagement.',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: BarChart3,
      title: 'A/B Test Everything',
      description: 'Test subject lines, messages, timing, and offers to optimize your reactivation rates.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Progressive Engagement',
      description: 'Start with high-value offers for recent customers, then adjust for older segments.',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-soft border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Optimization Tips</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips?.map((tip, index) => {
          const IconComponent = tip?.icon;
          return (
            <div
              key={index}
              className={`${tip?.bg} rounded-lg p-4 border border-gray-100`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent className={`h-5 w-5 ${tip?.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {tip?.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {tip?.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Additional Tips */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Pro Tips for Better ROI:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Clean your database first - remove bounced emails and inactive numbers</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Start with a compelling "we miss you" message and special offer</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Follow up 3-5 times with different messages and channels</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Track engagement metrics and adjust your approach accordingly</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Create urgency with limited-time offers and scarcity messaging</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;