import React, { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Icon from '../../AppIcon';

const ContractsView = ({ contracts = [], onAdd, onEdit, onDelete, isDemo = false }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newContract, setNewContract] = useState({
        contract_name: '',
        contract_type: 'Customer Agreement',
        counterparty: '',
        value: '',
        term_length: '',
        change_of_control: false,
        auto_renewal: false,
        notes: ''
    });

    // Demo data for when contracts array is empty
    const demoContracts = [
        { id: 1, contract_name: 'Maintenance Agreement - City School District', contract_type: 'Customer Agreement', counterparty: 'City School District #45', value: '$500,000', term_length: '3 years', change_of_control: true, auto_renewal: true, status: 'Active' },
        { id: 2, contract_name: 'Commercial HVAC Services - Metro Office Park', contract_type: 'Customer Agreement', counterparty: 'Metro Office Park LLC', value: '$380,000', term_length: '2 years', change_of_control: true, auto_renewal: true, status: 'Active' },
        { id: 3, contract_name: 'Parts Supplier Agreement', contract_type: 'Vendor Agreement', counterparty: 'HVAC Supply Company', value: '$450,000', term_length: '1 year', change_of_control: false, auto_renewal: true, status: 'Active' },
        { id: 4, contract_name: 'Equipment Lease - Service Trucks', contract_type: 'Lease', counterparty: 'Commercial Fleet Leasing', value: '$120,000', term_length: '5 years', change_of_control: false, auto_renewal: false, status: 'Active' },
        { id: 5, contract_name: 'Employment Agreement - Operations Manager', contract_type: 'Employment', counterparty: 'Sarah Johnson', value: '$95,000', term_length: 'At-will', change_of_control: true, auto_renewal: false, status: 'Active' }
    ];

    const displayContracts = contracts.length > 0 ? contracts : (isDemo ? demoContracts : []);

    const contractTypeOptions = [
        { value: 'Customer Agreement', label: 'Customer Agreement' },
        { value: 'Vendor Agreement', label: 'Vendor Agreement' },
        { value: 'Employment', label: 'Employment' },
        { value: 'Lease', label: 'Lease' },
        { value: 'Partnership', label: 'Partnership' },
        { value: 'Other', label: 'Other' }
    ];

    const handleAddContract = () => {
        if (onAdd) {
            onAdd(newContract);
        }
        setShowAddModal(false);
        setNewContract({
            contract_name: '',
            contract_type: 'Customer Agreement',
            counterparty: '',
            value: '',
            term_length: '',
            change_of_control: false,
            auto_renewal: false,
            notes: ''
        });
    };

    const changeOfControlContracts = displayContracts.filter(c => c.change_of_control).length;
    const totalValue = displayContracts.reduce((sum, c) => {
        const value = parseFloat(c.value.replace(/[\$,]/g, ''));
        return sum + (isNaN(value) ? 0 : value);
    }, 0);

    return (
        <div>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Contracts</span>
                        <Icon name="FileText" size={18} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{displayContracts.length}</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Contract Value</span>
                        <Icon name="DollarSign" size={18} className="text-success" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        ${(totalValue / 1000000).toFixed(1)}M
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Change of Control</span>
                        <Icon name="AlertTriangle" size={18} className="text-warning" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{changeOfControlContracts}</div>
                    <div className="text-xs text-muted-foreground mt-1">Require attention</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Auto-Renewal</span>
                        <Icon name="RefreshCw" size={18} className="text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {displayContracts.filter(c => c.auto_renewal).length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Contracts</div>
                </div>
            </div>

            {/* Contracts List */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Contract Index</h2>
                    {!isDemo && onAdd && (
                        <Button onClick={() => setShowAddModal(true)} iconName="Plus">
                            Add Contract
                        </Button>
                    )}
                </div>

                {displayContracts.length > 0 ? (
                    <div className="space-y-3">
                        {displayContracts.map((contract) => (
                            <div
                                key={contract.id}
                                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0">
                                        <Icon name="FileText" size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-medium text-foreground truncate">
                                                {contract.contract_name}
                                            </h3>
                                            {contract.change_of_control && (
                                                <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs font-medium rounded">
                                                    CoC
                                                </span>
                                            )}
                                            {contract.auto_renewal && (
                                                <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded">
                                                    Auto-Renew
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>{contract.contract_type}</span>
                                            <span>•</span>
                                            <span>{contract.counterparty}</span>
                                            <span>•</span>
                                            <span>{contract.value}</span>
                                            <span>•</span>
                                            <span>{contract.term_length}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" iconName="Eye">
                                    View
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                                <Icon name="FileText" size={32} className="text-muted-foreground" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            No contracts added yet
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                            Start indexing your material contracts by adding key contract information
                        </p>
                        {!isDemo && onAdd && (
                            <Button onClick={() => setShowAddModal(true)} iconName="Plus">
                                Add Your First Contract
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Contract Modal */}
            {showAddModal && !isDemo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                            <h2 className="text-xl font-bold text-foreground">Add Contract</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Icon name="X" size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Contract Name *
                                </label>
                                <Input
                                    value={newContract.contract_name}
                                    onChange={(e) => setNewContract({ ...newContract, contract_name: e.target.value })}
                                    placeholder="e.g., Master Service Agreement - ABC Corp"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Contract Type *
                                </label>
                                <Select
                                    value={newContract.contract_type}
                                    onValueChange={(value) => setNewContract({ ...newContract, contract_type: value })}
                                    options={contractTypeOptions}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Counterparty *
                                </label>
                                <Input
                                    value={newContract.counterparty}
                                    onChange={(e) => setNewContract({ ...newContract, counterparty: e.target.value })}
                                    placeholder="e.g., ABC Corporation"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Contract Value
                                    </label>
                                    <Input
                                        value={newContract.value}
                                        onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
                                        placeholder="$100,000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Term Length
                                    </label>
                                    <Input
                                        value={newContract.term_length}
                                        onChange={(e) => setNewContract({ ...newContract, term_length: e.target.value })}
                                        placeholder="e.g., 3 years"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newContract.change_of_control}
                                        onChange={(e) => setNewContract({ ...newContract, change_of_control: e.target.checked })}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm text-foreground">Change of Control Clause</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newContract.auto_renewal}
                                        onChange={(e) => setNewContract({ ...newContract, auto_renewal: e.target.checked })}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm text-foreground">Auto-Renewal</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={newContract.notes}
                                    onChange={(e) => setNewContract({ ...newContract, notes: e.target.value })}
                                    placeholder="Additional notes about this contract..."
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-border flex items-center justify-end gap-3 sticky bottom-0 bg-card">
                            <Button variant="outline" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddContract}
                                disabled={!newContract.contract_name || !newContract.counterparty}
                            >
                                Add Contract
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractsView;
