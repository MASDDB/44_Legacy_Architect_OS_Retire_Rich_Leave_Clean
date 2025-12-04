import React, { useState } from 'react';
import Button from '../../ui/Button';
import Icon from '../../AppIcon';

const RFIsView = ({ rfis = [], onAdd, onUpdate, onDelete, isDemo = false }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Demo data
    const demoRFIs = [
        { id: 1, title: 'Customer Contract Details - Top 10 Customers', category: 'Commercial', priority: 'high', status: 'completed', requestDate: '2024-11-20', dueDate: '2024-11-27', responseDate: '2024-11-25', requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 2 },
        { id: 2, title: 'EPA Compliance & Refrigerant Handling', category: 'Legal', priority: 'high', status: 'completed', requestDate: '2024-11-22', dueDate: '2024-12-01', responseDate: '2024-11-28', requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 3 },
        { id: 3, title: 'Technician Certification Records', category: 'HR', priority: 'medium', status: 'in_progress', requestDate: '2024-11-25', dueDate: '2024-12-08', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 1 },
        { id: 4, title: 'Fleet Maintenance & Vehicle Records', category: 'Operations', priority: 'medium', status: 'in_progress', requestDate: '2024-11-26', dueDate: '2024-12-10', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 0 },
        { id: 5, title: 'Parts Supplier Concentration', category: 'Commercial', priority: 'high', status: 'pending', requestDate: '2024-11-28', dueDate: '2024-12-12', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 0 },
        { id: 6, title: 'Service Territory & Customer Demographics', category: 'Commercial', priority: 'medium', status: 'pending', requestDate: '2024-11-29', dueDate: '2024-12-13', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 0 },
        { id: 7, title: 'Financial Projections & Seasonality', category: 'Financial', priority: 'high', status: 'pending', requestDate: '2024-11-30', dueDate: '2024-12-14', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Owner', documents: 0 },
        { id: 8, title: 'Software Systems & CRM Platform', category: 'Technology', priority: 'low', status: 'pending', requestDate: '2024-12-01', dueDate: '2024-12-15', responseDate: null, requestedBy: 'Private Equity Buyer', assignedTo: 'Operations Manager', documents: 0 }
    ];

    const displayRFIs = rfis.length > 0 ? rfis : (isDemo ? demoRFIs : []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-success/10 text-success border-success/30';
            case 'in_progress':
                return 'bg-accent/10 text-accent border-accent/30';
            case 'pending':
                return 'bg-warning/10 text-warning border-warning/30';
            case 'overdue':
                return 'bg-destructive/10 text-destructive border-destructive/30';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-destructive';
            case 'medium':
                return 'text-warning';
            case 'low':
                return 'text-muted-foreground';
            default:
                return 'text-muted-foreground';
        }
    };

    const filteredRFIs = selectedFilter === 'all'
        ? displayRFIs
        : displayRFIs.filter(rfi => rfi.status === selectedFilter);

    const completedCount = displayRFIs.filter(r => r.status === 'completed').length;
    const inProgressCount = displayRFIs.filter(r => r.status === 'in_progress').length;
    const pendingCount = displayRFIs.filter(r => r.status === 'pending').length;

    return (
        <div>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total RFIs</span>
                        <Icon name="List" size={18} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{displayRFIs.length}</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <Icon name="CheckCircle" size={18} className="text-success" />
                    </div>
                    <div className="text-2xl font-bold text-success">{completedCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {Math.round((completedCount / displayRFIs.length) * 100)}% complete
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">In Progress</span>
                        <Icon name="Clock" size={18} className="text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-accent">{inProgressCount}</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <Icon name="AlertCircle" size={18} className="text-warning" />
                    </div>
                    <div className="text-2xl font-bold text-warning">{pendingCount}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-foreground hover:border-primary/50'
                        }`}
                >
                    All ({displayRFIs.length})
                </button>
                <button
                    onClick={() => setSelectedFilter('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'pending'
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-foreground hover:border-primary/50'
                        }`}
                >
                    Pending ({pendingCount})
                </button>
                <button
                    onClick={() => setSelectedFilter('in_progress')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'in_progress'
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-foreground hover:border-primary/50'
                        }`}
                >
                    In Progress ({inProgressCount})
                </button>
                <button
                    onClick={() => setSelectedFilter('completed')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'completed'
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border text-foreground hover:border-primary/50'
                        }`}
                >
                    Completed ({completedCount})
                </button>
            </div>

            {/* RFI List */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <div className="space-y-3">
                    {filteredRFIs.map((rfi) => (
                        <div
                            key={rfi.id}
                            className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-sm font-semibold text-foreground">{rfi.title}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(rfi.status)}`}>
                                            {rfi.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Icon name="Flag" size={14} className={getPriorityColor(rfi.priority)} />
                                            <span className={`text-xs font-medium capitalize ${getPriorityColor(rfi.priority)}`}>
                                                {rfi.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                                        <div>
                                            <span className="block font-medium text-foreground mb-1">Category</span>
                                            {rfi.category}
                                        </div>
                                        <div>
                                            <span className="block font-medium text-foreground mb-1">Requested By</span>
                                            {rfi.requestedBy}
                                        </div>
                                        <div>
                                            <span className="block font-medium text-foreground mb-1">Assigned To</span>
                                            {rfi.assignedTo}
                                        </div>
                                        <div>
                                            <span className="block font-medium text-foreground mb-1">Due Date</span>
                                            {new Date(rfi.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    {rfi.documents > 0 && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded text-xs text-primary">
                                            <Icon name="Paperclip" size={14} />
                                            <span>{rfi.documents}</span>
                                        </div>
                                    )}
                                    <Button variant="ghost" size="sm" iconName="Eye">
                                        View
                                    </Button>
                                </div>
                            </div>
                            {rfi.responseDate && (
                                <div className="text-xs text-muted-foreground">
                                    <Icon name="CheckCircle" size={12} className="inline mr-1 text-success" />
                                    Responded on {new Date(rfi.responseDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Guidance */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                        <Icon name="Lightbulb" size={24} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">RFI Response Tips</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Quick and thorough responses to RFIs demonstrate operational maturity and build buyer confidence.
                            Aim to respond to high-priority requests within 3-5 business days.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                                <span>Assign a clear owner for each RFI</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                                <span>Set internal deadlines 2-3 days before due date</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                                <span>Attach supporting documentation where available</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                                <span>Keep responses clear, concise, and data-driven</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RFIsView;
