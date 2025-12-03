import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplateValidator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [validationResults, setValidationResults] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Email Reactivation - Healthcare',
      type: 'email',
      content: `Hi [FIRST_NAME],\n\nWe noticed you were interested in our healthcare services. We'd love to help you get back on track with your health goals.\n\nClick here to schedule a consultation: [BOOKING_LINK]\n\nBest regards,\n[COMPANY_NAME]`,
      complianceScore: 85,
      violations: ['Missing unsubscribe link', 'No physical address'],
      warnings: ['Generic greeting could be more personalized']
    },
    {
      id: 2,
      name: 'SMS Follow-up - Solar',type: 'sms',
      content: `Hi [FIRST_NAME]! Ready to save on energy costs? Our solar experts can show you savings of $200+/month. Reply STOP to opt out. Book now: [LINK]`,
      complianceScore: 92,
      violations: [],
      warnings: ['Consider adding company name']
    },
    {
      id: 3,
      name: 'Voice Script - Insurance',type: 'voice',
      content: `Hello [FIRST_NAME], this is [AGENT_NAME] from [COMPANY_NAME]. You recently inquired about life insurance options. I have some great news about policies that could save you money while providing better coverage. Would you have 2 minutes to discuss this?`,
      complianceScore: 78,
      violations: ['No clear opt-out mechanism mentioned'],
      warnings: ['Script may be too long for initial contact', 'Consider mentioning call recording']
    }
  ];

  const handleValidateTemplate = (template) => {
    setSelectedTemplate(template);
    
    // Simulate validation process
    setTimeout(() => {
      setValidationResults({
        gdprCompliant: template?.complianceScore > 80,
        canSpamCompliant: template?.violations?.length === 0,
        tcpaCompliant: template?.type !== 'voice' || template?.content?.includes('opt-out'),
        overallScore: template?.complianceScore,
        suggestions: [
          'Add clear unsubscribe mechanism',
          'Include company physical address',
          'Ensure consent tracking is enabled',
          'Add data processing disclosure'
        ]
      });
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 70) return 'bg-warning/10';
    return 'bg-error/10';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Template Validation Engine</h3>
        <p className="text-sm text-muted-foreground">
          Validate message templates for regulatory compliance across all channels
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template List */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Select Template to Validate</h4>
            {templates?.map((template) => (
              <div
                key={template?.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTemplate?.id === template?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => handleValidateTemplate(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name={
                        template?.type === 'email' ? 'Mail' :
                        template?.type === 'sms' ? 'MessageSquare' : 'Phone'
                      }
                      size={16}
                    />
                    <span className="font-medium text-foreground">{template?.name}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(template?.complianceScore)} ${getScoreColor(template?.complianceScore)}`}>
                    {template?.complianceScore}%
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {template?.content?.substring(0, 100)}...
                </div>
                
                {template?.violations?.length > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-error">
                    <Icon name="AlertCircle" size={12} />
                    <span>{template?.violations?.length} violation(s)</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Validation Results */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Validation Results</h4>
            
            {!selectedTemplate && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="FileSearch" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a template to view validation results</p>
              </div>
            )}

            {selectedTemplate && !validationResults && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Validating template...</p>
              </div>
            )}

            {validationResults && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-medium text-foreground mb-3">Compliance Status</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">GDPR Compliant</span>
                      <div className="flex items-center space-x-1">
                        <Icon
                          name={validationResults?.gdprCompliant ? 'CheckCircle' : 'XCircle'}
                          size={16}
                          className={validationResults?.gdprCompliant ? 'text-success' : 'text-error'}
                        />
                        <span className={`text-sm ${validationResults?.gdprCompliant ? 'text-success' : 'text-error'}`}>
                          {validationResults?.gdprCompliant ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">CAN-SPAM Compliant</span>
                      <div className="flex items-center space-x-1">
                        <Icon
                          name={validationResults?.canSpamCompliant ? 'CheckCircle' : 'XCircle'}
                          size={16}
                          className={validationResults?.canSpamCompliant ? 'text-success' : 'text-error'}
                        />
                        <span className={`text-sm ${validationResults?.canSpamCompliant ? 'text-success' : 'text-error'}`}>
                          {validationResults?.canSpamCompliant ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">TCPA Compliant</span>
                      <div className="flex items-center space-x-1">
                        <Icon
                          name={validationResults?.tcpaCompliant ? 'CheckCircle' : 'XCircle'}
                          size={16}
                          className={validationResults?.tcpaCompliant ? 'text-success' : 'text-error'}
                        />
                        <span className={`text-sm ${validationResults?.tcpaCompliant ? 'text-success' : 'text-error'}`}>
                          {validationResults?.tcpaCompliant ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-medium text-foreground mb-3">Improvement Suggestions</h5>
                  <div className="space-y-2">
                    {validationResults?.suggestions?.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
                        <span className="text-sm text-muted-foreground">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="default" iconName="Edit" iconPosition="left">
                    Edit Template
                  </Button>
                  <Button variant="outline" iconName="Copy">
                    Clone Template
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateValidator;