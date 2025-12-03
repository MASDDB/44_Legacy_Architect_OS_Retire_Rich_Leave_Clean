import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsPanel = ({ selectedLeads, onAction, isVisible, onClose }) => {
  const [activeAction, setActiveAction] = useState(null);

  const bulkActions = [
    {
      id: 'segment',
      label: 'Segment Leads',
      icon: 'Tag',
      description: 'Group leads by criteria',
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'remove-duplicates',
      label: 'Remove Duplicates',
      icon: 'Copy',
      description: 'Find and remove duplicate entries',
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100'
    },
    {
      id: 'validate',
      label: 'Validate Data',
      icon: 'CheckCircle',
      description: 'Check email and phone validity',
      color: 'text-green-600 bg-green-50 hover:bg-green-100'
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: 'Download',
      description: 'Download leads as CSV/Excel',
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'delete',
      label: 'Delete Leads',
      icon: 'Trash2',
      description: 'Permanently remove selected leads',
      color: 'text-red-600 bg-red-50 hover:bg-red-100'
    },
    {
      id: 'assign-campaign',
      label: 'Assign to Campaign',
      icon: 'Target',
      description: 'Add leads to existing campaign',
      color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
    }
  ];

  const handleActionClick = (actionId) => {
    setActiveAction(actionId);
    onAction(actionId, selectedLeads);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-500 lg:relative lg:bg-transparent lg:z-auto">
      <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-elevated lg:relative lg:w-full lg:h-auto lg:shadow-none lg:border lg:rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bulk Actions</h3>
              <p className="text-sm text-muted-foreground">
                {selectedLeads?.length} leads selected
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-3">
            {bulkActions?.map((action) => (
              <button
                key={action?.id}
                onClick={() => handleActionClick(action?.id)}
                disabled={selectedLeads?.length === 0}
                className={`w-full p-4 rounded-lg border border-border text-left transition-all hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeAction === action?.id ? 'ring-2 ring-primary/20' : ''
                } ${action?.color}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={action?.icon} size={20} className="text-current" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-current">{action?.label}</h4>
                    <p className="text-sm text-current/70 mt-1">{action?.description}</p>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-current/50" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="Lightbulb" size={16} className="mr-2 text-primary" />
                Quick Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use Ctrl/Cmd + A to select all leads</li>
                <li>• Segment leads before creating campaigns</li>
                <li>• Always validate data before processing</li>
                <li>• Export processed leads for backup</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsPanel;