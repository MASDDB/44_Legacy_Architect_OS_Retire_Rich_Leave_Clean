import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignComparisonTable = () => {
  const [sortField, setSortField] = useState('reactivation_rate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const campaigns = [
    {
      id: 'camp_001',
      name: 'Q4 Solar Reactivation',
      status: 'active',
      leads_imported: 2450,
      leads_contacted: 1876,
      appointments_booked: 467,
      reactivation_rate: 25.8,
      revenue_generated: 89750,
      cost_per_acquisition: 38,
      roi: 340,
      created_date: '2024-12-01',
      industry: 'Solar'
    },
    {
      id: 'camp_002',
      name: 'Insurance Follow-up Campaign',
      status: 'active',
      leads_imported: 1890,
      leads_contacted: 1654,
      appointments_booked: 298,
      reactivation_rate: 18.0,
      revenue_generated: 52400,
      cost_per_acquisition: 45,
      roi: 285,
      created_date: '2024-11-15',
      industry: 'Insurance'
    },
    {
      id: 'camp_003',
      name: 'Home Services Reactivation',
      status: 'completed',
      leads_imported: 3200,
      leads_contacted: 2890,
      appointments_booked: 756,
      reactivation_rate: 26.2,
      revenue_generated: 134500,
      cost_per_acquisition: 32,
      roi: 420,
      created_date: '2024-10-20',
      industry: 'Home Services'
    },
    {
      id: 'camp_004',
      name: 'Financial Advisory Outreach',
      status: 'paused',
      leads_imported: 1560,
      leads_contacted: 1203,
      appointments_booked: 187,
      reactivation_rate: 15.5,
      revenue_generated: 28900,
      cost_per_acquisition: 52,
      roi: 195,
      created_date: '2024-11-28',
      industry: 'Financial'
    },
    {
      id: 'camp_005',
      name: 'Healthcare Patient Reactivation',
      status: 'active',
      leads_imported: 2780,
      leads_contacted: 2234,
      appointments_booked: 623,
      reactivation_rate: 27.9,
      revenue_generated: 98750,
      cost_per_acquisition: 29,
      roi: 385,
      created_date: '2024-12-10',
      industry: 'Healthcare'
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCampaigns = [...campaigns]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev?.includes(campaignId) 
        ? prev?.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      completed: { color: 'bg-primary text-primary-foreground', label: 'Completed' },
      paused: { color: 'bg-warning text-warning-foreground', label: 'Paused' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground/50'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground/50'} -mt-1`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Campaign Comparison</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Compare performance across all your reactivation campaigns
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedCampaigns?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedCampaigns?.length} selected
              </span>
              <Button variant="outline" size="sm" iconName="BarChart3">
                Compare
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary"
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      setSelectedCampaigns(campaigns?.map(c => c?.id));
                    } else {
                      setSelectedCampaigns([]);
                    }
                  }}
                  checked={selectedCampaigns?.length === campaigns?.length}
                />
              </th>
              <SortableHeader field="name">Campaign</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="leads_imported">Leads</SortableHeader>
              <SortableHeader field="appointments_booked">Appointments</SortableHeader>
              <SortableHeader field="reactivation_rate">Rate</SortableHeader>
              <SortableHeader field="revenue_generated">Revenue</SortableHeader>
              <SortableHeader field="cost_per_acquisition">CPA</SortableHeader>
              <SortableHeader field="roi">ROI</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedCampaigns?.map((campaign) => (
              <tr key={campaign?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary focus:ring-primary"
                    checked={selectedCampaigns?.includes(campaign?.id)}
                    onChange={() => handleSelectCampaign(campaign?.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {campaign?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {campaign?.industry} • Created {new Date(campaign.created_date)?.toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(campaign?.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {campaign?.leads_imported?.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {campaign?.leads_contacted?.toLocaleString()} contacted
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">
                    {campaign?.appointments_booked}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">
                    {campaign?.reactivation_rate}%
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">
                    ${campaign?.revenue_generated?.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    ${campaign?.cost_per_acquisition}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-success">
                    {campaign?.roi}%
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Edit">
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignComparisonTable;