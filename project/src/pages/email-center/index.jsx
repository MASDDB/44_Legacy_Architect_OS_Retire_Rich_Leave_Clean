import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, MessageSquare, Settings, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import Header from '../../components/ui/Header.jsx';
import Sidebar from '../../components/ui/Sidebar.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useEmailNotifications } from '../../hooks/useEmailNotifications.js';
import { useSupabaseData } from '../../hooks/useSupabaseData.js';

const EmailCenter = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  
  const {
    notifications,
    templates,
    preferences,
    loading,
    error,
    fetchNotifications,
    fetchTemplates,
    fetchPreferences,
    sendEmail,
    sendLeadWelcome,
    sendAppointmentConfirmation,
    updatePreferences,
    clearError
  } = useEmailNotifications();

  const { data: leads } = useSupabaseData('leads');
  const { data: appointments } = useSupabaseData('appointments');

  useEffect(() => {
    fetchNotifications();
    fetchTemplates();
    fetchPreferences();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': 
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': 
      case 'bounced':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleSendQuickEmail = async (recipients, subject, content) => {
    try {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>${content?.replace(/\n/g, '<br>')}</p>
          <p>Best regards,<br>Your CRM Team</p>
        </div>
      `;

      const textBody = `${content}\n\nBest regards,\nYour CRM Team`;

      for (const recipient of recipients) {
        await sendEmail({
          recipientEmail: recipient?.email,
          recipientName: `${recipient?.first_name} ${recipient?.last_name}`,
          subject,
          htmlBody,
          textBody,
          notificationType: 'campaign_email',
          relatedEntityId: recipient?.id,
          relatedEntityType: 'lead',
          metadata: { source: 'email_center', manual: true }
        });
      }

      setShowSendModal(false);
      setSelectedRecipients([]);
    } catch (err) {
      console.error('Send email error:', err);
    }
  };

  const handleSendWelcomeEmail = async (leadId) => {
    try {
      const lead = leads?.find(l => l?.id === leadId);
      if (lead) {
        await sendLeadWelcome(lead);
      }
    } catch (err) {
      console.error('Send welcome email error:', err);
    }
  };

  const handleSendAppointmentConfirmation = async (appointmentId) => {
    try {
      const appointment = appointments?.find(a => a?.id === appointmentId);
      const lead = leads?.find(l => l?.id === appointment?.lead_id);
      
      if (appointment && lead) {
        await sendAppointmentConfirmation(appointment, lead);
      }
    } catch (err) {
      console.error('Send appointment confirmation error:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onToggle={() => {}} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Center</h1>
              <p className="text-gray-600">Manage email notifications and templates</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button onClick={clearError} className="ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'notifications'
                      ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'templates' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline-block mr-2" />
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab('quick-send')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'quick-send' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Send className="w-4 h-4 inline-block mr-2" />
                  Quick Send
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'preferences' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings className="w-4 h-4 inline-block mr-2" />
                  Preferences
                </button>
              </nav>
            </div>

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
                  <p className="mt-1 text-sm text-gray-500">Recent email activity and status</p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {loading ? (
                    <div className="p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
                    </div>
                  ) : notifications?.length > 0 ? (
                    notifications?.map((notification) => (
                      <div key={notification?.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(notification?.email_status)}
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {notification?.subject}
                              </h3>
                              <p className="text-sm text-gray-500">
                                To: {notification?.recipient_email}
                                {notification?.recipient_name && ` (${notification?.recipient_name})`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900 capitalize">
                              {notification?.email_status?.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification?.created_at)?.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {notification?.notification_type?.replace('_', ' ')}
                          </span>
                          {notification?.error_message && (
                            <p className="mt-2 text-sm text-red-600">
                              Error: {notification?.error_message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No email notifications found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Email Templates</h2>
                  <p className="mt-1 text-sm text-gray-500">Manage your email templates</p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {templates?.length > 0 ? (
                    templates?.map((template) => (
                      <div key={template?.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {template?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Subject: {template?.subject}
                            </p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {template?.template_type?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No templates found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Send Tab */}
            {activeTab === 'quick-send' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setShowSendModal(true)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Custom Email</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        const leadId = leads?.[0]?.id;
                        if (leadId) handleSendWelcomeEmail(leadId);
                      }}
                      disabled={!leads?.length}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Send Welcome Email
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        const appointmentId = appointments?.[0]?.id;
                        if (appointmentId) handleSendAppointmentConfirmation(appointmentId);
                      }}
                      disabled={!appointments?.length}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Send Appointment Confirmation
                    </Button>
                  </div>
                </div>

                {/* Recent Leads for Quick Actions */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
                    <p className="mt-1 text-sm text-gray-500">Send welcome emails to new leads</p>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {leads?.slice(0, 5)?.map((lead) => (
                      <div key={lead?.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {lead?.first_name} {lead?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{lead?.email}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendWelcomeEmail(lead?.id)}
                        >
                          Send Welcome
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Email Preferences</h2>
                  <p className="mt-1 text-sm text-gray-500">Configure your email notification settings</p>
                </div>
                
                <div className="p-6">
                  {preferences?.length > 0 ? (
                    <div className="space-y-4">
                      {preferences?.map((preference) => (
                        <div key={`${preference?.user_id}-${preference?.notification_type}`} 
                             className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {preference?.notification_type?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preference?.is_enabled}
                              onChange={(e) => {
                                const updated = preferences?.map(p =>
                                  p?.user_id === preference?.user_id && p?.notification_type === preference?.notification_type
                                    ? { ...p, is_enabled: e?.target?.checked }
                                    : p
                                );
                                updatePreferences(updated);
                              }}
                              className="sr-only"
                            />
                            <div className={`w-11 h-6 rounded-full transition-colors ${
                              preference?.is_enabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                preference?.is_enabled ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No preferences configured</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {/* Send Email Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Send Custom Email</h3>
              
              <SendEmailModal
                leads={leads}
                onSend={handleSendQuickEmail}
                onClose={() => setShowSendModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SendEmailModal = ({ leads, onSend, onClose }) => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (selectedLeads?.length > 0 && subject && content) {
      onSend(selectedLeads, subject, content);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Recipients
        </label>
        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
          {leads?.map((lead) => (
            <label key={lead?.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedLeads?.some(l => l?.id === lead?.id)}
                onChange={(e) => {
                  if (e?.target?.checked) {
                    setSelectedLeads([...selectedLeads, lead]);
                  } else {
                    setSelectedLeads(selectedLeads?.filter(l => l?.id !== lead?.id));
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">
                {lead?.first_name} {lead?.last_name} ({lead?.email})
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e?.target?.value)}
          placeholder="Enter email subject"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e?.target?.value)}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email content"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSend}
          disabled={!selectedLeads?.length || !subject || !content}
        >
          Send Email
        </Button>
      </div>
    </div>
  );
};

export default EmailCenter;