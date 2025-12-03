import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  ArrowUpDown
} from 'lucide-react';
import { crmService } from '../../../services/crmService';

const FieldMappingInterface = ({ connections, selectedConnection, onConnectionSelect }) => {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [platformFields] = useState(crmService?.getPlatformFields());
  const [crmFields, setCrmFields] = useState([]);

  // Load mappings when connection changes
  useEffect(() => {
    if (selectedConnection?.id) {
      loadMappings();
      loadCRMFields();
    }
  }, [selectedConnection]);

  const loadMappings = async () => {
    if (!selectedConnection?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await crmService?.getFieldMappings(selectedConnection?.id);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setMappings(result?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load field mappings');
    } finally {
      setLoading(false);
    }
  };

  const loadCRMFields = () => {
    if (!selectedConnection?.provider) return;
    
    const fields = crmService?.getCRMFields(selectedConnection?.provider);
    setCrmFields(fields);
  };

  const handleSaveMappings = async () => {
    if (!selectedConnection?.id) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const result = await crmService?.updateFieldMappings(selectedConnection?.id, mappings);
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to save field mappings');
    } finally {
      setSaving(false);
    }
  };

  const addMapping = () => {
    const newMapping = {
      id: crypto.randomUUID(),
      platform_field: '',
      crm_field: '',
      mapping_type: 'direct',
      transformation_rules: {},
      is_active: true
    };
    setMappings([...mappings, newMapping]);
  };

  const updateMapping = (index, field, value) => {
    const updatedMappings = [...mappings];
    updatedMappings[index] = {
      ...updatedMappings?.[index],
      [field]: value
    };
    setMappings(updatedMappings);
  };

  const removeMapping = (index) => {
    const updatedMappings = mappings?.filter((_, i) => i !== index);
    setMappings(updatedMappings);
  };

  const getMappingTypeColor = (type) => {
    switch (type) {
      case 'direct':
        return 'bg-green-100 text-green-800';
      case 'transformation':
        return 'bg-blue-100 text-blue-800';
      case 'calculated':
        return 'bg-purple-100 text-purple-800';
      case 'static':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!connections?.length) {
    return (
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Connections Available
        </h3>
        <p className="text-gray-600">
          Create a CRM connection first to configure field mappings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Field Mapping Configuration
        </h3>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Select Connection:
          </label>
          <select
            value={selectedConnection?.id || ''}
            onChange={(e) => {
              const connection = connections?.find(c => c?.id === e?.target?.value);
              onConnectionSelect?.(connection);
            }}
            className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a connection...</option>
            {connections?.map((connection) => (
              <option key={connection?.id} value={connection?.id}>
                {connection?.connection_name} ({connection?.provider})
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedConnection && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Field Mappings for {selectedConnection?.connection_name}
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Map platform fields to {selectedConnection?.provider} fields for data synchronization
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {success && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Saved successfully</span>
                </div>
              )}
              
              <button
                onClick={addMapping}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Mapping
              </button>
              
              <button
                onClick={handleSaveMappings}
                disabled={saving || mappings?.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Mappings
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading field mappings...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mapping Headers */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200 pb-3">
                <div className="col-span-4">Platform Field</div>
                <div className="col-span-1 text-center">
                  <ArrowUpDown className="w-4 h-4 mx-auto" />
                </div>
                <div className="col-span-4">CRM Field</div>
                <div className="col-span-2">Mapping Type</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Mapping Rows */}
              {mappings?.length > 0 ? (
                mappings?.map((mapping, index) => (
                  <motion.div
                    key={mapping?.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100"
                  >
                    {/* Platform Field */}
                    <div className="col-span-4">
                      <select
                        value={mapping?.platform_field || ''}
                        onChange={(e) => updateMapping(index, 'platform_field', e?.target?.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select platform field...</option>
                        {platformFields?.map((field) => (
                          <option key={field?.key} value={field?.key}>
                            {field?.label} ({field?.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Arrow */}
                    <div className="col-span-1 text-center">
                      <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                    </div>

                    {/* CRM Field */}
                    <div className="col-span-4">
                      <select
                        value={mapping?.crm_field || ''}
                        onChange={(e) => updateMapping(index, 'crm_field', e?.target?.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select CRM field...</option>
                        {crmFields?.map((field) => (
                          <option key={field?.key} value={field?.key}>
                            {field?.label} ({field?.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mapping Type */}
                    <div className="col-span-2">
                      <select
                        value={mapping?.mapping_type || 'direct'}
                        onChange={(e) => updateMapping(index, 'mapping_type', e?.target?.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="direct">Direct</option>
                        <option value="transformation">Transform</option>
                        <option value="calculated">Calculated</option>
                        <option value="static">Static</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <button
                        onClick={() => removeMapping(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Field Mappings
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Create field mappings to define how data synchronizes between your platform and CRM.
                  </p>
                  <button
                    onClick={addMapping}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Mapping
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldMappingInterface;