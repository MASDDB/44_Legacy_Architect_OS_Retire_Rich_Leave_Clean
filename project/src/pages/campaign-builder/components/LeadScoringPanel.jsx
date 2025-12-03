import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import LeadScoringService from '../../../services/leadScoringService';
import { cn } from '../../../utils/cn';

const LeadScoringPanel = ({ onLeadSelected, onClose, isOpen }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('hot');
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Load leads by category
  const loadLeadsByCategory = async (category) => {
    try {
      setLoading(true);
      const result = await LeadScoringService?.getLeadsByCategory(category, {
        limit: 20,
        sortBy: 'overall_score',
        sortOrder: 'desc'
      });
      setLeads(result?.leads || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Load AI recommendations
  const loadAIRecommendations = async () => {
    try {
      const recommendations = await LeadScoringService?.getAILeadRecommendations(5);
      setAiRecommendations(recommendations || []);
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      setAiRecommendations([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLeadsByCategory(activeCategory);
      if (showRecommendations) {
        loadAIRecommendations();
      }
    }
  }, [isOpen, activeCategory, showRecommendations]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleLeadSelect = (lead) => {
    onLeadSelected?.(lead);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 30) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'hot': return { icon: 'Flame', color: 'text-red-500' };
      case 'warm': return { icon: 'ThermometerSun', color: 'text-orange-500' };
      case 'cold': return { icon: 'Snowflake', color: 'text-blue-500' };
      default: return { icon: 'HelpCircle', color: 'text-gray-500' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI-Powered Lead Scoring</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select leads for targeted campaigns based on advanced scoring algorithms
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            {/* AI Recommendations Toggle */}
            <div className="mb-6">
              <Button
                variant={showRecommendations ? 'default' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => setShowRecommendations(!showRecommendations)}
              >
                <Icon name="Brain" size={16} className="mr-2" />
                AI Recommendations
              </Button>
            </div>

            {/* Category Filters */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Score Categories</h3>
              {[
                { key: 'hot', label: 'Hot Leads', count: '80-100' },
                { key: 'warm', label: 'Warm Leads', count: '60-79' },
                { key: 'cold', label: 'Cold Leads', count: '30-59' },
                { key: 'unknown', label: 'Unscored', count: '0-29' }
              ]?.map(category => {
                const { icon, color } = getCategoryIcon(category?.key);
                return (
                  <button
                    key={category?.key}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                      activeCategory === category?.key
                        ? 'bg-white border border-primary/20 text-primary' :'text-gray-600 hover:bg-white hover:text-gray-900'
                    )}
                    onClick={() => handleCategoryChange(category?.key)}
                  >
                    <Icon name={icon} size={16} className={color} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{category?.label}</div>
                      <div className="text-xs text-gray-500">Score: {category?.count}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* AI Recommendations Section */}
            {showRecommendations && aiRecommendations?.length > 0 && (
              <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Brain" size={18} className="text-purple-600" />
                  <h3 className="text-sm font-semibold text-purple-900">AI Priority Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {aiRecommendations?.slice(0, 3)?.map((recommendation) => (
                    <div
                      key={recommendation?.lead_id}
                      className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-purple-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {recommendation?.lead?.first_name} {recommendation?.lead?.last_name}
                          </span>
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            getScoreColor(recommendation?.overall_score)
                          )}>
                            {recommendation?.overall_score}/100
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {recommendation?.ai_priority_reason}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeadSelect(recommendation)}
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leads List */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : leads?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No leads found</h3>
                    <p className="text-sm text-gray-500">
                      No leads in the {activeCategory} category. Try selecting a different category.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leads?.map((leadScore) => (
                      <div
                        key={leadScore?.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {leadScore?.lead?.first_name} {leadScore?.lead?.last_name}
                              </h4>
                              <span className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                getScoreColor(leadScore?.overall_score)
                              )}>
                                {leadScore?.overall_score}/100
                              </span>
                              <span className="text-xs text-gray-500">
                                {leadScore?.category?.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="text-xs text-gray-600 mb-2">
                              <span>{leadScore?.lead?.job_title}</span>
                              {leadScore?.lead?.company?.name && (
                                <span> at {leadScore?.lead?.company?.name}</span>
                              )}
                            </div>

                            {/* Score Breakdown */}
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Behavior:</span>
                                <span className="font-medium">{leadScore?.behavioral_score}/40</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Engagement:</span>
                                <span className="font-medium">{leadScore?.engagement_score}/30</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Fit:</span>
                                <span className="font-medium">{leadScore?.fit_score}/30</span>
                              </div>
                            </div>

                            {/* Score Reasoning */}
                            {leadScore?.score_reasoning && (
                              <p className="text-xs text-gray-600 mt-2 italic">
                                {leadScore?.score_reasoning}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLeadSelect(leadScore)}
                            >
                              <Icon name="Plus" size={14} className="mr-1" />
                              Add to Campaign
                            </Button>
                            
                            {leadScore?.predicted_value && (
                              <span className="text-xs text-gray-500">
                                Est. Value: ${leadScore?.predicted_value?.toLocaleString()}
                              </span>
                            )}
                            
                            {leadScore?.conversion_probability && (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">Conv. Prob:</span>
                                <div className="w-12 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${(leadScore?.conversion_probability || 0) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600">
                                  {Math.round((leadScore?.conversion_probability || 0) * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoringPanel;