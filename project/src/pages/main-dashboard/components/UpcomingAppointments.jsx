import React from 'react';


import { Calendar, Clock, Video, MapPin } from 'lucide-react';

const UpcomingAppointments = ({ appointments = [] }) => {
  // Use optional chaining for safe data access
  const upcomingAppointments = appointments?.slice(0, 5) || [];

  const formatDateTime = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return {
      date: date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-gray-600 bg-gray-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return appointmentDate?.toDateString() === today?.toDateString();
  };

  const isTomorrow = (dateString) => {
    if (!dateString) return false;
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    const appointmentDate = new Date(dateString);
    return appointmentDate?.toDateString() === tomorrow?.toDateString();
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        </div>
        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
          {upcomingAppointments?.length || 0} scheduled
        </span>
      </div>
      <div className="space-y-4">
        {upcomingAppointments?.length > 0 ? (
          upcomingAppointments?.map((appointment) => {
            const dateTime = formatDateTime(appointment?.scheduled_at);
            const showToday = isToday(appointment?.scheduled_at);
            const showTomorrow = isTomorrow(appointment?.scheduled_at);
            
            return (
              <div 
                key={appointment?.id} 
                className={`p-4 rounded-lg border-l-4 transition-colors duration-200 ${
                  showToday 
                    ? 'bg-blue-50 border-l-blue-500 hover:bg-blue-100' 
                    : showTomorrow
                    ? 'bg-yellow-50 border-l-yellow-500 hover:bg-yellow-100' :'bg-gray-50 border-l-gray-300 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {appointment?.title || 'Untitled Meeting'}
                    </h4>
                    {appointment?.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {appointment?.description}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment?.appointment_status)}`}>
                    {appointment?.appointment_status?.replace('_', ' ') || 'scheduled'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {showToday ? 'Today' : showTomorrow ? 'Tomorrow' : dateTime?.date}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{dateTime?.time}</span>
                      {appointment?.duration_minutes && (
                        <span className="text-gray-400">
                          ({appointment?.duration_minutes}min)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {appointment?.lead && (
                  <div className="flex items-center space-x-2 mb-3 p-2 bg-white rounded border border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {appointment?.lead?.first_name?.[0] || 'L'}{appointment?.lead?.last_name?.[0] || ''}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment?.lead?.first_name || 'Unknown'} {appointment?.lead?.last_name || 'Contact'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {appointment?.lead?.company?.name || appointment?.lead?.job_title || 'No company info'}
                      </p>
                    </div>
                    {appointment?.lead?.estimated_value && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Est. Value</p>
                        <p className="text-sm font-semibold text-green-600">
                          ${parseInt(appointment?.lead?.estimated_value)?.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {appointment?.meeting_link && (
                      <div className="flex items-center space-x-1 text-sm text-blue-600">
                        <Video className="w-4 h-4" />
                        <span>Video Call</span>
                      </div>
                    )}
                    {appointment?.meeting_location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-32">{appointment?.meeting_location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {appointment?.meeting_link && (
                      <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        Join
                      </button>
                    )}
                    <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      Details
                    </button>
                  </div>
                </div>
                {appointment?.notes && (
                  <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Notes: </span>
                      {appointment?.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No upcoming appointments</p>
            <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              Schedule a meeting
            </button>
          </div>
        )}
      </div>
      {upcomingAppointments?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            View Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;