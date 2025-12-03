import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConditionalLogicBuilder = ({ config, onSave, onClose, isOpen }) => {
  const [logicConfig, setLogicConfig] = useState(config || {
    enabled: false,
    rules: []
  });

  const conditionTypes = [
    { value: 'lead_responded', label: 'Lead Responded' },
    { value: 'lead_not_responded', label: 'Lead Did Not Respond' },
    { value: 'appointment_booked', label: 'Appointment Booked' },
    { value: 'appointment_not_booked', label: 'Appointment Not Booked' },
    { value: 'email_opened', label: 'Email Opened' },
    { value: 'email_not_opened', label: 'Email Not Opened' },
    { value: 'email_clicked', label: 'Email Link Clicked' },
    { value: 'sms_replied', label: 'SMS Replied' },
    { value: 'lead_score_above', label: 'Lead Score Above' },
    { value: 'lead_score_below', label: 'Lead Score Below' },
    { value: 'pipeline_stage', label: 'Pipeline Stage Equals' },
    { value: 'custom_field', label: 'Custom Field Condition' },
    { value: 'time_since_last_contact', label: 'Time Since Last Contact' },
    { value: 'channel_preference', label: 'Channel Preference' }
  ];

  const actionTypes = [
    { value: 'send_message', label: 'Send Message' },
    { value: 'wait', label: 'Wait' },
    { value: 'add_tag', label: 'Add Tag' },
    { value: 'remove_tag', label: 'Remove Tag' },
    { value: 'update_field', label: 'Update Field' },
    { value: 'assign_to_user', label: 'Assign to User' },
    { value: 'move_to_stage', label: 'Move to Pipeline Stage' },
    { value: 'end_campaign', label: 'End Campaign' },
    { value: 'start_new_campaign', label: 'Start New Campaign' },
    { value: 'schedule_call', label: 'Schedule Call' },
    { value: 'create_task', label: 'Create Task' },
    { value: 'send_notification', label: 'Send Internal Notification' }
  ];

  const messageChannels = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'voice', label: 'Voice Call' }
  ];

  const timeUnits = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' }
  ];

  const updateConfig = (key, value) => {
    setLogicConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addRule = () => {
    const newRule = {
      id: Date.now(),
      name: `Rule ${logicConfig?.rules?.length + 1}`,
      condition: {
        type: 'lead_responded',
        value: '',
        timeframe: 24,
        timeUnit: 'hours'
      },
      trueAction: {
        type: 'send_message',
        channel: 'email',
        message: '',
        delay: 0,
        delayUnit: 'minutes'
      },
      falseAction: {
        type: 'wait',
        delay: 1,
        delayUnit: 'hours'
      },
      enabled: true
    };

    setLogicConfig(prev => ({
      ...prev,
      rules: [...prev?.rules, newRule]
    }));
  };

  const updateRule = (ruleId, path, value) => {
    setLogicConfig(prev => ({
      ...prev,
      rules: prev?.rules?.map(rule => {
        if (rule?.id === ruleId) {
          const keys = path?.split('.');
          const updatedRule = { ...rule };
          let current = updatedRule;
          
          for (let i = 0; i < keys?.length - 1; i++) {
            current = current?.[keys?.[i]];
          }
          current[keys[keys.length - 1]] = value;
          
          return updatedRule;
        }
        return rule;
      })
    }));
  };

  const removeRule = (ruleId) => {
    setLogicConfig(prev => ({
      ...prev,
      rules: prev?.rules?.filter(rule => rule?.id !== ruleId)
    }));
  };

  const duplicateRule = (ruleId) => {
    const ruleToDuplicate = logicConfig?.rules?.find(rule => rule?.id === ruleId);
    if (ruleToDuplicate) {
      const duplicatedRule = {
        ...ruleToDuplicate,
        id: Date.now(),
        name: `${ruleToDuplicate?.name} (Copy)`
      };
      
      setLogicConfig(prev => ({
        ...prev,
        rules: [...prev?.rules, duplicatedRule]
      }));
    }
  };

  const handleSave = () => {
    onSave(logicConfig);
  };

  const handleTestRule = (ruleId) => {
    const rule = logicConfig?.rules?.find(r => r?.id === ruleId);
    alert(`Testing rule: "${rule?.name}"\n\nThis rule would check: ${rule?.condition?.type} and execute the appropriate action based on the result.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Conditional Logic Builder</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create smart campaign flows that adapt based on lead behavior and responses
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
            {/* Enable Conditional Logic */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <h3 className="text-lg font-medium text-foreground">Enable Conditional Logic</h3>
                <p className="text-sm text-muted-foreground">
                  Turn on smart decision-making in your campaigns
                </p>
              </div>
              <Checkbox
                label=""
                checked={logicConfig?.enabled}
                onChange={(e) => updateConfig('enabled', e?.target?.checked)}
              />
            </div>

            {/* Rules Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Logic Rules</h3>
                <Button
                  variant="default"
                  size="sm"
                  onClick={addRule}
                  disabled={!logicConfig?.enabled}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add Rule
                </Button>
              </div>

              {logicConfig?.rules?.length === 0 ? (
                <div className="text-center p-8 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                  <Icon name="GitBranch" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">No Logic Rules</h4>
                  <p className="text-muted-foreground mb-4">
                    Add conditional logic rules to make your campaigns smarter and more responsive
                  </p>
                  <Button
                    variant="outline"
                    onClick={addRule}
                    disabled={!logicConfig?.enabled}
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Create First Rule
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {logicConfig?.rules?.map((rule, index) => (
                    <div key={rule?.id} className="bg-background border border-border rounded-lg p-6">
                      {/* Rule Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{index + 1}</span>
                          </div>
                          <Input
                            type="text"
                            value={rule?.name}
                            onChange={(e) => updateRule(rule?.id, 'name', e?.target?.value)}
                            className="font-medium"
                          />
                          <Checkbox
                            label="Enabled"
                            checked={rule?.enabled}
                            onChange={(e) => updateRule(rule?.id, 'enabled', e?.target?.checked)}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTestRule(rule?.id)}
                          >
                            <Icon name="Play" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => duplicateRule(rule?.id)}
                          >
                            <Icon name="Copy" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRule(rule?.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Condition Section */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-foreground mb-3 flex items-center">
                          <Icon name="HelpCircle" size={16} className="mr-2" />
                          IF Condition
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Select
                              label="Condition Type"
                              options={conditionTypes}
                              value={rule?.condition?.type}
                              onChange={(value) => updateRule(rule?.id, 'condition.type', value)}
                            />
                            
                            {(rule?.condition?.type?.includes('score') || rule?.condition?.type === 'custom_field') && (
                              <Input
                                label="Value"
                                type="text"
                                placeholder="Enter value"
                                value={rule?.condition?.value}
                                onChange={(e) => updateRule(rule?.id, 'condition.value', e?.target?.value)}
                              />
                            )}
                            
                            <Input
                              label="Timeframe"
                              type="number"
                              placeholder="24"
                              value={rule?.condition?.timeframe}
                              onChange={(e) => updateRule(rule?.id, 'condition.timeframe', e?.target?.value)}
                            />
                            
                            <Select
                              label="Time Unit"
                              options={timeUnits}
                              value={rule?.condition?.timeUnit}
                              onChange={(value) => updateRule(rule?.id, 'condition.timeUnit', value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* True Action */}
                        <div>
                          <h4 className="text-md font-medium text-foreground mb-3 flex items-center">
                            <Icon name="CheckCircle" size={16} className="mr-2 text-green-500" />
                            THEN Action (True)
                          </h4>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                            <Select
                              label="Action Type"
                              options={actionTypes}
                              value={rule?.trueAction?.type}
                              onChange={(value) => updateRule(rule?.id, 'trueAction.type', value)}
                            />
                            
                            {rule?.trueAction?.type === 'send_message' && (
                              <Select
                                label="Channel"
                                options={messageChannels}
                                value={rule?.trueAction?.channel}
                                onChange={(value) => updateRule(rule?.id, 'trueAction.channel', value)}
                              />
                            )}
                            
                            {(rule?.trueAction?.type === 'wait' || rule?.trueAction?.type === 'send_message') && (
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  label="Delay"
                                  type="number"
                                  placeholder="0"
                                  value={rule?.trueAction?.delay}
                                  onChange={(e) => updateRule(rule?.id, 'trueAction.delay', e?.target?.value)}
                                />
                                <Select
                                  label="Unit"
                                  options={timeUnits}
                                  value={rule?.trueAction?.delayUnit}
                                  onChange={(value) => updateRule(rule?.id, 'trueAction.delayUnit', value)}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* False Action */}
                        <div>
                          <h4 className="text-md font-medium text-foreground mb-3 flex items-center">
                            <Icon name="XCircle" size={16} className="mr-2 text-red-500" />
                            ELSE Action (False)
                          </h4>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                            <Select
                              label="Action Type"
                              options={actionTypes}
                              value={rule?.falseAction?.type}
                              onChange={(value) => updateRule(rule?.id, 'falseAction.type', value)}
                            />
                            
                            {rule?.falseAction?.type === 'send_message' && (
                              <Select
                                label="Channel"
                                options={messageChannels}
                                value={rule?.falseAction?.channel}
                                onChange={(value) => updateRule(rule?.id, 'falseAction.channel', value)}
                              />
                            )}
                            
                            {(rule?.falseAction?.type === 'wait' || rule?.falseAction?.type === 'send_message') && (
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  label="Delay"
                                  type="number"
                                  placeholder="1"
                                  value={rule?.falseAction?.delay}
                                  onChange={(e) => updateRule(rule?.id, 'falseAction.delay', e?.target?.value)}
                                />
                                <Select
                                  label="Unit"
                                  options={timeUnits}
                                  value={rule?.falseAction?.delayUnit}
                                  onChange={(value) => updateRule(rule?.id, 'falseAction.delayUnit', value)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {logicConfig?.enabled ? (
                <span className="text-green-600">
                  ✓ Conditional logic enabled with {logicConfig?.rules?.length} rule(s)
                </span>
              ) : (
                <span className="text-gray-500">
                  Conditional logic disabled
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
                Save Logic Rules
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionalLogicBuilder;