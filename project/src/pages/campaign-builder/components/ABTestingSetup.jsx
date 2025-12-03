import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ABTestingSetup = ({ config, onSave, onClose, isOpen }) => {
  const [abConfig, setAbConfig] = useState({
    abTestEnabled: config?.abTestEnabled || false,
    testName: config?.testName || '',
    testDescription: config?.testDescription || '',
    testDuration: config?.testDuration || 7,
    trafficSplit: config?.trafficSplit || 50,
    testMetrics: config?.testMetrics || ['response'],
    minSampleSize: config?.minSampleSize || 100,
    confidenceLevel: config?.confidenceLevel || 95,
    variants: config?.variants || [],
    winnerSelection: config?.winnerSelection || 'automatic',
    testType: config?.testType || 'message_content',
    statisticalSignificance: config?.statisticalSignificance || true
  });

  const testTypes = [
    { value: 'message_content', label: 'Message Content' },
    { value: 'subject_line', label: 'Email Subject Line' },
    { value: 'send_time', label: 'Send Time' },
    { value: 'sender_name', label: 'Sender Name' },
    { value: 'channel', label: 'Communication Channel' },
    { value: 'call_to_action', label: 'Call to Action' },
    { value: 'personalization', label: 'Personalization Level' },
    { value: 'message_length', label: 'Message Length' },
    { value: 'tone', label: 'Message Tone' },
    { value: 'timing', label: 'Send Timing' }
  ];

  const successMetrics = [
    { value: 'response', label: 'Response Rate' },
    { value: 'appointment', label: 'Appointment Booking Rate' },
    { value: 'conversion', label: 'Conversion Rate' },
    { value: 'open_rate', label: 'Email Open Rate' },
    { value: 'click_rate', label: 'Email Click Rate' },
    { value: 'call_answer_rate', label: 'Call Answer Rate' },
    { value: 'positive_response', label: 'Positive Response Rate' },
    { value: 'qualified_lead', label: 'Lead Qualification Rate' },
    { value: 'revenue', label: 'Revenue per Lead' },
    { value: 'cost_per_acquisition', label: 'Cost per Acquisition' }
  ];

  const winnerSelectionOptions = [
    { value: 'automatic', label: 'Automatic (Statistical Significance)' },
    { value: 'manual', label: 'Manual Selection' },
    { value: 'duration_based', label: 'Duration-based' }
  ];

  const confidenceLevels = [
    { value: 90, label: '90%' },
    { value: 95, label: '95%' },
    { value: 99, label: '99%' }
  ];

  const updateConfig = (key, value) => {
    setAbConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      name: `Variant ${String.fromCharCode(65 + abConfig?.variants?.length)}`,
      description: '',
      content: '',
      weight: Math.floor(100 / (abConfig?.variants?.length + 2)), // Distribute weight evenly
      isControl: abConfig?.variants?.length === 0
    };

    setAbConfig(prev => ({
      ...prev,
      variants: [...prev?.variants, newVariant]
    }));
  };

  const updateVariant = (variantId, key, value) => {
    setAbConfig(prev => ({
      ...prev,
      variants: prev?.variants?.map(variant =>
        variant?.id === variantId
          ? { ...variant, [key]: value }
          : variant
      )
    }));
  };

  const removeVariant = (variantId) => {
    setAbConfig(prev => ({
      ...prev,
      variants: prev?.variants?.filter(variant => variant?.id !== variantId)
    }));
  };

  const toggleMetric = (metric) => {
    setAbConfig(prev => ({
      ...prev,
      testMetrics: prev?.testMetrics?.includes(metric)
        ? prev?.testMetrics?.filter(m => m !== metric)
        : [...prev?.testMetrics, metric]
    }));
  };

  const calculateSampleSize = () => {
    // Simple sample size calculation
    const baseRate = 0.15; // Assumed base conversion rate
    const minimumDetectableEffect = 0.02; // 2% improvement
    const alpha = (100 - abConfig?.confidenceLevel) / 100;
    const power = 0.8;
    
    // Simplified formula - in practice, you'd use more sophisticated statistics
    const sampleSize = Math.ceil(
      (2 * Math.pow(1.96 + 0.84, 2) * baseRate * (1 - baseRate)) / 
      Math.pow(minimumDetectableEffect, 2)
    );
    
    return Math.max(sampleSize, 100);
  };

  const handleSave = () => {
    onSave(abConfig);
  };

  const handleGenerateVariants = () => {
    // Generate some sample variants
    const sampleVariants = [
      {
        id: Date.now() + 1,
        name: 'Control (Original)',
        description: 'Original message content',
        content: 'Hi {{first_name}}, interested in solar? Let\'s schedule a call.',
        weight: 50,
        isControl: true
      },
      {
        id: Date.now() + 2,
        name: 'Variant A',
        description: 'More personalized approach',
        content: 'Hello {{first_name}}, I noticed you\'re interested in solar for your {{city}} home. Can we chat?',
        weight: 50,
        isControl: false
      }
    ];

    setAbConfig(prev => ({
      ...prev,
      variants: sampleVariants
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">A/B Testing Setup</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create split tests to optimize your campaign performance
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Enable A/B Testing */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <h3 className="text-lg font-medium text-foreground">Enable A/B Testing</h3>
                <p className="text-sm text-muted-foreground">
                  Test different variations to improve campaign performance
                </p>
              </div>
              <Checkbox
                label=""
                checked={abConfig?.abTestEnabled}
                onChange={(e) => updateConfig('abTestEnabled', e?.target?.checked)}
              />
            </div>

            {abConfig?.abTestEnabled && (
              <>
                {/* Test Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Test Configuration</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Test Name"
                      type="text"
                      placeholder="My A/B Test"
                      value={abConfig?.testName}
                      onChange={(e) => updateConfig('testName', e?.target?.value)}
                    />
                    
                    <Select
                      label="Test Type"
                      options={testTypes}
                      value={abConfig?.testType}
                      onChange={(value) => updateConfig('testType', value)}
                    />
                  </div>

                  <Input
                    label="Test Description"
                    type="text"
                    placeholder="Brief description of what you're testing"
                    value={abConfig?.testDescription}
                    onChange={(e) => updateConfig('testDescription', e?.target?.value)}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Test Duration (days)"
                      type="number"
                      placeholder="7"
                      value={abConfig?.testDuration}
                      onChange={(e) => updateConfig('testDuration', e?.target?.value)}
                    />
                    
                    <Input
                      label="Traffic Split (%)"
                      type="number"
                      placeholder="50"
                      min="10"
                      max="90"
                      value={abConfig?.trafficSplit}
                      onChange={(e) => updateConfig('trafficSplit', e?.target?.value)}
                    />
                    
                    <Select
                      label="Confidence Level"
                      options={confidenceLevels}
                      value={abConfig?.confidenceLevel}
                      onChange={(value) => updateConfig('confidenceLevel', value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Minimum Sample Size"
                      type="number"
                      placeholder={calculateSampleSize()}
                      value={abConfig?.minSampleSize}
                      onChange={(e) => updateConfig('minSampleSize', e?.target?.value)}
                      description={`Recommended: ${calculateSampleSize()} leads`}
                    />
                    
                    <Select
                      label="Winner Selection"
                      options={winnerSelectionOptions}
                      value={abConfig?.winnerSelection}
                      onChange={(value) => updateConfig('winnerSelection', value)}
                    />
                  </div>

                  <Checkbox
                    label="Require Statistical Significance"
                    checked={abConfig?.statisticalSignificance}
                    onChange={(e) => updateConfig('statisticalSignificance', e?.target?.checked)}
                    description="Only declare winner when results are statistically significant"
                  />
                </div>

                {/* Success Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Success Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {successMetrics?.map(metric => (
                      <Checkbox
                        key={metric?.value}
                        label={metric?.label}
                        checked={abConfig?.testMetrics?.includes(metric?.value)}
                        onChange={() => toggleMetric(metric?.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Variants */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground">Test Variants</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateVariants}
                      >
                        <Icon name="Wand2" size={16} className="mr-2" />
                        Generate Sample
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={addVariant}
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        Add Variant
                      </Button>
                    </div>
                  </div>

                  {abConfig?.variants?.length === 0 ? (
                    <div className="text-center p-8 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                      <Icon name="TestTube" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-foreground mb-2">No Test Variants</h4>
                      <p className="text-muted-foreground mb-4">
                        Add at least 2 variants to start A/B testing your campaign
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleGenerateVariants}
                      >
                        <Icon name="Wand2" size={16} className="mr-2" />
                        Generate Sample Variants
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {abConfig?.variants?.map((variant, index) => (
                        <div key={variant?.id} className="bg-background border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                variant?.isControl ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <Input
                                type="text"
                                value={variant?.name}
                                onChange={(e) => updateVariant(variant?.id, 'name', e?.target?.value)}
                                className="font-medium"
                              />
                              {variant?.isControl && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Control
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                placeholder="50"
                                value={variant?.weight}
                                onChange={(e) => updateVariant(variant?.id, 'weight', e?.target?.value)}
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">%</span>
                              {!variant?.isControl && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeVariant(variant?.id)}
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <Input
                            label="Description"
                            type="text"
                            placeholder="What makes this variant different?"
                            value={variant?.description}
                            onChange={(e) => updateVariant(variant?.id, 'description', e?.target?.value)}
                            className="mb-3"
                          />
                          
                          <textarea
                            className="w-full px-3 py-2 border border-border rounded-md text-sm"
                            placeholder="Variant content (message, subject line, etc.)"
                            rows="3"
                            value={variant?.content}
                            onChange={(e) => updateVariant(variant?.id, 'content', e?.target?.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test Preview */}
                {abConfig?.variants?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Test Preview</h3>
                    
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Variants:</span>
                          <p className="font-medium">{abConfig?.variants?.length}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Test Duration:</span>
                          <p className="font-medium">{abConfig?.testDuration} days</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sample Size:</span>
                          <p className="font-medium">{abConfig?.minSampleSize} leads</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Primary Metric:</span>
                          <p className="font-medium capitalize">
                            {abConfig?.testMetrics?.[0]?.replace('_', ' ')}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence Level:</span>
                          <p className="font-medium">{abConfig?.confidenceLevel}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Winner Selection:</span>
                          <p className="font-medium capitalize">
                            {abConfig?.winnerSelection?.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {abConfig?.abTestEnabled ? (
                <span className="text-green-600">
                  ✓ A/B testing enabled with {abConfig?.variants?.length} variant(s)
                </span>
              ) : (
                <span className="text-gray-500">
                  A/B testing disabled
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
              >
                <Icon name="Save" size={16} className="mr-2" />
                Save A/B Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABTestingSetup;