import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProblemSection = () => {
  const problems = [
    {
      icon: "AlertCircle",
      title: "Hidden Profit Leaks",
      description: "Missed calls, dead quotes, and uncontacted past customers quietly drain tens of thousands of dollars a year — with zero line item on your P&L to warn you."
    },
    {
      icon: "UserX",
      title: "Owner-Dependent Chaos",
      description: "If everything breaks when you step away for a week, a buyer won't pay you a premium. They'll discount the price… or walk."
    },
    {
      icon: "FileQuestion",
      title: "Messy Data & No Story",
      description: "Scattered invoices, half-updated CRMs, and no simple dashboard make it almost impossible to prove your true profitability or growth potential."
    },
    {
      icon: "MapOff",
      title: "No Clear Exit Plan",
      description: "You might know you want out in 3–5 years… but without a roadmap, every year looks the same — busy, tiring, and not much closer to a legacy you can hand off."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2070&q=80"
                alt="Service business owner reviewing operational challenges"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />

              {/* Overlay Stats */}
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-xl">
                <div className="text-xl font-bold">-47%</div>
                <div className="text-xs font-medium">Owner Time Freedom</div>
              </div>

              <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-xl">
                <div className="text-xl font-bold">$2.4M</div>
                <div className="text-xs font-medium">Estimated Exit Value at Risk</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Your Business Is Working Harder Than It Has To — And Buyers Can See It
              </h2>
              <div className="text-lg text-gray-700 space-y-3">
                <p>
                  Most service business owners are great at keeping trucks busy… and terrible at making the operation look good on paper. The calls get answered (most of the time), work gets done, but behind the scenes it's a tangle of spreadsheets, paper invoices, and tribal knowledge in your head.
                </p>
                <p>
                  That's fine — until you want to slow down, bring in a partner, or sell. Then every leak, every missing report, and every "I just know it" answer costs you real money at the negotiating table.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {problems?.map((problem, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon name={problem?.icon} size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {problem?.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {problem?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pain Point Callout */}
            <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">The Hidden Cost</h4>
                  <p className="text-gray-700 leading-relaxed">
                    For most owners, the biggest check they'll ever receive from their business is the one they get when they exit. But because their operation isn't "buyer-ready," they leave 20–50% of that check on the table.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
