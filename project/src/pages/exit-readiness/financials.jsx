import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Financials = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (initialized && !user) {
      navigate('/user-authentication');
    }
  }, [user, initialized, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Financial Analysis</h1>
            <p className="text-muted-foreground">
              Normalized EBITDA calculator and financial metrics
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">
              EBITDA calculator, add-backs tracking, and financial record management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Financials;
