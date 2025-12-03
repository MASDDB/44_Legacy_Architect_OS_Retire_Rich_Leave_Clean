import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { getBusinessesByUserId, getContracts } from '../../services/rrclService';

const Contracts = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized && !user) {
      navigate('/user-authentication');
    }
  }, [user, initialized, navigate]);

  useEffect(() => {
    if (user) {
      loadContracts();
    }
  }, [user]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const { data: businesses } = await getBusinessesByUserId(user.id);
      if (businesses && businesses.length > 0) {
        const { data: contractsData } = await getContracts(businesses[0].id);
        setContracts(contractsData || []);
      }
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Material Contracts</h1>
              <p className="text-muted-foreground">
                Index material contracts and flag change-of-control clauses that require attention
              </p>
            </div>
            <Link
              to="/exit-readiness"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {contracts.length} {contracts.length === 1 ? 'contract' : 'contracts'} indexed
              </h2>
              <Button
                onClick={() => alert('Add contract functionality coming soon')}
                iconName="Plus"
              >
                Add Contract
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <Icon name="Loader" size={32} className="animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : contracts.length > 0 ? (
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                        <Icon name="FileText" size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-foreground">{contract.contract_name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {contract.contract_type} • {contract.counterparty}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="FileText" size={32} className="text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No contracts added yet
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Start indexing your material contracts by key contract info
                </p>
                <Button
                  onClick={() => alert('Add contract functionality coming soon')}
                  iconName="Plus"
                >
                  Add Your First Contract
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contracts;
