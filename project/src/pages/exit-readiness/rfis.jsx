import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getRFIs, createRFI, updateRFI, deleteRFI } from '../../services/rrclService';
import RFIsView from '../../components/rrlc/rfis/RFIsView';

const RFIs = () => {
  const { user } = useAuth();
  const [rfis, setRFIs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRFIs();
    }
  }, [user]);

  const fetchRFIs = async () => {
    try {
      setLoading(true);
      const businessId = user.user_metadata?.business_id;
      if (!businessId) {
        setLoading(false);
        return;
      }

      const { data, error } = await getRFIs(businessId);
      if (error) throw error;
      setRFIs(data || []);
    } catch (err) {
      console.error('Error fetching RFIs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRFI = async (newRFI) => {
    try {
      const businessId = user.user_metadata?.business_id;
      if (!businessId) {
        alert('No business profile found.');
        return;
      }

      const { data, error } = await createRFI(businessId, user.id, newRFI);
      if (error) throw error;
      setRFIs([data, ...rfis]);
    } catch (err) {
      console.error('Error adding RFI:', err);
      alert('Failed to add RFI');
    }
  };

  const handleUpdateRFI = async (rfiId, updates) => {
    try {
      const { data, error } = await updateRFI(rfiId, updates);
      if (error) throw error;
      setRFIs(rfis.map(r => r.id === rfiId ? data : r));
    } catch (err) {
      console.error('Error updating RFI:', err);
      alert('Failed to update RFI');
    }
  };

  const handleDeleteRFI = async (rfiId) => {
    if (!window.confirm('Are you sure you want to delete this RFI?')) return;

    try {
      const { error } = await deleteRFI(rfiId);
      if (error) throw error;
      setRFIs(rfis.filter(r => r.id !== rfiId));
    } catch (err) {
      console.error('Error deleting RFI:', err);
      alert('Failed to delete RFI');
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
        <h1 className="text-3xl font-bold text-foreground mb-2">RFI Tracker</h1>
        <p className="text-muted-foreground">
          Manage Requests for Information from potential buyers.
        </p>
      </div>

      <RFIsView
        rfis={rfis}
        onAdd={handleAddRFI}
        onUpdate={handleUpdateRFI}
        onDelete={handleDeleteRFI}
        isDemo={false}
      />
    </div>
  );
};

export default RFIs;
