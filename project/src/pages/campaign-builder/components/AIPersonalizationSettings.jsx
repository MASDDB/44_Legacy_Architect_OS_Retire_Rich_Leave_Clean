import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import { Settings, Brain, Zap, Target, Clock, Save } from 'lucide-react';
import { aiPersonalizationService } from '../../../services/aiPersonalizationService';

const AIPersonalizationSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    default_ai_model: 'gpt-5',
    enable_behavioral_personalization: true,
    enable_demographic_personalization: true,
    enable_engagement_personalization: true,
    enable_timing_optimization: true,
    max_processing_time_ms: 5000,
    fallback_to_original: true,
    api_settings: {
      max_tokens: 500,
      reasoning_effort: 'medium',
      verbosity: 'medium'
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await aiPersonalizationService?.getPersonalizationSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await aiPersonalizationService?.updatePersonalizationSettings(settings);
      setSuccess('Settings saved successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const aiModels = [
    { value: 'gpt-5', label: 'GPT-5 (Best Quality)' },
    { value: 'gpt-5-mini', label: 'GPT-5 Mini (Fast & Efficient)' },
    { value: 'gpt-5-nano', label: 'GPT-5 Nano (Ultra Fast)' },
    { value: 'gpt-4o', label: 'GPT-4o (Multimodal)' },
    { value: 'claude-3.5', label: 'Claude 3.5 Sonnet' }
  ];

  const reasoningEffortOptions = [
    { value: 'minimal', label: 'Minimal - Fastest' },
    { value: 'low', label: 'Low - Quick' },
    { value: 'medium', label: 'Medium - Balanced' },
    { value: 'high', label: 'High - Deep Thinking' }
  ];

  const verbosityOptions = [
    { value: 'low', label: 'Concise' },
    { value: 'medium', label: 'Balanced' },
    { value: 'high', label: 'Detailed' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Personalization Settings</h2>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
      <div className="space-y-6">
        {/* Default AI Model */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="h-4 w-4 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">AI Model Configuration</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Default AI Model"
              value={settings?.default_ai_model}
              onChange={(value) => setSettings({ ...settings, default_ai_model: value })}
              options={aiModels}
            />
            <Input
              label="Max Processing Time (ms)"
              type="number"
              min="1000"
              max="30000"
              step="1000"
              value={settings?.max_processing_time_ms}
              onChange={(e) => setSettings({ 
                ...settings, 
                max_processing_time_ms: parseInt(e?.target?.value) 
              })}
            />
          </div>
        </div>

        {/* Personalization Features */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Target className="h-4 w-4 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Personalization Features</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={settings?.enable_behavioral_personalization}
                  onChange={(checked) => setSettings({ 
                    ...settings, 
                    enable_behavioral_personalization: checked 
                  })}
                />
                <label className="text-sm text-gray-700">Behavioral Personalization</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={settings?.enable_demographic_personalization}
                  onChange={(checked) => setSettings({ 
                    ...settings, 
                    enable_demographic_personalization: checked 
                  })}
                />
                <label className="text-sm text-gray-700">Demographic Personalization</label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={settings?.enable_engagement_personalization}
                  onChange={(checked) => setSettings({ 
                    ...settings, 
                    enable_engagement_personalization: checked 
                  })}
                />
                <label className="text-sm text-gray-700">Engagement Personalization</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={settings?.enable_timing_optimization}
                  onChange={(checked) => setSettings({ 
                    ...settings, 
                    enable_timing_optimization: checked 
                  })}
                />
                <label className="text-sm text-gray-700">Timing Optimization</label>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced AI Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="h-4 w-4 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Advanced AI Settings</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Max Tokens"
              type="number"
              min="100"
              max="1000"
              step="50"
              value={settings?.api_settings?.max_tokens || 500}
              onChange={(e) => setSettings({ 
                ...settings, 
                api_settings: {
                  ...settings?.api_settings,
                  max_tokens: parseInt(e?.target?.value)
                }
              })}
            />
            <Select
              label="Reasoning Effort"
              value={settings?.api_settings?.reasoning_effort || 'medium'}
              onChange={(value) => setSettings({ 
                ...settings, 
                api_settings: {
                  ...settings?.api_settings,
                  reasoning_effort: value
                }
              })}
              options={reasoningEffortOptions}
            />
            <Select
              label="Response Verbosity"
              value={settings?.api_settings?.verbosity || 'medium'}
              onChange={(value) => setSettings({ 
                ...settings, 
                api_settings: {
                  ...settings?.api_settings,
                  verbosity: value
                }
              })}
              options={verbosityOptions}
            />
          </div>
        </div>

        {/* Fallback Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Fallback & Safety</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={settings?.fallback_to_original}
              onChange={(checked) => setSettings({ 
                ...settings, 
                fallback_to_original: checked 
              })}
            />
            <label className="text-sm text-gray-700">
              Fallback to original message if AI personalization fails
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Recommended to keep enabled to ensure message delivery even if personalization encounters errors
          </p>
        </div>

        {/* Cost Estimation */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Cost Estimation</h4>
          <div className="text-sm text-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Current Model:</span> {settings?.default_ai_model}
              </div>
              <div>
                <span className="font-medium">Estimated cost per message:</span> ~$0.002-0.008
              </div>
              <div>
                <span className="font-medium">Processing time:</span> {settings?.max_processing_time_ms}ms max
              </div>
              <div>
                <span className="font-medium">Monthly est. (1000 messages):</span> ~$2-8
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIPersonalizationSettings;