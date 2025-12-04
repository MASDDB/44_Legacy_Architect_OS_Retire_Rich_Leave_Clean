import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getFinancialRecords, createFinancialRecord, updateFinancialRecord } from '../../services/rrclService';
import FinancialsView from '../../components/rrlc/financials/FinancialsView';

const Financials = () => {
  const { user } = useAuth();
  const [financialData, setFinancialData] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFinancials();
    }
  }, [user]);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const businessId = user.user_metadata?.business_id;
      if (!businessId) {
        setLoading(false);
        return;
      }

      const { data, error } = await getFinancialRecords(businessId);
      if (error) throw error;

      // Use the most recent record if available
      if (data && data.length > 0) {
        const latest = data[0];
        setFinancialData(latest);
        setRecordId(latest.id);
      }
    } catch (err) {
      console.error('Error fetching financials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFinancials = async (data) => {
    try {
      const businessId = user.user_metadata?.business_id;
      if (!businessId) {
        alert('No business profile found.');
        return;
      }

      if (recordId) {
        // Update existing
        const { error } = await updateFinancialRecord(recordId, data);
        if (error) throw error;
        alert('Financials updated successfully');
      } else {
        // Create new
        const { data: newRecord, error } = await createFinancialRecord(businessId, user.id, {
          ...data,
          fiscal_year: new Date().getFullYear() // Default to current year
        });
        if (error) throw error;
        setRecordId(newRecord.id);
        alert('Financials saved successfully');
      }
    } catch (err) {
      console.error('Error saving financials:', err);
      alert('Failed to save financials');
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Financials</h1>
        <p className="text-muted-foreground">
          Track revenue, expenses, and calculate normalized EBITDA.
        </p>
      </div>

      <FinancialsView
        financialData={financialData}
        onSave={handleSaveFinancials}
        isDemo={false}
      />
    </div>
  );
};

export default Financials;
