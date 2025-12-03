import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Play, CheckCircle2, ArrowLeft } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGetStarted = () => {
    navigate('/user-authentication');
  };

  const handleLearnMore = () => {
    setShowVideo(true);
    setIsPlaying(false);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  // Load Wistia scripts when modal opens
  useEffect(() => {
    if (showVideo) {
      // Load Wistia player script
      const playerScript = document.createElement('script');
      playerScript.src = 'https://fast.wistia.com/player.js';
      playerScript.async = true;
      document.body.appendChild(playerScript);

      // Load video-specific script
      const embedScript = document.createElement('script');
      embedScript.src = 'https://fast.wistia.com/embed/tjthiydebj.js';
      embedScript.async = true;
      embedScript.type = 'module';
      document.body.appendChild(embedScript);

      return () => {
        // Cleanup scripts when modal closes
        document.body.removeChild(playerScript);
        document.body.removeChild(embedScript);
      };
    }
  }, [showVideo]);

  const handleBackToHero = () => {
    setShowVideo(false);
  };

  const handlePlayAIDemo = () => {
    navigate('/ai-voice-demo');
  };

  return (
    <section id="hero-section" className="relative bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20 lg:py-32 overflow-hidden" style={{ marginTop: '-50px' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="Layers" size={16} />
              <span>AI + Exit-Readiness Platform for Service Businesses</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your Service Business Into a Legacy-Ready Asset{' '}
              <span className="text-blue-600">(Without Burning Out Before You Exit)</span>
            </h1>

            {/* Subheadline */}
            <div className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto lg:mx-0 space-y-3">
              <p>
                Right now, your business probably looks like this: phones ringing, jobs going out, money coming in… but everything still depends on you. When you finally want to sell or step back, buyers don't see a legacy — they see a job.
              </p>
              <p>
                Legacy Architect OS helps you plug profit leaks, clean up your back end, and prove your numbers with AI-powered audits and "missions" that turn chaos into a buyer-ready, wealth-building asset.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                variant="default"
                size="lg"
                onClick={handleGetStarted}
                iconName="ArrowRight"
                iconPosition="right"
                className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
                iconName="Play"
                iconPosition="left"
                className="px-8 py-4 text-lg border-2 border-gray-300"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="font-medium">Built for HVAC, Plumbing & Electrical</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="font-medium">GDPR & TCPA Conscious</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="font-medium">No Credit Card Required to Start</span>
              </div>
            </div>
          </div>

          {/* Right Column - AI Voice Agent + Dashboard Preview */}
          <div className="relative space-y-4">
            {/* AI Voice Agent Placeholder Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-lg p-5 border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar/Icon */}
                  <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Mic" size={24} color="white" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded mb-1">
                      AI Voice Agent Demo
                    </div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">Meet Your AI Receptionist</h4>
                    <p className="text-sm text-gray-700 leading-snug">
                      Hear how Legacy Architect OS answers, qualifies, and books jobs for you 24/7.
                    </p>
                  </div>
                </div>

                {/* Play Button */}
                <button
                  onClick={handlePlayAIDemo}
                  className="flex-shrink-0 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                  aria-label="Play AI demo call"
                >
                  <Play size={20} fill="white" color="white" className="ml-0.5" />
                </button>
              </div>
            </div>

            {/* Main Performance Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Exit-Ready Performance</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Icon name="TrendingUp" size={16} />
                    <span className="text-sm font-medium">On Track</span>
                  </div>
                </div>

                {/* Mock Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-700">-47%</div>
                    <div className="text-sm text-gray-600">Owner Dependence Reduced</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700">4</div>
                    <div className="text-sm text-gray-600">Missions Launched</div>
                  </div>
                </div>

                {/* Mock Chart Area */}
                <div className="h-32 bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    <Icon name="BarChart3" size={32} className="text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Real-Time Readiness Analytics</p>
                  </div>
                </div>

                {/* Mock Recent Activity */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 leading-relaxed">Owner reduced missed calls by 38% with AI reception mission</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 leading-relaxed">Launched Cash-Boost mission to 3,200 past customers</span>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 leading-relaxed">Data Room checklist reached 82% completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
              82% Exit Ready
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            {/* Back Button */}
            <button
              onClick={handleBackToHero}
              className="absolute -top-16 left-0 flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg bg-black bg-opacity-50 hover:bg-opacity-70"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Hero Section</span>
            </button>

            {/* Wistia Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl relative">
              <style>{`
                wistia-player[media-id='tjthiydebj']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/tjthiydebj/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 56.25%;
                }
              `}</style>
              <wistia-player
                media-id="tjthiydebj"
                aspect="1.7777777777777777"
                autoPlay={isPlaying ? 'true' : 'false'}
              ></wistia-player>

              {/* Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer" onClick={handlePlayVideo}>
                  <button
                    className="w-20 h-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl"
                    aria-label="Play video"
                  >
                    <Play size={32} fill="#2563eb" color="#2563eb" className="ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Close button (X) in top right */}
            <button
              onClick={handleBackToHero}
              className="absolute -top-16 right-0 w-12 h-12 flex items-center justify-center text-white hover:text-red-400 transition-colors duration-200 rounded-lg bg-black bg-opacity-50 hover:bg-opacity-70"
              aria-label="Close video"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
