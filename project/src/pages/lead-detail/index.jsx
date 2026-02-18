import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Mail, Phone, Building2, Briefcase,
    Calendar, DollarSign, Clock, Plus, X
} from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { supabase } from '../../lib/supabase';

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

const getAppointmentStatusColor = (status) => {
    switch (status) {
        case 'scheduled': return 'bg-blue-100 text-blue-800';
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'completed': return 'bg-gray-100 text-gray-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'no_show': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        scheduled_at: '',
        duration_minutes: 30,
        description: '',
        meeting_link: '',
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch lead with company join
                const { data: leadData, error: leadError } = await supabase
                    ?.from('leads')
                    ?.select(`
            *,
            company:companies(*)
          `)
                    ?.eq('id', id)
                    ?.single();

                if (leadError) throw leadError;
                setLead(leadData);

                // Fetch related appointments (appointments.lead_id = leads.id)
                const { data: apptData, error: apptError } = await supabase
                    ?.from('appointments')
                    ?.select('*')
                    ?.eq('lead_id', id)
                    ?.order('scheduled_at', { ascending: false });

                if (apptError) throw apptError;
                setAppointments(apptData || []);
            } catch (err) {
                console.error('Error fetching lead detail:', err);
                setError(err?.message || 'Failed to load lead');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleCreateAppointment = async (e) => {
        e.preventDefault();
        try {
            setCreating(true);
            const { data, error: createError } = await supabase
                ?.from('appointments')
                ?.insert({
                    lead_id: id,
                    title: formData.title || 'Meeting',
                    scheduled_at: formData.scheduled_at,
                    appointment_status: 'scheduled',
                    duration_minutes: parseInt(formData.duration_minutes) || 30,
                    description: formData.description || null,
                    meeting_link: formData.meeting_link || null,
                })
                ?.select()
                ?.single();

            if (createError) throw createError;

            setAppointments(prev => [data, ...prev]);
            setShowCreateForm(false);
            setFormData({ title: '', scheduled_at: '', duration_minutes: 30, description: '', meeting_link: '' });
        } catch (err) {
            console.error('Error creating appointment:', err);
            alert('Failed to create appointment: ' + (err?.message || 'Unknown error'));
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !lead) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                    <Sidebar onToggle={() => { }} />
                    <main className="flex-1 ml-64 p-8">
                        <div className="text-center py-16">
                            <p className="text-red-600 mb-4">{error || 'Lead not found'}</p>
                            <button onClick={() => navigate('/leads')} className="text-blue-600 hover:underline">
                                ← Back to Leads
                            </button>
                        </div>
                    </main>
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
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/leads')}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Leads
                    </button>

                    {/* Lead Header */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                                    {lead?.first_name?.[0] || 'U'}{lead?.last_name?.[0] || ''}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {lead?.first_name || 'Unknown'} {lead?.last_name || ''}
                                    </h1>
                                    <p className="text-gray-600">
                                        {lead?.job_title || ''}
                                        {lead?.company?.name && ` at ${lead.company.name}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(lead?.lead_status)}`}>
                                    {(lead?.lead_status || 'new').replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lead Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoField icon={Mail} label="Email" value={lead?.email} />
                                    <InfoField icon={Phone} label="Phone" value={lead?.phone} />
                                    <InfoField icon={Briefcase} label="Job Title" value={lead?.job_title} />
                                    <InfoField icon={Building2} label="Company" value={lead?.company?.name} />
                                    <InfoField icon={User} label="Lead Source" value={lead?.lead_source} />
                                    <InfoField icon={DollarSign} label="Estimated Value"
                                        value={lead?.estimated_value ? `$${parseFloat(lead.estimated_value).toLocaleString()}` : null} />
                                    <InfoField icon={Calendar} label="Last Contacted"
                                        value={lead?.last_contacted ? new Date(lead.last_contacted).toLocaleDateString() : null} />
                                    <InfoField icon={Clock} label="Next Follow-up"
                                        value={lead?.next_follow_up ? new Date(lead.next_follow_up).toLocaleDateString() : null} />
                                </div>
                                {lead?.notes && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">Notes</p>
                                        <p className="text-sm text-gray-700">{lead.notes}</p>
                                    </div>
                                )}
                                {lead?.tags && lead.tags.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(lead.tags) ? lead.tags : [lead.tags]).map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Appointments Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Appointments ({appointments.length})
                                    </h2>
                                    <button
                                        onClick={() => setShowCreateForm(!showCreateForm)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {showCreateForm ? 'Cancel' : 'New Appointment'}
                                    </button>
                                </div>

                                {/* Create Appointment Form */}
                                {showCreateForm && (
                                    <form onSubmit={handleCreateAppointment} className="bg-blue-50 rounded-lg p-4 mb-4 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                    placeholder="Meeting title"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Date & Time *</label>
                                                <input
                                                    type="datetime-local"
                                                    value={formData.scheduled_at}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Duration (min)</label>
                                                <input
                                                    type="number"
                                                    value={formData.duration_minutes}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                                                    min="5"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Meeting Link</label>
                                                <input
                                                    type="url"
                                                    value={formData.meeting_link}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, meeting_link: e.target.value }))}
                                                    placeholder="https://..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={creating || !formData.scheduled_at}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                            >
                                                {creating ? 'Creating...' : 'Create Appointment'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Defaults: appointment_status = "scheduled", duration = 30 min
                                        </p>
                                    </form>
                                )}

                                {/* Appointments List */}
                                {appointments.length > 0 ? (
                                    <div className="space-y-3">
                                        {appointments.map((appt) => (
                                            <div key={appt?.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {appt?.title || 'Untitled'}
                                                    </h4>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getAppointmentStatusColor(appt?.appointment_status)}`}>
                                                        {(appt?.appointment_status || 'scheduled').replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {appt?.scheduled_at
                                                            ? new Date(appt.scheduled_at).toLocaleString()
                                                            : 'No date'}
                                                    </span>
                                                    {appt?.duration_minutes && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {appt.duration_minutes} min
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-6">
                                        No appointments for this lead yet.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Info</h3>
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-gray-500">Priority</dt>
                                        <dd className="font-medium text-gray-900 capitalize">{lead?.priority || 'medium'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500">Assigned To</dt>
                                        <dd className="font-medium text-gray-900">{lead?.assigned_to || '—'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500">Created</dt>
                                        <dd className="font-medium text-gray-900">
                                            {lead?.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500">Updated</dt>
                                        <dd className="font-medium text-gray-900">
                                            {lead?.updated_at ? new Date(lead.updated_at).toLocaleDateString() : '—'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm text-gray-900">{value || '—'}</p>
        </div>
    </div>
);

export default LeadDetail;
