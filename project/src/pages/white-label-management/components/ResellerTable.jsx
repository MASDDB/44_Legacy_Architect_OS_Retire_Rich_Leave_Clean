import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ResellerTable = ({ resellers, onViewDetails, onEditReseller, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('company');
  const [sortOrder, setSortOrder] = useState('asc');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending Setup' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const sortOptions = [
    { value: 'company', label: 'Company Name' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'joinDate', label: 'Join Date' },
    { value: 'status', label: 'Status' }
  ];

  const filteredResellers = resellers?.filter(reseller => {
      const matchesSearch = reseller?.company?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           reseller?.contact?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || reseller?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];
      
      if (sortBy === 'revenue') {
        aValue = a?.monthlyRevenue;
        bValue = b?.monthlyRevenue;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactive' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending Setup' },
      suspended: { color: 'bg-error text-error-foreground', label: 'Suspended' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Table Header with Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search resellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
              className="w-full sm:w-40"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Company</span>
                  <Icon name={sortBy === 'company' && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Status</span>
                  <Icon name={sortBy === 'status' && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('revenue')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Monthly Revenue</span>
                  <Icon name={sortBy === 'revenue' && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Commission</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Join Date</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResellers?.map((reseller) => (
              <tr key={reseller?.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Building2" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{reseller?.company}</p>
                      <p className="text-sm text-muted-foreground">{reseller?.domain}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{reseller?.contact}</p>
                    <p className="text-sm text-muted-foreground">{reseller?.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(reseller?.status)}
                </td>
                <td className="p-4">
                  <p className="font-medium text-foreground">${reseller?.monthlyRevenue?.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <p className="font-medium text-foreground">${reseller?.commission?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{reseller?.commissionRate}%</p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-foreground">{reseller?.joinDate}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(reseller)}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditReseller(reseller)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(reseller)}
                    >
                      <Icon name={reseller?.status === 'active' ? 'Pause' : 'Play'} size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {filteredResellers?.map((reseller) => (
          <div key={reseller?.id} className="p-4 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{reseller?.company}</p>
                  <p className="text-sm text-muted-foreground">{reseller?.domain}</p>
                </div>
              </div>
              {getStatusBadge(reseller?.status)}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contact:</span>
                <span className="text-sm text-foreground">{reseller?.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Revenue:</span>
                <span className="text-sm font-medium text-foreground">${reseller?.monthlyRevenue?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Commission:</span>
                <span className="text-sm font-medium text-foreground">${reseller?.commission?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Join Date:</span>
                <span className="text-sm text-foreground">{reseller?.joinDate}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(reseller)}
                className="flex-1"
              >
                <Icon name="Eye" size={16} />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditReseller(reseller)}
                className="flex-1"
              >
                <Icon name="Edit" size={16} />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filteredResellers?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No resellers found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ResellerTable;