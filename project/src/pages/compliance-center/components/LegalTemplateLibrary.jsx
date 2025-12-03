import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LegalTemplateLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'GDPR Compliant Email Footer',
      category: 'email',
      industry: 'general',
      regulation: 'GDPR',
      content: `This email was sent to [EMAIL] because you previously expressed interest in our services.\n\nYou can unsubscribe at any time by clicking here: [UNSUBSCRIBE_LINK]\n\nFor data protection inquiries, contact our DPO at privacy@company.com\n\n[COMPANY_NAME]\n[COMPANY_ADDRESS]\n[COMPANY_PHONE]`,
      description: 'GDPR compliant email footer with unsubscribe and data protection information',
      lastUpdated: '2025-01-10'
    },
    {
      id: 2,
      name: 'TCPA Voice Script Opener',
      category: 'voice',
      industry: 'general',
      regulation: 'TCPA',
      content: `Hello [FIRST_NAME], this is [AGENT_NAME] calling from [COMPANY_NAME]. You recently inquired about our services, and I have your express written consent to contact you at this number. This call may be recorded for quality purposes.\n\nIf you'd prefer not to receive future calls, please let me know and I'll remove you from our calling list immediately.\n\nDo you have a moment to discuss [SERVICE_TYPE]?`,
      description: 'TCPA compliant voice script opening with consent acknowledgment',
      lastUpdated: '2025-01-08'
    },
    {
      id: 3,
      name: 'CAN-SPAM Email Header',
      category: 'email',
      industry: 'general',
      regulation: 'CAN-SPAM',
      content: `Subject: [SUBJECT_LINE] - Not Spam\n\nFrom: [SENDER_NAME] <[SENDER_EMAIL]>\nTo: [RECIPIENT_EMAIL]\n\nThis is a commercial email sent to you because you previously expressed interest in [SERVICE_TYPE]. This is not spam.\n\n[EMAIL_CONTENT]\n\nTo unsubscribe from future emails, click here: [UNSUBSCRIBE_LINK]\n\n[COMPANY_NAME]\n[PHYSICAL_ADDRESS]`,
      description: 'CAN-SPAM compliant email header with proper identification',
      lastUpdated: '2025-01-12'
    },
    {
      id: 4,
      name: 'HIPAA Healthcare SMS',
      category: 'sms',
      industry: 'healthcare',
      regulation: 'HIPAA',
      content: `Hi [FIRST_NAME], this is [PRACTICE_NAME]. We have a secure message regarding your recent inquiry about our healthcare services.\n\nPlease call us at [PHONE] or visit our secure patient portal to discuss further.\n\nReply STOP to opt out. Standard rates apply.\n\nThis message contains no protected health information.`,
      description: 'HIPAA compliant SMS for healthcare communications',
      lastUpdated: '2025-01-05'
    },
    {
      id: 5,
      name: 'Financial Services Disclaimer',
      category: 'email',
      industry: 'financial',
      regulation: 'FINRA',
      content: `IMPORTANT DISCLOSURES:\n\nThis communication is for informational purposes only and does not constitute investment advice. Past performance does not guarantee future results.\n\n[COMPANY_NAME] is a registered investment advisor. For our full disclosures and Form ADV, visit [WEBSITE]/disclosures\n\nSecurities offered through [BROKER_DEALER], Member FINRA/SIPC.\n\nThis email was sent to [EMAIL] based on your previous inquiry. To unsubscribe: [UNSUBSCRIBE_LINK]`,
      description: 'FINRA compliant disclaimer for financial services communications',
      lastUpdated: '2025-01-07'
    },
    {
      id: 6,
      name: 'Solar Lead SMS Template',
      category: 'sms',
      industry: 'solar',
      regulation: 'TCPA',
      content: `Hi [FIRST_NAME]! Thanks for your interest in solar savings. Based on your home details, you could save $[ESTIMATED_SAVINGS]/month.\n\nWould you like a free consultation? Reply YES or call [PHONE].\n\nReply STOP to opt out. Msg & data rates may apply.\n\n[COMPANY_NAME] - Licensed Solar Installer`,
      description: 'TCPA compliant SMS template for solar lead follow-up',
      lastUpdated: '2025-01-09'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: 'FileText' },
    { id: 'email', name: 'Email', icon: 'Mail' },
    { id: 'sms', name: 'SMS', icon: 'MessageSquare' },
    { id: 'voice', name: 'Voice', icon: 'Phone' }
  ];

  const industries = [
    { id: 'general', name: 'General' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'financial', name: 'Financial' },
    { id: 'solar', name: 'Solar' }
  ];

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         template?.regulation?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    console.log('Using template:', template?.name);
  };

  const handleCopyTemplate = (template) => {
    navigator.clipboard?.writeText(template?.content);
    console.log('Template copied to clipboard');
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Legal Template Library</h3>
            <p className="text-sm text-muted-foreground">
              Pre-approved messaging templates for regulatory compliance
            </p>
          </div>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Request Template
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search templates by name, regulation, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <div className="flex space-x-2">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => setSelectedCategory(category?.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={category?.icon} size={14} />
                <span>{category?.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates?.map((template) => (
            <div key={template?.id} className="border border-border rounded-lg p-4 hover:shadow-soft transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon
                    name={
                      template?.category === 'email' ? 'Mail' :
                      template?.category === 'sms' ? 'MessageSquare' : 'Phone'
                    }
                    size={16}
                  />
                  <h4 className="font-medium text-foreground">{template?.name}</h4>
                </div>
                <div className="flex space-x-1">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {template?.regulation}
                  </span>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                    {industries?.find(i => i?.id === template?.industry)?.name}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>

              <div className="bg-muted p-3 rounded-lg mb-3 max-h-32 overflow-y-auto">
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                  {template?.content?.substring(0, 200)}
                  {template?.content?.length > 200 && '...'}
                </pre>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Updated: {template?.lastUpdated}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    onClick={() => handleCopyTemplate(template)}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Plus"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No templates found matching your criteria.</p>
          </div>
        )}
      </div>
      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
          <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedTemplate?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTemplate?.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTemplate(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {selectedTemplate?.regulation}
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                  {industries?.find(i => i?.id === selectedTemplate?.industry)?.name}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                  {selectedTemplate?.category?.charAt(0)?.toUpperCase() + selectedTemplate?.category?.slice(1)}
                </span>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Template Content</h4>
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {selectedTemplate?.content}
                </pre>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}
                >
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  iconName="Copy"
                  iconPosition="left"
                  onClick={() => handleCopyTemplate(selectedTemplate)}
                >
                  Copy to Clipboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalTemplateLibrary;