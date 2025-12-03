import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TemplateLibrary = ({ onAddTemplate, isCollapsed, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templateCategories = [
    { id: 'all', label: 'All Templates', count: 24 },
    { id: 'seasonal', label: 'Seasonal', count: 8 },
    { id: 'industry', label: 'Industry Specific', count: 12 },
    { id: 'follow-up', label: 'Follow-up', count: 4 }
  ];

  const templates = [
    {
      id: 1,
      name: "Holiday Reactivation",
      category: "seasonal",
      channel: "email",
      description: "Warm holiday greeting with special offer",
      content: "Hi {firstName}, Hope you're enjoying the holiday season! We have a special offer just for you...",
      tags: ["holiday", "discount", "warm"],
      performance: { openRate: 34, responseRate: 12 }
    },
    {
      id: 2,
      name: "Solar Consultation Follow-up",
      category: "industry",
      channel: "voice",
      description: "Professional follow-up for solar leads",
      content: "Hello {firstName}, this is {agentName} from {companyName}. I wanted to follow up on your interest in solar energy solutions...",
      tags: ["solar", "consultation", "professional"],
      performance: { connectRate: 28, appointmentRate: 15 }
    },
    {
      id: 3,
      name: "Insurance Policy Reminder",
      category: "industry",
      channel: "sms",
      description: "Gentle reminder about policy renewal",
      content: "Hi {firstName}! Your insurance policy expires soon. Let's schedule a quick review to ensure you're still getting the best coverage. Reply YES to schedule.",
      tags: ["insurance", "renewal", "urgent"],
      performance: { deliveryRate: 98, responseRate: 22 }
    },
    {
      id: 4,
      name: "Home Services Check-in",
      category: "follow-up",
      channel: "email",
      description: "Post-service satisfaction follow-up",
      content: "Hi {firstName}, How did we do with your recent {serviceType}? We'd love to hear your feedback and help with any future needs.",
      tags: ["satisfaction", "feedback", "relationship"],
      performance: { openRate: 42, responseRate: 18 }
    },
    {
      id: 5,
      name: "Financial Planning Invitation",
      category: "industry",
      channel: "voice",
      description: "Invitation to financial planning session",
      content: "Good {timeOfDay} {firstName}, this is {agentName} from {companyName}. I hope you're doing well. I wanted to reach out about your financial planning goals...",
      tags: ["financial", "planning", "consultation"],
      performance: { connectRate: 31, appointmentRate: 19 }
    },
    {
      id: 6,
      name: "New Year Fresh Start",
      category: "seasonal",
      channel: "sms",
      description: "New Year motivation message",
      content: "Happy New Year {firstName}! Ready for a fresh start? Let's discuss how we can help you achieve your goals this year. Reply START to begin.",
      tags: ["new-year", "motivation", "goals"],
      performance: { deliveryRate: 97, responseRate: 16 }
    }
  ];

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'voice': return 'Phone';
      case 'sms': return 'MessageSquare';
      case 'email': return 'Mail';
      default: return 'MessageCircle';
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'voice': return 'text-blue-600 bg-blue-50';
      case 'sms': return 'text-green-600 bg-green-50';
      case 'email': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border h-full flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-4"
        >
          <Icon name="PanelRightOpen" size={20} />
        </Button>
        <div className="writing-mode-vertical text-sm text-muted-foreground font-medium">
          Templates
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Template Library</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="PanelRightClose" size={20} />
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-4"
        />

        {/* Categories */}
        <div className="space-y-1">
          {templateCategories?.map(category => (
            <button
              key={category?.id}
              onClick={() => setSelectedCategory(category?.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span>{category?.label}</span>
              <span className="text-xs">{category?.count}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTemplates?.map(template => (
          <div
            key={template?.id}
            className="bg-muted/50 border border-border rounded-lg p-4 hover:shadow-soft transition-all cursor-pointer"
            onClick={() => onAddTemplate(template)}
          >
            {/* Template Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm mb-1">{template?.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{template?.description}</p>
              </div>
              <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(template?.channel)}`}>
                <Icon name={getChannelIcon(template?.channel)} size={12} className="inline mr-1" />
                {template?.channel?.toUpperCase()}
              </div>
            </div>

            {/* Content Preview */}
            <div className="bg-card border border-border rounded p-2 mb-3">
              <p className="text-xs text-foreground line-clamp-2">{template?.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {template?.tags?.slice(0, 3)?.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="flex justify-between text-xs text-muted-foreground">
              {template?.channel === 'email' && (
                <>
                  <span>Open: {template?.performance?.openRate}%</span>
                  <span>Response: {template?.performance?.responseRate}%</span>
                </>
              )}
              {template?.channel === 'voice' && (
                <>
                  <span>Connect: {template?.performance?.connectRate}%</span>
                  <span>Appointment: {template?.performance?.appointmentRate}%</span>
                </>
              )}
              {template?.channel === 'sms' && (
                <>
                  <span>Delivery: {template?.performance?.deliveryRate}%</span>
                  <span>Response: {template?.performance?.responseRate}%</span>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredTemplates?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No templates found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Create Custom Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateLibrary;