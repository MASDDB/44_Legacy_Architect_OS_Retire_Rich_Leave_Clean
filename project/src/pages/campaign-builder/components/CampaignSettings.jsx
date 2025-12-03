import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CampaignSettings = ({ settings, onSettingsChange, onSave, onPreview }) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'scheduling', label: 'Scheduling', icon: 'Calendar' },
    { id: 'compliance', label: 'Compliance', icon: 'Shield' },
    { id: 'testing', label: 'A/B Testing', icon: 'TestTube' }
  ];

  const timezoneOptions = [
    { value: 'EST', label: 'Eastern Time (EST)' },
    { value: 'CST', label: 'Central Time (CST)' },
    { value: 'MST', label: 'Mountain Time (MST)' },
    { value: 'PST', label: 'Pacific Time (PST)' }
  ];

  const complianceTemplates = [
    { value: 'standard', label: 'Standard Compliance' },
    { value: 'healthcare', label: 'Healthcare (HIPAA)' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'insurance', label: 'Insurance Industry' }
  ];

  const leadSegmentOptions = [
    { value: 'hot', label: 'Hot Leads Only' },
    { value: 'warm', label: 'Warm Leads Only' },
    { value: 'cold', label: 'Cold Leads Only' },
    { value: 'hot-warm', label: 'Hot + Warm Leads' },
    { value: 'all', label: 'All Lead Types' }
  ];

  const industryOptions = [
    { value: 'solar', label: 'Solar Energy' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'home-services', label: 'Home Services' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'real-estate', label: 'Real Estate' }
  ];

  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <Input
          label="Campaign Name"
          type="text"
          placeholder="Enter campaign name"
          value={settings?.name || ''}
          onChange={(e) => updateSetting('name', e?.target?.value)}
          required
        />
      </div>

      <div>
        <Input
          label="Description"
          type="text"
          placeholder="Brief description of this campaign"
          value={settings?.description || ''}
          onChange={(e) => updateSetting('description', e?.target?.value)}
        />
      </div>

      <div>
        <Select
          label="Target Lead Segment"
          options={leadSegmentOptions}
          value={settings?.leadSegment || 'all'}
          onChange={(value) => updateSetting('leadSegment', value)}
          description="Choose which lead types to target"
        />
      </div>

      <div>
        <Select
          label="Industry Focus"
          options={industryOptions}
          value={settings?.industry || ''}
          onChange={(value) => updateSetting('industry', value)}
          placeholder="Select industry (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Daily Send Limit"
          type="number"
          placeholder="100"
          value={settings?.dailyLimit || ''}
          onChange={(e) => updateSetting('dailyLimit', e?.target?.value)}
          description="Max messages per day"
        />
        <Input
          label="Total Campaign Limit"
          type="number"
          placeholder="1000"
          value={settings?.totalLimit || ''}
          onChange={(e) => updateSetting('totalLimit', e?.target?.value)}
          description="Max total messages"
        />
      </div>
    </div>
  );

  const renderSchedulingTab = () => (
    <div className="space-y-6">
      <div>
        <Select
          label="Timezone"
          options={timezoneOptions}
          value={settings?.timezone || 'EST'}
          onChange={(value) => updateSetting('timezone', value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="time"
          value={settings?.startTime || '09:00'}
          onChange={(e) => updateSetting('startTime', e?.target?.value)}
        />
        <Input
          label="End Time"
          type="time"
          value={settings?.endTime || '17:00'}
          onChange={(e) => updateSetting('endTime', e?.target?.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Active Days
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']?.map(day => (
            <Checkbox
              key={day}
              label={day?.slice(0, 3)}
              checked={settings?.activeDays?.includes(day) || false}
              onChange={(e) => {
                const activeDays = settings?.activeDays || [];
                if (e?.target?.checked) {
                  updateSetting('activeDays', [...activeDays, day]);
                } else {
                  updateSetting('activeDays', activeDays?.filter(d => d !== day));
                }
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <Input
          label="Launch Date"
          type="date"
          value={settings?.launchDate || ''}
          onChange={(e) => updateSetting('launchDate', e?.target?.value)}
          description="When to start this campaign"
        />
      </div>

      <div>
        <Checkbox
          label="Respect Lead Time Zones"
          checked={settings?.respectTimezones || false}
          onChange={(e) => updateSetting('respectTimezones', e?.target?.checked)}
          description="Send messages based on lead's local time"
        />
      </div>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      <div>
        <Select
          label="Compliance Template"
          options={complianceTemplates}
          value={settings?.complianceTemplate || 'standard'}
          onChange={(value) => updateSetting('complianceTemplate', value)}
          description="Choose appropriate compliance rules"
        />
      </div>

      <div className="space-y-3">
        <Checkbox
          label="Auto Opt-out Processing"
          checked={settings?.autoOptOut || true}
          onChange={(e) => updateSetting('autoOptOut', e?.target?.checked)}
          description="Automatically process STOP/UNSUBSCRIBE requests"
        />
        
        <Checkbox
          label="TCPA Compliance"
          checked={settings?.tcpaCompliance || true}
          onChange={(e) => updateSetting('tcpaCompliance', e?.target?.checked)}
          description="Follow TCPA regulations for calls and texts"
        />
        
        <Checkbox
          label="CAN-SPAM Compliance"
          checked={settings?.canSpamCompliance || true}
          onChange={(e) => updateSetting('canSpamCompliance', e?.target?.checked)}
          description="Include required email unsubscribe options"
        />
        
        <Checkbox
          label="GDPR Compliance"
          checked={settings?.gdprCompliance || false}
          onChange={(e) => updateSetting('gdprCompliance', e?.target?.checked)}
          description="Apply GDPR data protection rules"
        />
      </div>

      <div>
        <Input
          label="Opt-out Keywords"
          type="text"
          placeholder="STOP, UNSUBSCRIBE, REMOVE"
          value={settings?.optOutKeywords || 'STOP, UNSUBSCRIBE, REMOVE'}
          onChange={(e) => updateSetting('optOutKeywords', e?.target?.value)}
          description="Keywords that trigger automatic opt-out"
        />
      </div>

      <div>
        <Input
          label="Business Hours Only"
          type="checkbox"
          checked={settings?.businessHoursOnly || true}
          onChange={(e) => updateSetting('businessHoursOnly', e?.target?.checked)}
          description="Only send during business hours"
        />
      </div>
    </div>
  );

  const renderTestingTab = () => (
    <div className="space-y-6">
      <div>
        <Checkbox
          label="Enable A/B Testing"
          checked={settings?.abTestEnabled || false}
          onChange={(e) => updateSetting('abTestEnabled', e?.target?.checked)}
          description="Test different message variations"
        />
      </div>

      {settings?.abTestEnabled && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Test Duration (days)"
              type="number"
              placeholder="7"
              value={settings?.testDuration || ''}
              onChange={(e) => updateSetting('testDuration', e?.target?.value)}
            />
            <Input
              label="Traffic Split (%)"
              type="number"
              placeholder="50"
              value={settings?.trafficSplit || '50'}
              onChange={(e) => updateSetting('trafficSplit', e?.target?.value)}
              description="% for variant A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Success Metrics
            </label>
            <div className="space-y-2">
              <Checkbox
                label="Response Rate"
                checked={settings?.testMetrics?.includes('response') || false}
                onChange={(e) => {
                  const metrics = settings?.testMetrics || [];
                  if (e?.target?.checked) {
                    updateSetting('testMetrics', [...metrics, 'response']);
                  } else {
                    updateSetting('testMetrics', metrics?.filter(m => m !== 'response'));
                  }
                }}
              />
              <Checkbox
                label="Appointment Booking Rate"
                checked={settings?.testMetrics?.includes('appointment') || false}
                onChange={(e) => {
                  const metrics = settings?.testMetrics || [];
                  if (e?.target?.checked) {
                    updateSetting('testMetrics', [...metrics, 'appointment']);
                  } else {
                    updateSetting('testMetrics', metrics?.filter(m => m !== 'appointment'));
                  }
                }}
              />
              <Checkbox
                label="Conversion Rate"
                checked={settings?.testMetrics?.includes('conversion') || false}
                onChange={(e) => {
                  const metrics = settings?.testMetrics || [];
                  if (e?.target?.checked) {
                    updateSetting('testMetrics', [...metrics, 'conversion']);
                  } else {
                    updateSetting('testMetrics', metrics?.filter(m => m !== 'conversion'));
                  }
                }}
              />
            </div>
          </div>

          <div>
            <Input
              label="Minimum Sample Size"
              type="number"
              placeholder="100"
              value={settings?.minSampleSize || ''}
              onChange={(e) => updateSetting('minSampleSize', e?.target?.value)}
              description="Minimum leads per variant"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Campaign Settings</h3>
        <p className="text-sm text-muted-foreground">Configure your campaign parameters and compliance settings</p>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-0">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'scheduling' && renderSchedulingTab()}
        {activeTab === 'compliance' && renderComplianceTab()}
        {activeTab === 'testing' && renderTestingTab()}
      </div>
      {/* Footer Actions */}
      <div className="p-6 border-t border-border">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onPreview}
            className="flex-1"
          >
            <Icon name="Eye" size={16} className="mr-2" />
            Preview Campaign
          </Button>
          <Button
            variant="default"
            onClick={onSave}
            className="flex-1"
          >
            <Icon name="Save" size={16} className="mr-2" />
            Save & Launch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignSettings;