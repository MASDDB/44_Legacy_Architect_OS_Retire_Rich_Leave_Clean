import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, User, ExternalLink } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { supabase } from '../../lib/supabase';

const getStatusColor = (status) => {
    switch (status) {
        case 'scheduled': return 'bg-blue-100 text-blue-800';
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'completed': return 'bg-gray-100 text-gray-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'no_show': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const TodaysAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);

                // Query appointments where appointment_status = 'scheduled'
                // Order by scheduled_at DESC
                const { data, error: fetchError } = await supabase
                    ?.from('appointments')
                    ?.select(`
            *,
            lead:leads(id, first_name, last_name, email, company_id)
          `)
                    ?.eq('appointment_status', 'scheduled')
                    ?.order('scheduled_at', { ascending: false });

                if (fetchError) throw fetchError;
                setAppointments(data || []);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError(err?.message || 'Failed to load appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const formatDateTime = (dateString) => {
        if (!dateString) return { date: 'No date', time: '' };
        const d = new Date(dateString);
        return {
            date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const isToday = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString).toDateString() === new Date().toDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const todayAppts = appointments.filter(a => isToday(a?.scheduled_at));
    const futureAppts = appointments.filter(a => !isToday(a?.scheduled_at));

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar onToggle={() => { }} />
                <main className="flex-1 ml-64 p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-blue-600" />
                            Today's Appointments
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {appointments.length} scheduled appointment{appointments.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Today Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            Today ({todayAppts.length})
                        </h2>
                        {todayAppts.length > 0 ? (
                            <div className="space-y-3">
                                {todayAppts.map((appt) => (
                                    <AppointmentCard key={appt?.id} appointment={appt} highlight />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                                <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                <p>No appointments scheduled for today</p>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Section */}
                    {futureAppts.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                Other Scheduled ({futureAppts.length})
                            </h2>
                            <div className="space-y-3">
                                {futureAppts.map((appt) => (
                                    <AppointmentCard key={appt?.id} appointment={appt} />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const AppointmentCard = ({ appointment, highlight = false }) => {
    const { date, time } = (() => {
        if (!appointment?.scheduled_at) return { date: 'No date', time: '' };
        const d = new Date(appointment.scheduled_at);
        return {
            date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
    })();

    const leadName = appointment?.lead
        ? `${appointment.lead.first_name || ''} ${appointment.lead.last_name || ''}`.trim() || 'Unknown Lead'
        : 'No lead linked';

    return (
        <div className={`bg-white rounded-lg border p-4 ${highlight ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
            }`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                        {appointment?.title || 'Untitled Meeting'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {time}
                            {appointment?.duration_minutes && ` (${appointment.duration_minutes} min)`}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {leadName}
                        </span>
                        {appointment?.assigned_to && (
                            <span className="text-gray-500">
                                Assigned: {appointment.assigned_to}
                            </span>
                        )}
                    </div>
                    {appointment?.meeting_link && (
                        <a
                            href={appointment.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:underline"
                        >
                            <Video className="w-3 h-3" /> Join Meeting <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(appointment?.appointment_status)}`}>
                    {(appointment?.appointment_status || 'scheduled').replace('_', ' ')}
                </span>
            </div>
        </div>
    );
};

export default TodaysAppointments;
