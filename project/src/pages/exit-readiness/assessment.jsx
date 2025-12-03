import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ExitScoreAssessment from '../../components/rrlc/ExitScoreAssessment';
import { useAuth } from '../../contexts/AuthContext';

const Assessment = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAssessment, setShowAssessment] = useState(true);

  useEffect(() => {
    if (initialized && !user) {
      navigate('/user-authentication');
    }
  }, [user, initialized, navigate]);

  const handleAssessmentComplete = () => {
    navigate('/exit-readiness');
  };

  const handleClose = () => {
    navigate('/exit-readiness');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Exit Score Assessment</h1>
            <p className="text-muted-foreground">
              Take our 3-minute assessment to get your exit readiness score
            </p>
          </div>
        </div>
      </main>

      {showAssessment && (
        <ExitScoreAssessment
          onComplete={handleAssessmentComplete}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default Assessment;
