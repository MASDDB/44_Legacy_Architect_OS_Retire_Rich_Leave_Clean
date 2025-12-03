import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OptOutManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOptOut, setNewOptOut] = useState({
    email: '',
    phone: '',
    reason: ''
  });

  const optOutList = [
    {
      id: 1,
      contact: 'john.doe@email.com',
      type: 'email',
      reason: 'User requested removal',
      dateAdded: '2025-01-15',
      source: 'Manual'
    },
    {
      id: 2,
      contact: '+1 (555) 123-4567',
      type: 'phone',
      reason: 'TCPA compliance',
      dateAdded: '2025-01-14',
      source: 'Automated'
    },
    {
      id: 3,
      contact: 'sarah.wilson@company.com',
      type: 'email',
      reason: 'GDPR request',
      dateAdded: '2025-01-13',
      source: 'Manual'
    },
    {
      id: 4,
      contact: '+1 (555) 987-6543',
      type: 'phone',
      reason: 'Do not call list',
      dateAdded: '2025-01-12',
      source: 'Import'
    }
  ];

  const filteredOptOuts = optOutList?.filter(item =>
    item?.contact?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.reason?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleAddOptOut = () => {
    // Handle adding new opt-out
    console.log('Adding opt-out:', newOptOut);
    setNewOptOut({ email: '', phone: '', reason: '' });
    setShowAddForm(false);
  };

  const handleRemoveOptOut = (id) => {
    // Handle removing opt-out
    console.log('Removing opt-out:', id);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Opt-Out Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage suppression lists and automated opt-out handling
            </p>
          </div>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add Opt-Out
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by contact or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <Button variant="outline" iconName="Download">
            Export List
          </Button>
        </div>

        {showAddForm && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Add New Opt-Out</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={newOptOut?.email}
                onChange={(e) => setNewOptOut({ ...newOptOut, email: e?.target?.value })}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                value={newOptOut?.phone}
                onChange={(e) => setNewOptOut({ ...newOptOut, phone: e?.target?.value })}
              />
              <Input
                label="Reason"
                type="text"
                placeholder="Reason for opt-out"
                value={newOptOut?.reason}
                onChange={(e) => setNewOptOut({ ...newOptOut, reason: e?.target?.value })}
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Button variant="default" onClick={handleAddOptOut}>
                Add to List
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {filteredOptOuts?.map((item) => (
            <div key={item?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-card rounded-lg">
                  <Icon name={item?.type === 'email' ? 'Mail' : 'Phone'} size={16} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item?.contact}</p>
                  <p className="text-sm text-muted-foreground">{item?.reason}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-foreground">{item?.dateAdded}</p>
                  <p className="text-xs text-muted-foreground">{item?.source}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOptOut(item?.id)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredOptOuts?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No opt-outs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptOutManagement;