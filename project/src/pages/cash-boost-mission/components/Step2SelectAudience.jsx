import React, { useState, useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { supabase } from '../../../lib/supabase';

export default function Step2SelectAudience({ campaignData, updateCampaignData, onNext, onBack }) {
  const [totalCount, setTotalCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudienceData();
  }, [campaignData.audienceFilters]);

  const loadAudienceData = async () => {
    try {
      setLoading(true);

      const { count: total } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      setTotalCount(total || 0);

      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - campaignData.audienceFilters.lastJobMonthsAgo);

      const excludeDate = new Date();
      excludeDate.setDate(excludeDate.getDate() - campaignData.audienceFilters.excludeContactedDays);

      let query = supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .lt('last_contact', cutoffDate.toISOString());

      if (campaignData.audienceFilters.minJobValue > 0) {
        query = query.gte('lifetime_value', campaignData.audienceFilters.minJobValue);
      }

      const { count: filtered } = await query;
      setFilteredCount(filtered || 0);

      updateCampaignData({ audienceSize: filtered || 0 });
    } catch (error) {
      console.error('Error loading audience data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    updateCampaignData({
      audienceFilters: {
        ...campaignData.audienceFilters,
        [field]: value
      }
    });
  };

  const handleSourceChange = (value) => {
    updateCampaignData({ audienceSource: value });
  };

  const handleContinue = () => {
    if (!campaignData.audienceSource) {
      alert('Please select an audience source to continue');
      return;
    }
    if (filteredCount === 0) {
      alert('Your filters have excluded all contacts. Please adjust your filters.');
      return;
    }
    onNext();
  };

  const reachableCount = Math.round(filteredCount * 0.85);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Who should we contact?
        </h2>
        <p className="text-gray-600">
          We'll never message anyone you don't approve. You stay in control of the list.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pick your list
          </label>
          <Select
            value={campaignData.audienceSource}
            onChange={(e) => handleSourceChange(e.target.value)}
            options={[
              { value: '', label: 'Select a source...' },
              { value: 'integrations', label: 'Use my customer list from integrations' },
              { value: 'csv', label: 'Use an imported CSV' },
              { value: 'past_campaign', label: 'Reuse a past campaign audience' }
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Filter your audience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last job more than (months ago)
              </label>
              <Input
                type="number"
                value={campaignData.audienceFilters.lastJobMonthsAgo}
                onChange={(e) => handleFilterChange('lastJobMonthsAgo', parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exclude anyone contacted in the last (days)
              </label>
              <Input
                type="number"
                value={campaignData.audienceFilters.excludeContactedDays}
                onChange={(e) => handleFilterChange('excludeContactedDays', parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum past job value (optional)
              </label>
              <Input
                type="number"
                value={campaignData.audienceFilters.minJobValue}
                onChange={(e) => handleFilterChange('minJobValue', parseFloat(e.target.value))}
                min="0"
                step="50"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Audience summary
              </h3>
              {loading ? (
                <p className="text-gray-500">Loading audience data...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Total customers on list:</span> {totalCount.toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Contacts that match your filters:</span> {filteredCount.toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Estimated reachable contacts:</span> {reachableCount.toLocaleString()}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-3">
                You can always narrow this down later. For now, we're just sizing the opportunity.
              </p>
            </div>
          </div>

          {!loading && filteredCount < 50 && filteredCount > 0 && (
            <div className="flex items-start gap-2 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                This is a pretty small list. You can still run it, but results may be limited.
              </p>
            </div>
          )}

          {!loading && filteredCount > 1000 && (
            <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                This is a big audience. You may want to narrow it down so your team can handle the calls.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!campaignData.audienceSource || filteredCount === 0 || loading}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
