import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const IndustryRules = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('healthcare');
  const [rules, setRules] = useState({
    healthcare: {
      gdprRequired: true,
      hipaaCompliance: true,
      consentTracking: true,
      dataRetention: 7,
      optOutGracePeriod: 24
    },
    solar: {
      gdprRequired: true,
      tcpaCompliance: true,
      consentTracking: true,
      dataRetention: 5,
      optOutGracePeriod: 12
    },
    insurance: {
      gdprRequired: true,
      finraCompliance: true,
      consentTracking: true,
      dataRetention: 10,
      optOutGracePeriod: 48
    },
    financial: {
      gdprRequired: true,
      soxCompliance: true,
      consentTracking: true,
      dataRetention: 7,
      optOutGracePeriod: 24
    }
  });

  const industries = [
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'Heart',
      description: 'HIPAA compliant healthcare services',
      regulations: ['HIPAA', 'GDPR', 'CAN-SPAM']
    },
    {
      id: 'solar',
      name: 'Solar Energy',
      icon: 'Sun',
      description: 'Solar installation and energy services',
      regulations: ['TCPA', 'GDPR', 'CAN-SPAM']
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: 'Shield',
      description: 'Insurance and financial protection services',
      regulations: ['FINRA', 'GDPR', 'CAN-SPAM']
    },
    {
      id: 'financial',
      name: 'Financial Services',
      icon: 'DollarSign',
      description: 'Banking and financial advisory services',
      regulations: ['SOX', 'GDPR', 'CAN-SPAM']
    }
  ];

  const handleRuleChange = (industry, rule, value) => {
    setRules(prev => ({
      ...prev,
      [industry]: {
        ...prev?.[industry],
        [rule]: value
      }
    }));
  };

  const handleSaveRules = () => {
    console.log('Saving industry rules:', rules);
  };

  const currentRules = rules?.[selectedIndustry];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Industry-Specific Rules</h3>
            <p className="text-sm text-muted-foreground">
              Configure compliance rules for different industry verticals
            </p>
          </div>
          <Button
            variant="default"
            iconName="Save"
            iconPosition="left"
            onClick={handleSaveRules}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Industry Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Select Industry</h4>
            {industries?.map((industry) => (
              <div
                key={industry?.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedIndustry === industry?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedIndustry(industry?.id)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-muted rounded-lg">
                    <Icon name={industry?.icon} size={16} />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{industry?.name}</h5>
                    <p className="text-xs text-muted-foreground">{industry?.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {industry?.regulations?.map((reg) => (
                    <span
                      key={reg}
                      className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Rules Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-medium text-foreground">
              Compliance Rules for {industries?.find(i => i?.id === selectedIndustry)?.name}
            </h4>

            <div className="space-y-4">
              {/* Regulatory Compliance */}
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium text-foreground mb-3">Regulatory Compliance</h5>
                <div className="space-y-3">
                  <Checkbox
                    label="GDPR Compliance Required"
                    description="Ensure all communications comply with GDPR regulations"
                    checked={currentRules?.gdprRequired}
                    onChange={(e) => handleRuleChange(selectedIndustry, 'gdprRequired', e?.target?.checked)}
                  />
                  
                  {selectedIndustry === 'healthcare' && (
                    <Checkbox
                      label="HIPAA Compliance Required"
                      description="Apply HIPAA privacy and security rules"
                      checked={currentRules?.hipaaCompliance}
                      onChange={(e) => handleRuleChange(selectedIndustry, 'hipaaCompliance', e?.target?.checked)}
                    />
                  )}
                  
                  {selectedIndustry === 'solar' && (
                    <Checkbox
                      label="TCPA Compliance Required"
                      description="Follow TCPA regulations for voice and SMS campaigns"
                      checked={currentRules?.tcpaCompliance}
                      onChange={(e) => handleRuleChange(selectedIndustry, 'tcpaCompliance', e?.target?.checked)}
                    />
                  )}
                  
                  {selectedIndustry === 'insurance' && (
                    <Checkbox
                      label="FINRA Compliance Required"
                      description="Adhere to FINRA communication guidelines"
                      checked={currentRules?.finraCompliance}
                      onChange={(e) => handleRuleChange(selectedIndustry, 'finraCompliance', e?.target?.checked)}
                    />
                  )}
                  
                  {selectedIndustry === 'financial' && (
                    <Checkbox
                      label="SOX Compliance Required"
                      description="Follow Sarbanes-Oxley Act requirements"
                      checked={currentRules?.soxCompliance}
                      onChange={(e) => handleRuleChange(selectedIndustry, 'soxCompliance', e?.target?.checked)}
                    />
                  )}
                  
                  <Checkbox
                    label="Consent Tracking Required"
                    description="Track and maintain consent records for all contacts"
                    checked={currentRules?.consentTracking}
                    onChange={(e) => handleRuleChange(selectedIndustry, 'consentTracking', e?.target?.checked)}
                  />
                </div>
              </div>

              {/* Data Management */}
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium text-foreground mb-3">Data Management</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Data Retention Period (years)
                    </label>
                    <select
                      value={currentRules?.dataRetention}
                      onChange={(e) => handleRuleChange(selectedIndustry, 'dataRetention', parseInt(e?.target?.value))}
                      className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                    >
                      <option value={1}>1 year</option>
                      <option value={3}>3 years</option>
                      <option value={5}>5 years</option>
                      <option value={7}>7 years</option>
                      <option value={10}>10 years</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Opt-out Grace Period (hours)
                    </label>
                    <select
                      value={currentRules?.optOutGracePeriod}
                      onChange={(e) => handleRuleChange(selectedIndustry, 'optOutGracePeriod', parseInt(e?.target?.value))}
                      className="w-full p-2 border border-border rounded-lg bg-input text-foreground"
                    >
                      <option value={1}>1 hour</option>
                      <option value={12}>12 hours</option>
                      <option value={24}>24 hours</option>
                      <option value={48}>48 hours</option>
                      <option value={72}>72 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Compliance Alerts */}
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Important Notice</h5>
                    <p className="text-sm text-muted-foreground">
                      These compliance rules will be automatically applied to all campaigns targeting the selected industry. 
                      Changes may affect existing active campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryRules;