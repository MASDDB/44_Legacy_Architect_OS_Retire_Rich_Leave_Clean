import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = () => {
  const [emailSettings, setEmailSettings] = useState({
    confirmationEnabled: true,
    reminderEnabled: true,
    reminderTiming: '24',
    followUpEnabled: true,
    customTemplate: false
  });

  const [smsSettings, setSmsSettings] = useState({
    confirmationEnabled: true,
    reminderEnabled: true,
    reminderTiming: '2',
    followUpEnabled: false
  });

  const [templates, setTemplates] = useState({
    emailConfirmation: `Hi {{leadName}},\n\nYour appointment has been confirmed for {{appointmentTime}}.\n\nWe look forward to speaking with you!\n\nBest regards,\nThe Team`,
    emailReminder: `Hi {{leadName}},\n\nThis is a friendly reminder about your upcoming appointment scheduled for {{appointmentTime}}.\n\nSee you soon!`,
    smsConfirmation: `Hi {{leadName}}, your appointment is confirmed for {{appointmentTime}}. Reply STOP to opt out.`,
    smsReminder: `Reminder: You have an appointment today at {{appointmentTime}}. Reply STOP to opt out.`
  });

  const reminderTimingOptions = [
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '120', label: '2 hours before' },
    { value: '240', label: '4 hours before' },
    { value: '1440', label: '24 hours before' },
    { value: '2880', label: '48 hours before' }
  ];

  const handleEmailSettingChange = (field, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSmsSettingChange = (field, value) => {
    setSmsSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (templateType, value) => {
    setTemplates(prev => ({
      ...prev,
      [templateType]: value
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Bell" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Notification Settings</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Notifications */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Mail" size={18} className="text-blue-600" />
            <h4 className="font-medium text-foreground">Email Notifications</h4>
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Send confirmation emails"
              description="Automatically send confirmation when appointment is booked"
              checked={emailSettings?.confirmationEnabled}
              onChange={(e) => handleEmailSettingChange('confirmationEnabled', e?.target?.checked)}
            />

            <div className="space-y-3">
              <Checkbox
                label="Send reminder emails"
                description="Send reminder emails before appointments"
                checked={emailSettings?.reminderEnabled}
                onChange={(e) => handleEmailSettingChange('reminderEnabled', e?.target?.checked)}
              />
              
              {emailSettings?.reminderEnabled && (
                <div className="ml-6">
                  <Select
                    label="Reminder timing"
                    options={reminderTimingOptions}
                    value={emailSettings?.reminderTiming}
                    onChange={(value) => handleEmailSettingChange('reminderTiming', value)}
                  />
                </div>
              )}
            </div>

            <Checkbox
              label="Send follow-up emails"
              description="Send follow-up emails after missed appointments"
              checked={emailSettings?.followUpEnabled}
              onChange={(e) => handleEmailSettingChange('followUpEnabled', e?.target?.checked)}
            />

            <Checkbox
              label="Use custom templates"
              description="Customize email templates for your brand"
              checked={emailSettings?.customTemplate}
              onChange={(e) => handleEmailSettingChange('customTemplate', e?.target?.checked)}
            />
          </div>

          {/* Email Templates */}
          {emailSettings?.customTemplate && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirmation Email Template
                </label>
                <textarea
                  className="w-full h-32 p-3 border border-border rounded-lg resize-none text-sm"
                  value={templates?.emailConfirmation}
                  onChange={(e) => handleTemplateChange('emailConfirmation', e?.target?.value)}
                  placeholder="Enter confirmation email template"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {"{leadName}"} and {"{appointmentTime}"} as placeholders
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reminder Email Template
                </label>
                <textarea
                  className="w-full h-32 p-3 border border-border rounded-lg resize-none text-sm"
                  value={templates?.emailReminder}
                  onChange={(e) => handleTemplateChange('emailReminder', e?.target?.value)}
                  placeholder="Enter reminder email template"
                />
              </div>
            </div>
          )}
        </div>

        {/* SMS Notifications */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="MessageSquare" size={18} className="text-green-600" />
            <h4 className="font-medium text-foreground">SMS Notifications</h4>
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Send confirmation SMS"
              description="Automatically send SMS when appointment is booked"
              checked={smsSettings?.confirmationEnabled}
              onChange={(e) => handleSmsSettingChange('confirmationEnabled', e?.target?.checked)}
            />

            <div className="space-y-3">
              <Checkbox
                label="Send reminder SMS"
                description="Send SMS reminders before appointments"
                checked={smsSettings?.reminderEnabled}
                onChange={(e) => handleSmsSettingChange('reminderEnabled', e?.target?.checked)}
              />
              
              {smsSettings?.reminderEnabled && (
                <div className="ml-6">
                  <Select
                    label="Reminder timing"
                    options={reminderTimingOptions?.filter(option => 
                      ['15', '30', '60', '120', '240']?.includes(option?.value)
                    )}
                    value={smsSettings?.reminderTiming}
                    onChange={(value) => handleSmsSettingChange('reminderTiming', value)}
                  />
                </div>
              )}
            </div>

            <Checkbox
              label="Send follow-up SMS"
              description="Send follow-up SMS after missed appointments"
              checked={smsSettings?.followUpEnabled}
              onChange={(e) => handleSmsSettingChange('followUpEnabled', e?.target?.checked)}
            />
          </div>

          {/* SMS Templates */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmation SMS Template
              </label>
              <textarea
                className="w-full h-20 p-3 border border-border rounded-lg resize-none text-sm"
                value={templates?.smsConfirmation}
                onChange={(e) => handleTemplateChange('smsConfirmation', e?.target?.value)}
                placeholder="Enter confirmation SMS template"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {templates?.smsConfirmation?.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reminder SMS Template
              </label>
              <textarea
                className="w-full h-20 p-3 border border-border rounded-lg resize-none text-sm"
                value={templates?.smsReminder}
                onChange={(e) => handleTemplateChange('smsReminder', e?.target?.value)}
                placeholder="Enter reminder SMS template"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {templates?.smsReminder?.length}/160 characters
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-6 border-t border-border">
        <div className="flex space-x-3">
          <Button variant="outline">
            <Icon name="RotateCcw" size={14} className="mr-2" />
            Reset to Default
          </Button>
          <Button variant="default">
            <Icon name="Save" size={14} className="mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;