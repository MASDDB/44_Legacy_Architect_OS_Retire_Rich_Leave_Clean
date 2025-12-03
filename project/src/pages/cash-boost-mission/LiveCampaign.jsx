import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TrendingUp, MessageSquare, Users, DollarSign, CheckCircle, Activity } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import { cashBoostService } from '../../services/cashBoostService';

export default function LiveCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
    const interval = setInterval(loadCampaign, 5000);
    return () => clearInterval(interval);
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      const data = await cashBoostService.getCampaign(campaignId);
      setCampaign(data);
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCampaign = async () => {
    if (!confirm('Are you sure you want to mark this campaign as complete?')) return;

    try {
      await cashBoostService.completeCampaign(campaignId);
      navigate(`/cash-boost/complete/${campaignId}`);
    } catch (error) {
      console.error('Error completing campaign:', error);
      alert('Failed to complete campaign. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Campaign - Cash-Boost Mission</title>
        </Helmet>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading campaign...</p>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <Helmet>
          <title>Campaign Not Found - Cash-Boost Mission</title>
        </Helmet>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Campaign not found</p>
                <Button onClick={() => navigate('/main-dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }

  const userRate = campaign.pricing_mode === 'performance' ? 100 - campaign.performance_rate : 100;
  const userShare = (campaign.total_revenue * userRate) / 100;
  const feeAmount = campaign.performance_fee_amount;

  return (
    <>
      <Helmet>
        <title>Live Campaign - Cash-Boost Mission</title>
      </Helmet>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Cash-Boost Mission: Live Results
                    </h1>
                    <p className="text-gray-600">
                      Watch the numbers move in real time as customers respond.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-600">
                      {campaign.status === 'active' ? 'Live' : campaign.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-medium text-gray-600">Contacts Messaged</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {campaign.contacts_messaged.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h3 className="text-sm font-medium text-gray-600">Replies</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {campaign.replies_count.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-medium text-gray-600">New Jobs Booked</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {campaign.jobs_booked.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-sm font-medium text-gray-600">Completed Jobs</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {campaign.jobs_completed.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Estimated Revenue So Far
                    </h3>
                  </div>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    ${campaign.total_revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Based on {campaign.jobs_completed} completed jobs
                  </p>
                </div>

                {campaign.pricing_mode === 'performance' && (
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Money from this mission
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confirmed collected revenue:</span>
                        <span className="font-medium text-gray-900">
                          ${campaign.total_revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your share at {userRate}%:</span>
                        <span className="font-medium text-green-600">
                          ${userShare.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Our success fee at {campaign.performance_rate}%:</span>
                        <span className="font-medium text-gray-900">
                          ${feeAmount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        You'll have a chance to review and confirm these numbers before we bill any performance fee.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Campaign Status
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Status:</span> {campaign.status}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Started:</span> {new Date(campaign.start_date).toLocaleString()}
                    </p>
                    {campaign.end_date && (
                      <p className="text-gray-600">
                        <span className="font-medium">Ends:</span> {new Date(campaign.end_date).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {campaign.status === 'active' && (
                    <Button
                      onClick={handleCompleteCampaign}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete Campaign
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
