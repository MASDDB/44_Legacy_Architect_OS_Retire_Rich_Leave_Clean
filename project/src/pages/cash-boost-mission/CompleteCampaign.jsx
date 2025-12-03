import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, DollarSign, TrendingUp, Users, MessageSquare } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import { cashBoostService } from '../../services/cashBoostService';

export default function CompleteCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState(false);
  const [billed, setBilled] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      const data = await cashBoostService.getCampaign(campaignId);
      setCampaign(data);
      setBilled(data.performance_fee_billed);
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBilling = async () => {
    if (!confirm(`Confirm billing of $${campaign.performance_fee_amount.toLocaleString()} success fee?`)) {
      return;
    }

    try {
      setBilling(true);
      await cashBoostService.billPerformanceFee(campaignId);
      setBilled(true);
    } catch (error) {
      console.error('Error billing performance fee:', error);
      alert('Failed to process performance fee. Please contact support.');
    } finally {
      setBilling(false);
    }
  };

  const handleRunAnother = () => {
    navigate('/cash-boost');
  };

  const handleBackToDashboard = () => {
    navigate('/main-dashboard');
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading - Cash-Boost Mission</title>
        </Helmet>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading campaign results...</p>
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
                <Button onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }

  const avgTicket = campaign.jobs_completed > 0
    ? campaign.total_revenue / campaign.jobs_completed
    : 0;

  const userRate = campaign.pricing_mode === 'performance' ? 100 - campaign.performance_rate : 100;
  const userShare = (campaign.total_revenue * userRate) / 100;

  return (
    <>
      <Helmet>
        <title>Mission Complete - Cash-Boost Mission</title>
      </Helmet>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Mission complete: here's what you made
                </h1>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.contacts_messaged.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Contacts messaged</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <MessageSquare className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.replies_count.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Replies</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.jobs_booked.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Jobs booked</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.jobs_completed.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Completed jobs</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    ${avgTicket.toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-600">Average ticket</p>
                </div>

                <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    ${campaign.total_revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total revenue</p>
                </div>
              </div>

              {campaign.pricing_mode === 'performance' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Performance fee summary
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Your total collected revenue:</span>
                      <span className="font-medium text-gray-900">
                        ${campaign.total_revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Agreed success fee:</span>
                      <span className="font-medium text-gray-900">
                        {campaign.performance_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Your share:</span>
                      <span className="font-medium text-green-600">
                        ${userShare.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Our fee for this mission:</span>
                      <span className="font-medium text-gray-900">
                        ${campaign.performance_fee_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!billed ? (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Please confirm these numbers are accurate. We'll add the success fee for this mission to your next invoice.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleConfirmBilling}
                          disabled={billing}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {billing ? 'Processing...' : 'Confirm & bill success fee'}
                        </Button>
                        <Button
                          onClick={() => navigate(`/cash-boost/live/${campaignId}`)}
                          variant="outline"
                          className="flex-1"
                        >
                          Review or adjust numbers
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">
                        Got it. We've recorded this mission and added the success fee to your billing. Ready to run another cash-boost mission when you are.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleRunAnother}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Run Another Mission
                </Button>
                <Button
                  onClick={handleBackToDashboard}
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
