import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Brain, Wand2, Plus, Edit } from 'lucide-react';
import { aiPersonalizationService } from '../../../services/aiPersonalizationService';

const AIPersonalizationPanel = ({ campaignId, messageType = 'sms', onPersonalizationApplied }) => {
  const [rules, setRules] = useState([]);
  const [settings, setSettings] = useState(null);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    personalizationType: 'engagement',
    aiModel: 'gpt-5',
    conditions: {},
    templateVariables: {},
    promptTemplate: '',
    isActive: true,
    priority: 1
  });

  useEffect(() => {
    loadPersonalizationRules();
    loadPersonalizationSettings();
  }, []);

  const loadPersonalizationRules = async () => {
    try {
      const rulesData = await aiPersonalizationService.getPersonalizationRules();
      setRules(rulesData);
    } catch (error) {
      console.error('Error loading personalization rules:', error);
      setError('Failed to load personalization rules');
    }
  };

  const loadPersonalizationSettings = async () => {
    try {
      const settingsData = await aiPersonalizationService.getPersonalizationSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading personalization settings:', error);
    }
  };

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.promptTemplate) {
      setError('Name and prompt template are required');
      return;
    }

    try {
      setLoading(true);
      const createdRule = await aiPersonalizationService.createPersonalizationRule(newRule);
      setRules([createdRule, ...rules]);
      setNewRule({
        name: '',
        description: '',
        personalizationType: 'engagement',
        aiModel: 'gpt-5',
        conditions: {},
        templateVariables: {},
        promptTemplate: '',
        isActive: true,
        priority: 1
      });
      setShowRuleEditor(false);
      setError('');
    } catch (error) {
      console.error('Error creating rule:', error);
      setError('Failed to create personalization rule');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (rule) => {
    try {
      // In a real implementation, you would update the rule's active status
      console.log('Toggle rule:', rule.id);
      // For now, just update local state
      setRules(rules.map(r => 
        r.id === rule.id ? { ...r, is_active: !r.is_active } : r
      ));
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const handlePreviewPersonalization = async () => {
    if (!rules.find(r => r.is_active)) {
      setError('Please activate at least one personalization rule');
      return;
    }

    try {
      setPreviewMode(true);
      setLoading(true);

      // Mock lead ID for preview - in real implementation, this would come from context
      const mockLeadId = 'efc081c0-e5b0-4bc5-aecc-f28af47a5a28';
      const originalTemplate = 'Hi {{first_name}}, we have an exciting offer for {{job_title}}s like yourself!';

      const result = await aiPersonalizationService.personalizeMessage({
        leadId: mockLeadId,
        campaignId: campaignId,
        messageType: messageType,
        originalTemplate: originalTemplate,
        personalizationRules: rules.filter(r => r.is_active),
        aiModel: settings?.default_ai_model || 'gpt-5'
      });

      setPreviewResult(result);
      if (onPersonalizationApplied) {
        onPersonalizationApplied(result);
      }
    } catch (error) {
      console.error('Error previewing personalization:', error);
      setError('Failed to preview personalization');
    } finally {
      setLoading(false);
    }
  };

  const personalizationTypes = [
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'demographic', label: 'Demographic' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'timing', label: 'Timing' },
    { value: 'content_preference', label: 'Content Preference' },
    { value: 'lead_score', label: 'Lead Score' }
  ];

  const aiModels = [
    { value: 'gpt-5', label: 'GPT-5 (Best Quality)' },
    { value: 'gpt-5-mini', label: 'GPT-5 Mini (Fast)' },
    { value: 'gpt-5-nano', label: 'GPT-5 Nano (Ultra Fast)' },
    { value: 'gpt-4o', label: 'GPT-4o (Multimodal)' },
    { value: 'claude-3.5', label: 'Claude 3.5 Sonnet' }
  ];

  const defaultPromptTemplates = {
    engagement: 'Generate a personalized message for {{first_name}} who works as {{job_title}}. Their engagement shows {{engagement_trend}} with {{email_open_rate}} email open rate. Use an enthusiastic tone.',
    demographic: 'Create a professional message for {{first_name}}, {{job_title}} at {{company}}. Focus on industry-specific benefits relevant to their role.',
    behavioral: 'Craft a message for {{first_name}} referencing their recent activity: {{recent_activities}}. Use high personalization based on their behavior patterns.',
    timing: 'Generate a time-sensitive message for {{first_name}} optimized for their typical engagement patterns. Include urgency appropriate for {{job_title}}.',
    content_preference: 'Create content for {{first_name}} based on their demonstrated preferences: {{content_interests}}. Match their preferred communication style.',
    lead_score: 'Generate a message for {{first_name}} with {{lead_score}} lead score. Adjust messaging intensity based on their qualification level.'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Message Personalization</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRuleEditor(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Rule</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePreviewPersonalization}
              disabled={loading || rules.filter(r => r.is_active).length === 0}
              className="flex items-center space-x-2"
            >
              <Wand2 className="h-4 w-4" />
              <span>{loading ? 'Processing...' : 'Preview Personalization'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Personalization Rules */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Active Personalization Rules</h4>
          
          {rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No personalization rules configured</p>
              <p className="text-sm">Create your first rule to start personalizing messages</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {rules.map((rule) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={rule.is_active}
                          onChange={() => handleToggleRule(rule)}
                        />
                        <div>
                          <h5 className="font-medium text-gray-900">{rule.name}</h5>
                          <p className="text-sm text-gray-500">{rule.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">Type: {rule.personalization_type}</span>
                        <span>Model: {rule.ai_model}</span>
                        <span>Priority: {rule.priority}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {rule.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingRule(rule);
                          setShowRuleEditor(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Results */}
        {previewResult && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Personalization Preview</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-blue-700">Personalized Message:</label>
                <p className="mt-1 text-sm text-blue-800 bg-white p-3 rounded border">
                  {previewResult.personalizedContent}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-blue-700">
                <span>Confidence Score: {(previewResult.confidence * 100).toFixed(1)}%</span>
                <span>Processing Time: {previewResult.processingTime}ms</span>
                {previewResult.ruleUsed && (
                  <span>Rule: {previewResult.ruleUsed.name}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rule Editor Modal */}
      {showRuleEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRule ? 'Edit Personalization Rule' : 'Create Personalization Rule'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Rule Name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., High Engagement Personalization"
                />
                <Select
                  label="Personalization Type"
                  value={newRule.personalizationType}
                  onChange={(value) => {
                    setNewRule({ 
                      ...newRule, 
                      personalizationType: value,
                      promptTemplate: defaultPromptTemplates[value] || ''
                    });
                  }}
                  options={personalizationTypes}
                />
              </div>

              <Input
                label="Description"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="Describe what this rule does and when to use it"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="AI Model"
                  value={newRule.aiModel}
                  onChange={(value) => setNewRule({ ...newRule, aiModel: value })}
                  options={aiModels}
                />
                <Input
                  label="Priority"
                  type="number"
                  min="1"
                  max="10"
                  value={newRule.priority}
                  onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt Template
                </label>
                <textarea
                  className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={newRule.promptTemplate}
                  onChange={(e) => setNewRule({ ...newRule, promptTemplate: e.target.value })}
                  placeholder="Enter the AI prompt template with variables like {{first_name}}, {{job_title}}, etc."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use variables like {"{first_name}"}, {"{job_title}"}, {"{engagement_trend}"}, {"{company}"}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newRule.isActive}
                  onChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                />
                <label className="text-sm text-gray-700">Activate this rule immediately</label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRuleEditor(false);
                  setEditingRule(null);
                  setNewRule({
                    name: '',
                    description: '',
                    personalizationType: 'engagement',
                    aiModel: 'gpt-5',
                    conditions: {},
                    templateVariables: {},
                    promptTemplate: '',
                    isActive: true,
                    priority: 1
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateRule}
                disabled={loading}
              >
                {loading ? 'Creating...' : editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPersonalizationPanel;