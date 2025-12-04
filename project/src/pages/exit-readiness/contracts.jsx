import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getContracts, createContract, deleteContract } from '../../services/rrclService';
import ContractsView from '../../components/rrlc/contracts/ContractsView';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Contracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      // In a real app, we'd get the business ID from context or selection
      // For now, we'll fetch for the user's first business or a default
      // This part might need adjustment based on how business context is handled
      const businessId = user.user_metadata?.business_id;
      if (!businessId) {
        // Fallback or handle no business
        setLoading(false);
        return;
      }

      const { data, error } = await getContracts(businessId);
      if (error) throw error;
      setContracts(data || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContract = async (newContract) => {
    try {
      const businessId = user.user_metadata?.business_id;
      if (!businessId) {
        alert('No business profile found. Please complete your business profile first.');
        return;
      }

      const { data, error } = await createContract(businessId, user.id, newContract);
      if (error) throw error;

      setContracts([data, ...contracts]);
    } catch (err) {
      console.error('Error adding contract:', err);
      alert('Failed to add contract');
    }
  };

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) return;

    try {
      const { error } = await deleteContract(contractId);
      if (error) throw error;

      setContracts(contracts.filter(c => c.id !== contractId));
    } catch (err) {
      console.error('Error deleting contract:', err);
      alert('Failed to delete contract');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contracts</h1>
        <p className="text-muted-foreground">
          Manage your material contracts and agreements.
        </p>
      </div>

      <ContractsView
        contracts={contracts}
        onAdd={handleAddContract}
        onDelete={handleDeleteContract}
        isDemo={false}
      />
    </div>
  );
};

export default Contracts;
