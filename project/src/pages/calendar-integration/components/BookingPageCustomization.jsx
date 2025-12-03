import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingPageCustomization = () => {
  const [customization, setCustomization] = useState({
    pageTitle: "Schedule Your Consultation",
    welcomeMessage: "Book a time that works best for you and let\'s discuss how we can help grow your business.",
    brandColor: "#1E40AF",
    logoUrl: "",
    customDomain: "",
    requirePhone: true,
    requireCompany: false,
    customFields: [
      { id: 1, label: "How did you hear about us?", type: "select", required: false },
      { id: 2, label: "What\'s your budget range?", type: "text", required: false }
    ]
  });

  const [previewMode, setPreviewMode] = useState(false);

  const fieldTypeOptions = [
    { value: 'text', label: 'Text Input' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'number', label: 'Number' }
  ];

  const handleCustomizationChange = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      label: "New Field",
      type: "text",
      required: false
    };
    setCustomization(prev => ({
      ...prev,
      customFields: [...prev?.customFields, newField]
    }));
  };

  const removeCustomField = (fieldId) => {
    setCustomization(prev => ({
      ...prev,
      customFields: prev?.customFields?.filter(field => field?.id !== fieldId)
    }));
  };

  const updateCustomField = (fieldId, updates) => {
    setCustomization(prev => ({
      ...prev,
      customFields: prev?.customFields?.map(field =>
        field?.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Palette" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Booking Page Customization</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Icon name="Eye" size={14} className="mr-2" />
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="ExternalLink" size={14} className="mr-2" />
            View Live Page
          </Button>
        </div>
      </div>
      {!previewMode ? (
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Page Title"
              value={customization?.pageTitle}
              onChange={(e) => handleCustomizationChange('pageTitle', e?.target?.value)}
              placeholder="Enter page title"
            />
            <Input
              label="Custom Domain"
              value={customization?.customDomain}
              onChange={(e) => handleCustomizationChange('customDomain', e?.target?.value)}
              placeholder="booking.yourdomain.com"
            />
          </div>

          <Input
            label="Welcome Message"
            value={customization?.welcomeMessage}
            onChange={(e) => handleCustomizationChange('welcomeMessage', e?.target?.value)}
            placeholder="Enter welcome message"
          />

          {/* Branding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Brand Color"
              type="color"
              value={customization?.brandColor}
              onChange={(e) => handleCustomizationChange('brandColor', e?.target?.value)}
            />
            <Input
              label="Logo URL"
              value={customization?.logoUrl}
              onChange={(e) => handleCustomizationChange('logoUrl', e?.target?.value)}
              placeholder="https://yoursite.com/logo.png"
            />
          </div>

          {/* Required Fields */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Required Information</h4>
            <div className="space-y-2">
              <Checkbox
                label="Require phone number"
                checked={customization?.requirePhone}
                onChange={(e) => handleCustomizationChange('requirePhone', e?.target?.checked)}
              />
              <Checkbox
                label="Require company name"
                checked={customization?.requireCompany}
                onChange={(e) => handleCustomizationChange('requireCompany', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Custom Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">Custom Fields</h4>
              <Button variant="outline" size="sm" onClick={addCustomField}>
                <Icon name="Plus" size={14} className="mr-2" />
                Add Field
              </Button>
            </div>
            
            <div className="space-y-4">
              {customization?.customFields?.map((field) => (
                <div key={field?.id} className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <Input
                      label="Field Label"
                      value={field?.label}
                      onChange={(e) => updateCustomField(field?.id, { label: e?.target?.value })}
                    />
                    <Select
                      label="Field Type"
                      options={fieldTypeOptions}
                      value={field?.type}
                      onChange={(value) => updateCustomField(field?.id, { type: value })}
                    />
                    <div className="flex items-end space-x-2">
                      <Checkbox
                        label="Required"
                        checked={field?.required}
                        onChange={(e) => updateCustomField(field?.id, { required: e?.target?.checked })}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCustomField(field?.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="default">
              <Icon name="Save" size={14} className="mr-2" />
              Save Customization
            </Button>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        (<div className="bg-background border border-border rounded-lg p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            {customization?.logoUrl && (
              <img
                src={customization?.logoUrl}
                alt="Logo"
                className="h-12 mx-auto mb-4"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {customization?.pageTitle}
            </h2>
            <p className="text-muted-foreground">
              {customization?.welcomeMessage}
            </p>
          </div>
          <div className="space-y-4">
            <Input label="Full Name" placeholder="Enter your name" required />
            <Input label="Email Address" type="email" placeholder="Enter your email" required />
            
            {customization?.requirePhone && (
              <Input label="Phone Number" type="tel" placeholder="Enter your phone" required />
            )}
            
            {customization?.requireCompany && (
              <Input label="Company Name" placeholder="Enter company name" required />
            )}

            {customization?.customFields?.map((field) => (
              <div key={field?.id}>
                {field?.type === 'select' ? (
                  <Select
                    label={field?.label}
                    options={[
                      { value: 'option1', label: 'Option 1' },
                      { value: 'option2', label: 'Option 2' }
                    ]}
                    required={field?.required}
                  />
                ) : (
                  <Input
                    label={field?.label}
                    type={field?.type}
                    required={field?.required}
                    placeholder={`Enter ${field?.label?.toLowerCase()}`}
                  />
                )}
              </div>
            ))}

            <Button
              variant="default"
              fullWidth
              style={{ backgroundColor: customization?.brandColor }}
            >
              Schedule Appointment
            </Button>
          </div>
        </div>)
      )}
    </div>
  );
};

export default BookingPageCustomization;