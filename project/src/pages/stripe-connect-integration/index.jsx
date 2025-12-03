import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VoiceCampaignBuilder from '../campaign-builder/components/VoiceCampaignBuilder';
import VoiceAnalyticsDashboard from '../campaign-builder/components/VoiceAnalyticsDashboard';

import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const StripeConnectIntegration = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [connectAccount, setConnectAccount] = useState(null);
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [payoutSettings, setPayoutSettings] = useState({
    schedule: 'weekly',
    minimumAmount: 10.00,
    commissionRate: 5.0
  });
  const [revenueData, setRevenueData] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    thisMonth: 0,
    lastPayout: null
  });
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVoiceCampaign, setShowVoiceCampaign] = useState(false);
  const [showVoiceAnalytics, setShowVoiceAnalytics] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [voiceCampaigns, setVoiceCampaigns] = useState([]);

  useEffect(() => {
    if (user) {
      loadConnectAccountData();
      loadVoiceCampaigns();
    }
  }, [user]);

  const loadConnectAccountData = async () => {
    setLoading(true);
    try {
      // Simulated data for Connect account
      setConnectAccount({
        id: 'acct_1234567890',
        email: user?.email,
        country: 'US',
        defaultCurrency: 'usd',
        payoutsEnabled: true,
        chargesEnabled: true,
        detailsSubmitted: true
      });

      setRevenueData({
        totalEarnings: 2847.50,
        pendingPayouts: 324.00,
        thisMonth: 1250.75,
        lastPayout: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      });

      setTransactions([
        {
          id: 'txn_001',
          amount: 150.00,
          fee: 7.50,
          net: 142.50,
          status: 'succeeded',
          customer: 'Acme Corp',
          created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'txn_002',
          amount: 89.00,
          fee: 4.45,
          net: 84.55,
          status: 'succeeded',
          customer: 'Tech Solutions LLC',
          created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (error) {
      console.error('Error loading Connect account data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVoiceCampaigns = async () => {
    try {
      const { data, error } = await supabase?.from('campaigns')?.select('*')?.eq('campaign_type', 'phone')?.eq('created_by', user?.id)?.order('created_at', { ascending: false });

      if (error) throw error;

      setVoiceCampaigns(data || []);
      if (data?.length > 0 && !selectedCampaign) {
        setSelectedCampaign(data?.[0]);
      }
    } catch (error) {
      console.error('Error loading voice campaigns:', error);
      setVoiceCampaigns([]);
    }
  };

  const handleCreateConnectAccount = async () => {
    try {
      // Simulate Stripe Connect onboarding
      setOnboardingUrl('https://connect.stripe.com/setup/s/123456789');
      window.open(onboardingUrl, '_blank');
    } catch (error) {
      console.error('Error creating Connect account:', error);
    }
  };

  const handleUpdatePayoutSettings = async () => {
    try {
      // Simulate updating payout settings
      console.log('Updating payout settings:', payoutSettings);
    } catch (error) {
      console.error('Error updating payout settings:', error);
    }
  };

  const handleManualPayout = async () => {
    try {
      // Simulate manual payout
      console.log('Initiating manual payout...');
    } catch (error) {
      console.error('Error initiating manual payout:', error);
    }
  };

  const handleVoiceCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowVoiceCampaign(true);
  };

  const handleViewAnalytics = (campaign) => {
    setSelectedCampaign(campaign);
    setShowVoiceAnalytics(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar onToggle={() => {}} />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <Icon name="Loader2" size={32} className="animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Stripe Connect Integration - Database Reactivation</title>
        <meta name="description" content="Manage automated commission payouts and financial workflows for white-label resellers" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar onToggle={() => {}} />
          <div className="flex-1 p-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Stripe Connect Integration</h1>
                  <p className="text-gray-600 mt-2">
                    Manage automated commission payouts and financial workflows
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {connectAccount ? (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Icon name="CheckCircle" size={16} />
                      <span>Account Connected</span>
                    </div>
                  ) : (
                    <Button onClick={handleCreateConnectAccount}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Connect Stripe Account
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: 'DollarSign' },
                  { id: 'payouts', name: 'Payout Settings', icon: 'CreditCard' },
                  { id: 'transactions', name: 'Transactions', icon: 'List' },
                  { id: 'voice', name: 'Voice Campaigns', icon: 'Phone' },
                  { id: 'analytics', name: 'Analytics', icon: 'BarChart3' }
                ]?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab?.id
                        ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Account Status */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${connectAccount?.payoutsEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Payouts</p>
                          <p className="text-xs text-gray-500">{connectAccount?.payoutsEnabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${connectAccount?.chargesEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Charges</p>
                          <p className="text-xs text-gray-500">{connectAccount?.chargesEnabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${connectAccount?.detailsSubmitted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Details</p>
                          <p className="text-xs text-gray-500">{connectAccount?.detailsSubmitted ? 'Complete' : 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Total Earnings</p>
                        <p className="text-2xl font-bold">${revenueData?.totalEarnings?.toFixed(2)}</p>
                      </div>
                      <Icon name="DollarSign" size={24} className="text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Pending Payouts</p>
                        <p className="text-2xl font-bold">${revenueData?.pendingPayouts?.toFixed(2)}</p>
                      </div>
                      <Icon name="Clock" size={24} className="text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">This Month</p>
                        <p className="text-2xl font-bold">${revenueData?.thisMonth?.toFixed(2)}</p>
                      </div>
                      <Icon name="TrendingUp" size={24} className="text-purple-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Commission Rate</p>
                        <p className="text-2xl font-bold">{payoutSettings?.commissionRate}%</p>
                      </div>
                      <Icon name="Percent" size={24} className="text-orange-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payout Settings Tab */}
            {activeTab === 'payouts' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Configuration</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payout Schedule
                        </label>
                        <select
                          value={payoutSettings?.schedule}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, schedule: e?.target?.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="manual">Manual</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Payout Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={payoutSettings?.minimumAmount}
                            onChange={(e) => setPayoutSettings(prev => ({ ...prev, minimumAmount: parseFloat(e?.target?.value) }))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          value={payoutSettings?.commissionRate}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, commissionRate: parseFloat(e?.target?.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button onClick={handleUpdatePayoutSettings} className="w-full">
                          <Icon name="Save" size={16} className="mr-2" />
                          Update Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Payout */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Manual Payout</h3>
                        <p className="text-gray-600">Trigger an immediate payout of available balance</p>
                      </div>
                      <Button onClick={handleManualPayout} variant="outline">
                        <Icon name="Send" size={16} className="mr-2" />
                        Request Payout
                      </Button>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Available Balance: <span className="font-semibold">${revenueData?.pendingPayouts?.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions?.map((transaction) => (
                          <tr key={transaction?.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-900">
                              {transaction?.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {transaction?.customer}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              ${transaction?.amount?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              ${transaction?.fee?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${transaction?.net?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction?.status === 'succeeded' ?'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                              }`}>
                                {transaction?.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {transaction?.created?.toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Campaigns Tab */}
            {activeTab === 'voice' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Voice Campaigns</h2>
                  <Button onClick={() => handleVoiceCampaign(selectedCampaign)}>
                    <Icon name="Phone" size={16} className="mr-2" />
                    Start Voice Campaign
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {voiceCampaigns?.map((campaign) => (
                    <div key={campaign?.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign?.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign?.campaign_status === 'active' ?'bg-green-100 text-green-800'
                            : campaign?.campaign_status === 'draft' ?'bg-gray-100 text-gray-800' :'bg-blue-100 text-blue-800'
                        }`}>
                          {campaign?.campaign_status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{campaign?.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Budget</p>
                          <p className="font-medium">${campaign?.budget || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">{campaign?.campaign_type}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleVoiceCampaign(campaign)}
                          className="flex-1"
                        >
                          <Icon name="Phone" size={14} className="mr-1" />
                          Launch
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAnalytics(campaign)}
                        >
                          <Icon name="BarChart3" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {voiceCampaigns?.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Phone" size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Voice Campaigns</h3>
                    <p className="text-gray-600 mb-4">Create your first voice campaign to get started</p>
                    <Button>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
                  <Button onClick={() => setShowVoiceAnalytics(true)}>
                    <Icon name="BarChart3" size={16} className="mr-2" />
                    View Voice Analytics
                  </Button>
                </div>
                
                <div className="text-center py-12">
                  <Icon name="BarChart3" size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Detailed revenue analytics and performance metrics will be displayed here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Voice Campaign Modal */}
      <VoiceCampaignBuilder
        isOpen={showVoiceCampaign}
        campaign={selectedCampaign}
        selectedLeads={[]} // Could be populated from lead selection
        onSendVoice={(results) => {
          console.log('Voice campaign results:', results);
          setShowVoiceCampaign(false);
        }}
        onClose={() => setShowVoiceCampaign(false)}
      />
      {/* Voice Analytics Modal */}
      <VoiceAnalyticsDashboard
        isOpen={showVoiceAnalytics}
        campaignId={selectedCampaign?.id}
        onClose={() => setShowVoiceAnalytics(false)}
      />
    </>
  );
};

export default StripeConnectIntegration;