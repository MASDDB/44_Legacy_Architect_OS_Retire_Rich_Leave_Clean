import React from 'react';


import { Flame, Phone, Mail, Calendar } from 'lucide-react';

const HotLeads = ({ leads = [] }) => {
  // Use optional chaining for safe data access
  const hotLeads = leads?.slice(0, 5) || [];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-50';
      case 'contacted': return 'text-purple-600 bg-purple-50';
      case 'qualified': return 'text-green-600 bg-green-50';
      case 'proposal': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Hot Leads</h3>
        </div>
        <span className="px-2 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">
          {hotLeads?.length || 0} leads
        </span>
      </div>
      <div className="space-y-4">
        {hotLeads?.length > 0 ? (
          hotLeads?.map((lead) => (
            <div key={lead?.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {lead?.first_name?.[0] || 'U'}{lead?.last_name?.[0] || ''}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {lead?.first_name || 'Unknown'} {lead?.last_name || 'Lead'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {lead?.job_title || 'N/A'} 
                      {lead?.company?.name && ` at ${lead?.company?.name}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead?.priority)}`}>
                    {lead?.priority || 'medium'}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead?.lead_status)}`}>
                    {lead?.lead_status?.replace('_', ' ') || 'new'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Est. Value: <span className="font-semibold text-gray-900">
                    ${lead?.estimated_value ? parseInt(lead?.estimated_value)?.toLocaleString() : '0'}
                  </span>
                </div>
                {lead?.next_follow_up && (
                  <div className="text-sm text-gray-600">
                    Next: {new Date(lead.next_follow_up)?.toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {lead?.phone && (
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Phone className="w-4 h-4" />
                  </button>
                )}
                {lead?.email && (
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                    <Mail className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                  <Calendar className="w-4 h-4" />
                </button>
                <div className="flex-1"></div>
                <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  View Details
                </button>
              </div>

              {lead?.notes && (
                <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {lead?.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Flame className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hot leads at the moment</p>
            <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              Import leads to get started
            </button>
          </div>
        )}
      </div>
      {hotLeads?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            View All Hot Leads ({leads?.length || 0})
          </button>
        </div>
      )}
    </div>
  );
};

export default HotLeads;