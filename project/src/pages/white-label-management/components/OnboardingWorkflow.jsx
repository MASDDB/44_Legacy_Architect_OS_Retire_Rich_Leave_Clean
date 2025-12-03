import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OnboardingWorkflow = ({ reseller, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    companyName: reseller?.company || '',
    contactName: reseller?.contact || '',
    email: reseller?.email || '',
    phone: '',
    website: '',
    
    // Step 2: Business Details
    industry: '',
    companySize: '',
    targetMarket: '',
    businessModel: '',
    
    // Step 3: Technical Setup
    customDomain: '',
    preferredIntegrations: [],
    technicalContact: '',
    
    // Step 4: Billing & Commission
    commissionType: 'percentage',
    commissionRate: 20,
    payoutFrequency: 'monthly',
    stripeAccountId: '',
    
    // Step 5: Branding
    primaryColor: '#1E40AF',
    logo: '',
    companyTagline: ''
  });

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Company and contact details',
      icon: 'Building2'
    },
    {
      id: 2,
      title: 'Business Details',
      description: 'Industry and target market',
      icon: 'Target'
    },
    {
      id: 3,
      title: 'Technical Setup',
      description: 'Domain and integrations',
      icon: 'Settings'
    },
    {
      id: 4,
      title: 'Billing & Commission',
      description: 'Payment and commission setup',
      icon: 'CreditCard'
    },
    {
      id: 5,
      title: 'Branding',
      description: 'Logo and color scheme',
      icon: 'Palette'
    }
  ];

  const industryOptions = [
    { value: 'home-services', label: 'Home Services' },
    { value: 'solar', label: 'Solar Energy' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'financial', label: 'Financial Advisory' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'other', label: 'Other' }
  ];

  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '500+ employees' }
  ];

  const integrationOptions = [
    { value: 'google-calendar', label: 'Google Calendar' },
    { value: 'outlook', label: 'Microsoft Outlook' },
    { value: 'cal-com', label: 'Cal.com' },
    { value: 'hubspot', label: 'HubSpot CRM' },
    { value: 'salesforce', label: 'Salesforce' },
    { value: 'pipedrive', label: 'Pipedrive' }
  ];

  const payoutFrequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData?.companyName && formData?.contactName && formData?.email;
      case 2:
        return formData?.industry && formData?.companySize;
      case 3:
        return formData?.customDomain;
      case 4:
        return formData?.commissionRate && formData?.payoutFrequency;
      case 5:
        return formData?.primaryColor;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                type="text"
                required
                value={formData?.companyName}
                onChange={(e) => handleInputChange('companyName', e?.target?.value)}
                placeholder="Enter company name"
              />
              <Input
                label="Contact Name"
                type="text"
                required
                value={formData?.contactName}
                onChange={(e) => handleInputChange('contactName', e?.target?.value)}
                placeholder="Primary contact person"
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                placeholder="contact@company.com"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Website"
                type="url"
                value={formData?.website}
                onChange={(e) => handleInputChange('website', e?.target?.value)}
                placeholder="https://company.com"
                className="md:col-span-2"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Industry"
                required
                options={industryOptions}
                value={formData?.industry}
                onChange={(value) => handleInputChange('industry', value)}
                placeholder="Select industry"
              />
              <Select
                label="Company Size"
                required
                options={companySizeOptions}
                value={formData?.companySize}
                onChange={(value) => handleInputChange('companySize', value)}
                placeholder="Select company size"
              />
              <Input
                label="Target Market"
                type="text"
                value={formData?.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e?.target?.value)}
                placeholder="e.g., Small businesses, Enterprise"
                className="md:col-span-2"
              />
              <Input
                label="Business Model"
                type="text"
                value={formData?.businessModel}
                onChange={(e) => handleInputChange('businessModel', e?.target?.value)}
                placeholder="Describe your business model"
                className="md:col-span-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Technical Setup</h3>
            <div className="space-y-4">
              <Input
                label="Custom Domain"
                type="text"
                required
                value={formData?.customDomain}
                onChange={(e) => handleInputChange('customDomain', e?.target?.value)}
                placeholder="app.yourcompany.com"
                description="This will be your white-label domain"
              />
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Preferred Integrations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {integrationOptions?.map((integration) => (
                    <label key={integration?.value} className="flex items-center space-x-2 p-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData?.preferredIntegrations?.includes(integration?.value)}
                        onChange={(e) => {
                          if (e?.target?.checked) {
                            handleInputChange('preferredIntegrations', [...formData?.preferredIntegrations, integration?.value]);
                          } else {
                            handleInputChange('preferredIntegrations', formData?.preferredIntegrations?.filter(i => i !== integration?.value));
                          }
                        }}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{integration?.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Input
                label="Technical Contact Email"
                type="email"
                value={formData?.technicalContact}
                onChange={(e) => handleInputChange('technicalContact', e?.target?.value)}
                placeholder="tech@company.com"
                description="For technical setup and support"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Billing & Commission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Commission Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="commissionType"
                      value="percentage"
                      checked={formData?.commissionType === 'percentage'}
                      onChange={(e) => handleInputChange('commissionType', e?.target?.value)}
                    />
                    <span className="text-sm text-foreground">Percentage</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="commissionType"
                      value="flat"
                      checked={formData?.commissionType === 'flat'}
                      onChange={(e) => handleInputChange('commissionType', e?.target?.value)}
                    />
                    <span className="text-sm text-foreground">Flat Fee</span>
                  </label>
                </div>
              </div>
              <Input
                label={formData?.commissionType === 'percentage' ? 'Commission Rate (%)' : 'Commission Amount ($)'}
                type="number"
                required
                value={formData?.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', parseFloat(e?.target?.value))}
                placeholder={formData?.commissionType === 'percentage' ? '20' : '100'}
              />
              <Select
                label="Payout Frequency"
                required
                options={payoutFrequencyOptions}
                value={formData?.payoutFrequency}
                onChange={(value) => handleInputChange('payoutFrequency', value)}
                placeholder="Select frequency"
              />
              <Input
                label="Stripe Account ID"
                type="text"
                value={formData?.stripeAccountId}
                onChange={(e) => handleInputChange('stripeAccountId', e?.target?.value)}
                placeholder="acct_xxxxxxxxxx"
                description="For automated payouts"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Branding</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData?.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e?.target?.value)}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData?.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e?.target?.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <Input
                label="Company Tagline"
                type="text"
                value={formData?.companyTagline}
                onChange={(e) => handleInputChange('companyTagline', e?.target?.value)}
                placeholder="Your company tagline"
              />
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground">Upload Company Logo</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Reseller Onboarding</h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps?.length}: {steps?.[currentStep - 1]?.title}
            </p>
          </div>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
      {/* Progress Steps */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => (
            <div key={step?.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep > step?.id
                  ? 'bg-success border-success text-success-foreground'
                  : currentStep === step?.id
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-muted border-border text-muted-foreground'
              }`}>
                {currentStep > step?.id ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              {index < steps?.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step?.id ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Step Content */}
      <div className="p-6">
        {renderStepContent()}
      </div>
      {/* Navigation */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <Icon name="ChevronLeft" size={16} />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {currentStep < steps?.length ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
              >
                Next
                <Icon name="ChevronRight" size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid(currentStep)}
              >
                Complete Setup
                <Icon name="Check" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWorkflow;