import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const RoyaltyConfiguration = ({ selectedReseller, onSave, onCancel }) => {
  const [config, setConfig] = useState({
    commissionType: selectedReseller?.royalty?.commissionType || 'percentage',
    commissionRate: selectedReseller?.royalty?.commissionRate || 20,
    flatFeeAmount: selectedReseller?.royalty?.flatFeeAmount || 100,
    payoutFrequency: selectedReseller?.royalty?.payoutFrequency || 'monthly',
    minimumPayout: selectedReseller?.royalty?.minimumPayout || 100,
    paymentMethod: selectedReseller?.royalty?.paymentMethod || 'stripe',
    stripeAccountId: selectedReseller?.royalty?.stripeAccountId || '',
    autoPayouts: selectedReseller?.royalty?.autoPayouts || true,
    tieredCommission: selectedReseller?.royalty?.tieredCommission || false,
    tiers: selectedReseller?.royalty?.tiers || [
      { threshold: 0, rate: 20 },
      { threshold: 10000, rate: 25 },
      { threshold: 25000, rate: 30 }
    ],
    bonusStructure: selectedReseller?.royalty?.bonusStructure || false,
    bonuses: selectedReseller?.royalty?.bonuses || [
      { milestone: 'first_sale', amount: 500, description: 'First sale bonus' },
      { milestone: 'monthly_target', amount: 1000, description: 'Monthly target bonus' }
    ]
  });

  const [activeTab, setActiveTab] = useState('basic');

  const payoutFrequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const paymentMethodOptions = [
    { value: 'stripe', label: 'Stripe Connect' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' }
  ];

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...config?.tiers];
    newTiers[index] = { ...newTiers?.[index], [field]: value };
    setConfig(prev => ({
      ...prev,
      tiers: newTiers
    }));
  };

  const addTier = () => {
    setConfig(prev => ({
      ...prev,
      tiers: [...prev?.tiers, { threshold: 0, rate: 20 }]
    }));
  };

  const removeTier = (index) => {
    setConfig(prev => ({
      ...prev,
      tiers: prev?.tiers?.filter((_, i) => i !== index)
    }));
  };

  const handleBonusChange = (index, field, value) => {
    const newBonuses = [...config?.bonuses];
    newBonuses[index] = { ...newBonuses?.[index], [field]: value };
    setConfig(prev => ({
      ...prev,
      bonuses: newBonuses
    }));
  };

  const addBonus = () => {
    setConfig(prev => ({
      ...prev,
      bonuses: [...prev?.bonuses, { milestone: '', amount: 0, description: '' }]
    }));
  };

  const removeBonus = (index) => {
    setConfig(prev => ({
      ...prev,
      bonuses: prev?.bonuses?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(config);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Settings', icon: 'Settings' },
    { id: 'tiers', label: 'Tiered Commission', icon: 'TrendingUp' },
    { id: 'bonuses', label: 'Bonus Structure', icon: 'Gift' },
    { id: 'payment', label: 'Payment Setup', icon: 'CreditCard' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Royalty Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Configure commission structure for {selectedReseller?.company}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="font-medium">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Commission Type */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">Commission Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  config?.commissionType === 'percentage' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`} onClick={() => handleInputChange('commissionType', 'percentage')}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="commissionType"
                      value="percentage"
                      checked={config?.commissionType === 'percentage'}
                      onChange={() => handleInputChange('commissionType', 'percentage')}
                      className="text-primary"
                    />
                    <div>
                      <h4 className="font-medium text-foreground">Percentage Commission</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn a percentage of each sale
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  config?.commissionType === 'flat' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`} onClick={() => handleInputChange('commissionType', 'flat')}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="commissionType"
                      value="flat"
                      checked={config?.commissionType === 'flat'}
                      onChange={() => handleInputChange('commissionType', 'flat')}
                      className="text-primary"
                    />
                    <div>
                      <h4 className="font-medium text-foreground">Flat Fee Commission</h4>
                      <p className="text-sm text-muted-foreground">
                        Fixed amount per sale
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Rate/Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config?.commissionType === 'percentage' ? (
                <Input
                  label="Commission Rate (%)"
                  type="number"
                  value={config?.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', parseFloat(e?.target?.value))}
                  placeholder="20"
                  description="Percentage of each sale"
                />
              ) : (
                <Input
                  label="Flat Fee Amount ($)"
                  type="number"
                  value={config?.flatFeeAmount}
                  onChange={(e) => handleInputChange('flatFeeAmount', parseFloat(e?.target?.value))}
                  placeholder="100"
                  description="Fixed amount per sale"
                />
              )}

              <Select
                label="Payout Frequency"
                options={payoutFrequencyOptions}
                value={config?.payoutFrequency}
                onChange={(value) => handleInputChange('payoutFrequency', value)}
                description="How often payouts are processed"
              />
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Minimum Payout ($)"
                type="number"
                value={config?.minimumPayout}
                onChange={(e) => handleInputChange('minimumPayout', parseFloat(e?.target?.value))}
                placeholder="100"
                description="Minimum amount before payout"
              />
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">Advanced Options</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Enable Tiered Commission"
                  checked={config?.tieredCommission}
                  onChange={(e) => handleInputChange('tieredCommission', e?.target?.checked)}
                  description="Higher commission rates for higher sales volumes"
                />
                <Checkbox
                  label="Enable Bonus Structure"
                  checked={config?.bonusStructure}
                  onChange={(e) => handleInputChange('bonusStructure', e?.target?.checked)}
                  description="Additional bonuses for achieving milestones"
                />
                <Checkbox
                  label="Automatic Payouts"
                  checked={config?.autoPayouts}
                  onChange={(e) => handleInputChange('autoPayouts', e?.target?.checked)}
                  description="Automatically process payouts when due"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-foreground">Tiered Commission Structure</h3>
                <p className="text-sm text-muted-foreground">
                  Set different commission rates based on sales volume
                </p>
              </div>
              <Button variant="outline" onClick={addTier} disabled={!config?.tieredCommission}>
                <Icon name="Plus" size={16} />
                Add Tier
              </Button>
            </div>

            {!config?.tieredCommission && (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enable tiered commission in Basic Settings to configure tiers
                </p>
              </div>
            )}

            {config?.tieredCommission && (
              <div className="space-y-4">
                {config?.tiers?.map((tier, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-foreground">Tier {index + 1}</h4>
                      {config?.tiers?.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTier(index)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Sales Threshold ($)"
                        type="number"
                        value={tier?.threshold}
                        onChange={(e) => handleTierChange(index, 'threshold', parseFloat(e?.target?.value))}
                        placeholder="0"
                        description="Minimum sales to reach this tier"
                      />
                      <Input
                        label="Commission Rate (%)"
                        type="number"
                        value={tier?.rate}
                        onChange={(e) => handleTierChange(index, 'rate', parseFloat(e?.target?.value))}
                        placeholder="20"
                        description="Commission rate for this tier"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bonuses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-foreground">Bonus Structure</h3>
                <p className="text-sm text-muted-foreground">
                  Set milestone bonuses to incentivize performance
                </p>
              </div>
              <Button variant="outline" onClick={addBonus} disabled={!config?.bonusStructure}>
                <Icon name="Plus" size={16} />
                Add Bonus
              </Button>
            </div>

            {!config?.bonusStructure && (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enable bonus structure in Basic Settings to configure bonuses
                </p>
              </div>
            )}

            {config?.bonusStructure && (
              <div className="space-y-4">
                {config?.bonuses?.map((bonus, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-foreground">Bonus {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBonus(index)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Milestone"
                        type="text"
                        value={bonus?.milestone}
                        onChange={(e) => handleBonusChange(index, 'milestone', e?.target?.value)}
                        placeholder="first_sale"
                        description="Milestone identifier"
                      />
                      <Input
                        label="Bonus Amount ($)"
                        type="number"
                        value={bonus?.amount}
                        onChange={(e) => handleBonusChange(index, 'amount', parseFloat(e?.target?.value))}
                        placeholder="500"
                        description="Bonus amount"
                      />
                      <Input
                        label="Description"
                        type="text"
                        value={bonus?.description}
                        onChange={(e) => handleBonusChange(index, 'description', e?.target?.value)}
                        placeholder="First sale bonus"
                        description="Bonus description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-base font-medium text-foreground">Payment Setup</h3>
            
            <Select
              label="Payment Method"
              options={paymentMethodOptions}
              value={config?.paymentMethod}
              onChange={(value) => handleInputChange('paymentMethod', value)}
              description="How payments will be processed"
            />

            {config?.paymentMethod === 'stripe' && (
              <div className="space-y-4">
                <Input
                  label="Stripe Connect Account ID"
                  type="text"
                  value={config?.stripeAccountId}
                  onChange={(e) => handleInputChange('stripeAccountId', e?.target?.value)}
                  placeholder="acct_xxxxxxxxxx"
                  description="Stripe Connect account for automated payouts"
                />
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="Info" size={16} className="text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">Stripe Connect Setup</h4>
                      <p className="text-sm text-primary/80 mt-1">
                        The reseller needs to complete Stripe Connect onboarding to receive automated payouts.
                        They will receive an email with setup instructions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {config?.paymentMethod === 'paypal' && (
              <Input
                label="PayPal Email"
                type="email"
                placeholder="payments@company.com"
                description="PayPal account email for payments"
              />
            )}

            {config?.paymentMethod === 'bank_transfer' && (
              <div className="space-y-4">
                <Input
                  label="Bank Account Number"
                  type="text"
                  placeholder="Account number"
                  description="Bank account for transfers"
                />
                <Input
                  label="Routing Number"
                  type="text"
                  placeholder="Routing number"
                  description="Bank routing number"
                />
              </div>
            )}

            {config?.paymentMethod === 'check' && (
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning">Manual Processing Required</h4>
                    <p className="text-sm text-warning/80 mt-1">
                      Check payments require manual processing and may delay payouts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-muted/30 rounded-lg border border-border p-6">
              <h4 className="font-medium text-foreground mb-4">Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission Type:</span>
                  <span className="text-foreground capitalize">{config?.commissionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate/Amount:</span>
                  <span className="text-foreground">
                    {config?.commissionType === 'percentage' 
                      ? `${config?.commissionRate}%` 
                      : `$${config?.flatFeeAmount}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payout Frequency:</span>
                  <span className="text-foreground capitalize">{config?.payoutFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Payout:</span>
                  <span className="text-foreground">${config?.minimumPayout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="text-foreground capitalize">{config?.paymentMethod?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoyaltyConfiguration;