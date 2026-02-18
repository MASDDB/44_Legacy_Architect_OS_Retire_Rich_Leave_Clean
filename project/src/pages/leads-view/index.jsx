import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useLeads } from '../../hooks/useSupabaseData';

const LEAD_STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'new': return 'bg-blue-100 text-blue-800';
        case 'contacted': return 'bg-purple-100 text-purple-800';
        case 'qualified': return 'bg-green-100 text-green-800';
        case 'proposal': return 'bg-indigo-100 text-indigo-800';
        case 'closed_won': return 'bg-emerald-100 text-emerald-800';
        case 'closed_lost': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'urgent': return 'bg-red-100 text-red-800';
        case 'high': return 'bg-orange-100 text-orange-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const LeadsView = () => {
    const navigate = useNavigate();
    const { leads, loading, error } = useLeads();
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('next_follow_up');
    const [sortAsc, setSortAsc] = useState(true);

    const filteredLeads = useMemo(() => {
        if (!leads) return [];
        let result = [...leads];

        // Filter by lead_status
        if (statusFilter) {
            result = result.filter(lead => lead?.lead_status === statusFilter);
        }

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(lead =>
                (lead?.first_name || '').toLowerCase().includes(q) ||
                (lead?.last_name || '').toLowerCase().includes(q) ||
                (lead?.email || '').toLowerCase().includes(q) ||
                (lead?.company?.name || '').toLowerCase().includes(q)
            );
        }

        // Sort
        result.sort((a, b) => {
            let aVal = a?.[sortField];
            let bVal = b?.[sortField];
            if (sortField === 'next_follow_up' || sortField === 'created_at') {
                aVal = aVal ? new Date(aVal).getTime() : 0;
                bVal = bVal ? new Date(bVal).getTime() : 0;
            }
            if (sortField === 'estimated_value') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            }
            if (aVal < bVal) return sortAsc ? -1 : 1;
            if (aVal > bVal) return sortAsc ? 1 : -1;
            return 0;
        });

        return result;
    }, [leads, statusFilter, searchQuery, sortField, sortAsc]);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const SortIcon = ({ field }) => (
        <ArrowUpDown
            className={`w-3 h-3 inline ml-1 ${sortField === field ? 'text-blue-600' : 'text-gray-400'}`}
        />
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar onToggle={() => { }} />
                <main className="flex-1 ml-64 p-8">
                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-blue-600" />
                                    Leads
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
                                    {statusFilter && ` with status "${statusFilter.replace('_', ' ')}"`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border-none outline-none text-sm text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 bg-white"
                            >
                                {LEAD_STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
                            Error loading leads: {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th
                                            className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleSort('first_name')}
                                        >
                                            Name <SortIcon field="first_name" />
                                        </th>
                                        <th
                                            className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleSort('lead_status')}
                                        >
                                            Status <SortIcon field="lead_status" />
                                        </th>
                                        <th
                                            className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleSort('priority')}
                                        >
                                            Priority <SortIcon field="priority" />
                                        </th>
                                        <th
                                            className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleSort('estimated_value')}
                                        >
                                            Est. Value <SortIcon field="estimated_value" />
                                        </th>
                                        <th
                                            className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleSort('next_follow_up')}
                                        >
                                            Next Follow-up <SortIcon field="next_follow_up" />
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                            Assigned To
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredLeads.length > 0 ? (
                                        filteredLeads.map((lead) => (
                                            <tr
                                                key={lead?.id}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => navigate(`/leads/${lead?.id}`)}
                                            >
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {lead?.first_name || 'Unknown'} {lead?.last_name || ''}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{lead?.email || ''}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead?.lead_status)}`}>
                                                        {(lead?.lead_status || 'new').replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead?.priority)}`}>
                                                        {lead?.priority || 'medium'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {lead?.estimated_value
                                                        ? `$${parseFloat(lead.estimated_value).toLocaleString()}`
                                                        : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {lead?.next_follow_up
                                                        ? new Date(lead.next_follow_up).toLocaleDateString()
                                                        : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {lead?.assigned_user?.full_name || lead?.assigned_to || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No leads found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LeadsView;
