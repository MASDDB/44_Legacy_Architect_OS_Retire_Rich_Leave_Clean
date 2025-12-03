import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ExitScoreAssessment from '../../components/rrlc/ExitScoreAssessment';
import { useAuth } from '../../contexts/AuthContext';
import { getLatestAssessment, getBusinessesByUserId } from '../../services/rrclService';
import { getScoreCategory } from '../../services/rrclExitScoreCalculator';

const ExitReadinessDashboard = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (initialized && !user) {
      navigate('/user-authentication');
    }
  }, [user, initialized, navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: latestAssessment } = await getLatestAssessment(user.id);
      setAssessment(latestAssessment);

      const { data: businesses } = await getBusinessesByUserId(user.id);
      if (businesses && businesses.length > 0) {
        setBusiness(businesses[0]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentComplete = () => {
    setShowAssessment(false);
    loadDashboardData();
  };

  const scoreCategory = assessment ? getScoreCategory(assessment.overall_exit_score) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Exit Readiness Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress toward a successful business exit
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader" size={32} className="text-primary animate-spin" />
            </div>
          ) : !assessment ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <Icon name="TrendingUp" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Get Your Exit Readiness Score
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Take our 3-minute assessment to discover what your business is worth and how ready it is for exit.
                You'll receive a comprehensive score, valuation estimate, and personalized action plan.
              </p>
              <Button size="lg" onClick={() => setShowAssessment(true)} iconName="Target">
                Start Assessment
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Exit Score</h3>
                    <Icon name="Target" size={20} className="text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {assessment.overall_exit_score}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-${scoreCategory?.color}/10 text-${scoreCategory?.color}`}>
                    {scoreCategory?.category}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Est. Valuation</h3>
                    <Icon name="DollarSign" size={20} className="text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    ${(assessment.estimated_valuation_low / 1000000).toFixed(1)}M - ${(assessment.estimated_valuation_high / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {assessment.valuation_multiple_low}x - {assessment.valuation_multiple_high}x revenue
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Data Room</h3>
                    <Icon name="FolderOpen" size={20} className="text-success" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {Math.round(business?.data_room_completion_percentage || 0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Financial</h4>
                  <div className="text-2xl font-bold text-foreground">{assessment.financial_score}</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Operational</h4>
                  <div className="text-2xl font-bold text-foreground">{assessment.operational_score}</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Market</h4>
                  <div className="text-2xl font-bold text-foreground">{assessment.market_score}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => navigate('/exit-readiness/data-room')}
                  variant="outline"
                  iconName="FolderOpen"
                  fullWidth
                >
                  Data Room
                </Button>
                <Button
                  onClick={() => navigate('/exit-readiness/financials')}
                  variant="outline"
                  iconName="DollarSign"
                  fullWidth
                >
                  Financials
                </Button>
                <Button
                  onClick={() => navigate('/exit-readiness/contracts')}
                  variant="outline"
                  iconName="FileText"
                  fullWidth
                >
                  Contracts
                </Button>
                <Button
                  onClick={() => navigate('/exit-readiness/rfis')}
                  variant="outline"
                  iconName="MessageSquare"
                  fullWidth
                >
                  RFIs
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {assessment.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <Icon name="AlertCircle" size={20} className="text-warning mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-4">No recommendations available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAssessment && (
        <ExitScoreAssessment
          onComplete={handleAssessmentComplete}
          onClose={() => setShowAssessment(false)}
        />
      )}
    </div>
  );
};

export default ExitReadinessDashboard;
