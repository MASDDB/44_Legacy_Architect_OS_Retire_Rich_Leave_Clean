import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TriggerConfiguration = ({ config, onSave, onClose, isOpen }) => {
  const [triggerConfig, setTriggerConfig] = useState(config || {
    type: 'lead-created',
    conditions: [],
    delay: 0,
    enabled: true
  });

  const triggerTypes = [
    { value: 'lead-created', label: 'Lead Created' },
    { value: 'lead-updated', label: 'Lead Updated' },
    { value: 'appointment-missed', label: 'Appointment Missed' },
    { value: 'email-opened', label: 'Email Opened' },
    { value: 'email-clicked', label: 'Email Link Clicked' },
    { value: 'sms-replied', label: 'SMS Replied' },
    { value: 'form-submitted', label: 'Form Submitted' },
    { value: 'page-visited', label: 'Page Visited' },
    { value: 'custom-event', label: 'Custom Event' },
    { value: 'time-based', label: 'Time-based Trigger' },
    { value: 'lead-score-changed', label: 'Lead Score Changed' },
    { value: 'pipeline-stage-changed', label: 'Pipeline Stage Changed' }
  ];

  const conditionOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'is_empty', label: 'Is Empty' },
    { value: 'is_not_empty', label: 'Is Not Empty' }
  ];

  const leadFields = [
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'company', label: 'Company' },
    { value: 'industry', label: 'Industry' },
    { value: 'lead_source', label: 'Lead Source' },
    { value: 'lead_score', label: 'Lead Score' },
    { value: 'pipeline_stage', label: 'Pipeline Stage' },
    { value: 'tags', label: 'Tags' },
    { value: 'custom_field_1', label: 'Custom Field 1' },
    { value: 'custom_field_2', label: 'Custom Field 2' }
  ];

  const updateConfig = (key, value) => {
    setTriggerConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addCondition = () => {
    const newCondition = {
      id: Date.now(),
      field: 'first_name',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND' // AND/OR for multiple conditions
    };

    setTriggerConfig(prev => ({
      ...prev,
      conditions: [...prev?.conditions, newCondition]
    }));
  };

  const updateCondition = (conditionId, key, value) => {
    setTriggerConfig(prev => ({
      ...prev,
      conditions: prev?.conditions?.map(condition =>
        condition?.id === conditionId
          ? { ...condition, [key]: value }
          : condition
      )
    }));
  };

  const removeCondition = (conditionId) => {
    setTriggerConfig(prev => ({
      ...prev,
      conditions: prev?.conditions?.filter(condition => condition?.id !== conditionId)
    }));
  };

  const handleSave = () => {
    onSave(triggerConfig);
  };

  const handleTestTrigger = () => {
    // Simulate trigger testing
    alert('Trigger test successful! This trigger would activate based on your conditions.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Trigger Configuration</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Set up automated campaign triggers based on lead behavior and data changes
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
            {/* Basic Trigger Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Basic Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Trigger Type"
                  options={triggerTypes}
                  value={triggerConfig?.type}
                  onChange={(value) => updateConfig('type', value)}
                  description="Choose what event should trigger this campaign"
                />
                
                <Input
                  label="Initial Delay (minutes)"
                  type="number"
                  placeholder="0"
                  value={triggerConfig?.delay || ''}
                  onChange={(e) => updateConfig('delay', parseInt(e?.target?.value) || 0)}
                  description="Wait time before starting campaign"
                />
              </div>

              <Checkbox
                label="Enable this trigger"
                checked={triggerConfig?.enabled}
                onChange={(e) => updateConfig('enabled', e?.target?.checked)}
                description="Turn this trigger on or off"
              />
            </div>

            {/* Advanced Conditions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Conditions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCondition}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add Condition
                </Button>
              </div>

              {triggerConfig?.conditions?.length === 0 ? (
                <div className="text-center p-6 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                  <Icon name="GitBranch" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No conditions set. Campaign will trigger for all matching events.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {triggerConfig?.conditions?.map((condition, index) => (
                    <div key={condition?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="flex items-center space-x-2 mb-3">
                        {index > 0 && (
                          <Select
                            options={[
                              { value: 'AND', label: 'AND' },
                              { value: 'OR', label: 'OR' }
                            ]}
                            value={condition?.logicalOperator || 'AND'}
                            onChange={(value) => updateCondition(condition?.id, 'logicalOperator', value)}
                            className="w-20"
                          />
                        )}
                        <span className="text-sm font-medium text-foreground">
                          Condition {index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCondition(condition?.id)}
                          className="ml-auto"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <Select
                          label="Field"
                          options={leadFields}
                          value={condition?.field}
                          onChange={(value) => updateCondition(condition?.id, 'field', value)}
                        />
                        
                        <Select
                          label="Operator"
                          options={conditionOperators}
                          value={condition?.operator}
                          onChange={(value) => updateCondition(condition?.id, 'operator', value)}
                        />
                        
                        <Input
                          label="Value"
                          type="text"
                          placeholder="Enter value"
                          value={condition?.value}
                          onChange={(e) => updateCondition(condition?.id, 'value', e?.target?.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trigger Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Common Trigger Examples</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">New Lead Follow-up</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Automatically start campaign when new lead is created
                  </p>
                  <div className="text-xs text-blue-600">
                    <strong>Trigger:</strong> Lead Created<br/>
                    <strong>Delay:</strong> 5 minutes<br/>
                    <strong>Condition:</strong> Lead Source = "Website"
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Missed Appointment</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Re-engage leads who missed their appointment
                  </p>
                  <div className="text-xs text-green-600">
                    <strong>Trigger:</strong> Appointment Missed<br/>
                    <strong>Delay:</strong> 30 minutes<br/>
                    <strong>Condition:</strong> Pipeline Stage = "Qualified"
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Email Engagement</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Follow up when leads open or click emails
                  </p>
                  <div className="text-xs text-purple-600">
                    <strong>Trigger:</strong> Email Opened<br/>
                    <strong>Delay:</strong> 2 hours<br/>
                    <strong>Condition:</strong> Industry = "Solar"
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Lead Score Increase</h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Trigger campaigns when lead score increases
                  </p>
                  <div className="text-xs text-orange-600">
                    <strong>Trigger:</strong> Lead Score Changed<br/>
                    <strong>Delay:</strong> 0 minutes<br/>
                    <strong>Condition:</strong> Lead Score &gt; 75
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleTestTrigger}
            >
              <Icon name="Play" size={16} className="mr-2" />
              Test Trigger
            </Button>
            
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
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerConfiguration;