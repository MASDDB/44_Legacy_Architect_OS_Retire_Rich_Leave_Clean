import React, { useState } from 'react';
import { FileSpreadsheet, MoreVertical } from 'lucide-react';

import { useLeads } from '../../../hooks/useSupabaseData';
import { useAuth } from '../../../contexts/AuthContext';

const DataPreviewTable = ({ 
  data = [], 
  onRowSelect, 
  selectedRows = [],
  onBulkAction,
  showActions = true 
}) => {
  const { user } = useAuth();
  const { createLead, updateLead } = useLeads();
  const [processing, setProcessing] = useState(false);
  
  // Use optional chaining for safe data access
  const tableData = data?.slice(0, 10) || [];
  const hasData = tableData?.length > 0;

  const handleImportLead = async (leadData) => {
    if (!user?.id) return;
    
    try {
      setProcessing(true);
      const newLead = {
        first_name: leadData?.first_name || leadData?.firstName || '',
        last_name: leadData?.last_name || leadData?.lastName || '',
        email: leadData?.email || '',
        phone: leadData?.phone || '',
        company_name: leadData?.company || leadData?.company_name || '',
        job_title: leadData?.job_title || leadData?.jobTitle || '',
        lead_source: leadData?.source || 'import',
        assigned_to: user?.id,
        notes: leadData?.notes || '',
        estimated_value: parseFloat(leadData?.estimated_value || leadData?.value || 0) || null
      };

      await createLead(newLead);
    } catch (error) {
      console.error('Error importing lead:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkImport = async () => {
    if (!selectedRows?.length || !user?.id) return;
    
    try {
      setProcessing(true);
      const selectedData = tableData?.filter((_, index) => 
        selectedRows?.includes(index)
      ) || [];

      const importPromises = selectedData?.map(leadData => handleImportLead(leadData));
      await Promise.all(importPromises);
      
      onBulkAction?.('import', selectedRows);
    } catch (error) {
      console.error('Error bulk importing leads:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
        <div className="text-center">
          <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data to Preview</h3>
          <p className="text-gray-600 mb-4">Upload a file to see a preview of your data</p>
        </div>
      </div>
    );
  }

  // Get column headers from first row or use default headers
  const headers = Object.keys(tableData?.[0] || {});
  const displayHeaders = headers?.length > 0 ? headers : [
    'first_name', 'last_name', 'email', 'phone', 'company', 'job_title'
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
            {data?.length || 0} records
          </span>
        </div>
        
        {showActions && selectedRows?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedRows?.length} selected
            </span>
            <button
              onClick={handleBulkImport}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {processing ? 'Importing...' : 'Import Selected'}
            </button>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {showActions && (
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows?.length === tableData?.length}
                    onChange={(e) => {
                      const allIndexes = tableData?.map((_, index) => index) || [];
                      onRowSelect?.(e?.target?.checked ? allIndexes : []);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {displayHeaders?.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header?.replace('_', ' ') || 'Column'}
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData?.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  selectedRows?.includes(rowIndex) ? 'bg-blue-50' : ''
                }`}
              >
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows?.includes(rowIndex) || false}
                      onChange={(e) => {
                        const newSelected = e?.target?.checked
                          ? [...(selectedRows || []), rowIndex]
                          : selectedRows?.filter(i => i !== rowIndex) || [];
                        onRowSelect?.(newSelected);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {displayHeaders?.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={row?.[header]?.toString()}>
                      {row?.[header]?.toString() || '-'}
                    </div>
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleImportLead(row)}
                        disabled={processing}
                        className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                      >
                        Import
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data?.length > 10 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 text-center">
            Showing first 10 of {data?.length} records.{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View all records
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default DataPreviewTable;