import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import smsService from '../../../services/smsService';

const SMSCampaignBuilder = ({
  campaign,
  selectedLeads = [],
  onSendSMS,
  onClose,
  isOpen
}) => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [messagePreview, setMessagePreview] = useState('');

  // SMS character limits
  const SMS_LIMIT = 160;
  const LONG_SMS_LIMIT = 1600;

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    setCharacterCount(message?.length || 0);
    generatePreview();
  }, [message, selectedLeads]);

  // Reset form when closing
  useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setSelectedTemplate('');
      setSendResults(null);
      setCharacterCount(0);
      setMessagePreview('');
      setIsSending(false);
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      const data = await smsService?.getSMSTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      // Set fallback templates for demo
      setTemplates([
        {
          id: 'follow-up-1',
          name: 'Follow-up Message',
          category: 'Follow-up',
          content: 'Hi {{first_name}}, thanks for your interest in our services. When would be a good time to chat about how we can help {{company_name}}?'
        },
        {
          id: 'appointment-reminder',
          name: 'Appointment Reminder',
          category: 'Reminder',
          content: 'Hi {{first_name}}, this is a reminder about your appointment tomorrow. Looking forward to speaking with you!'
        },
        {
          id: 'introduction',
          name: 'Introduction',
          category: 'Cold Outreach',
          content: 'Hi {{first_name}}, I noticed {{company_name}} might benefit from our solutions. Would you be interested in a quick 15-minute call?'
        }
      ]);
    }
  };

  const generatePreview = () => {
    if (!message || selectedLeads?.length === 0) {
      setMessagePreview(message);
      return;
    }

    // Use first lead for preview
    const firstLead = selectedLeads?.[0];
    let preview = message;
    
    preview = preview?.replace(/\{\{first_name\}\}/g, firstLead?.first_name || 'John');
    preview = preview?.replace(/\{\{last_name\}\}/g, firstLead?.last_name || 'Doe');
    preview = preview?.replace(/\{\{full_name\}\}/g, `${firstLead?.first_name || 'John'} ${firstLead?.last_name || 'Doe'}`);
    preview = preview?.replace(/\{\{company_name\}\}/g, firstLead?.company?.name || 'Company Name');
    
    setMessagePreview(preview);
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates?.find(t => t?.id === templateId);
    if (template) {
      setMessage(template?.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleSendSMS = async () => {
    if (!message?.trim() || selectedLeads?.length === 0) {
      alert('Please enter a message and select leads to send to.');
      return;
    }

    setIsSending(true);
    setSendResults(null);

    try {
      const leadIds = selectedLeads?.map(lead => lead?.id);
      const results = await smsService?.sendBulkSMS(campaign?.id, leadIds, message);
      
      setSendResults(results);
      onSendSMS?.(results);
      
      // Show summary
      const successful = results?.filter(r => r?.success)?.length;
      const failed = results?.filter(r => !r?.success)?.length;
      
      if (failed === 0) {
        alert(`Successfully sent SMS to all ${successful} leads!`);
      } else {
        alert(`SMS sent to ${successful} leads, ${failed} failed. Check results for details.`);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert(`Error sending SMS: ${error?.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const getCharacterColor = () => {
    if (characterCount > LONG_SMS_LIMIT) return 'text-red-500';
    if (characterCount > SMS_LIMIT) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getSMSCount = () => {
    if (characterCount <= SMS_LIMIT) return 1;
    return Math.ceil(characterCount / SMS_LIMIT);
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget && !isSending) {
      onClose?.();
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e?.key === 'Escape' && isOpen && !isSending) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, onClose, isSending]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">SMS Campaign Builder</h2>
            <p className="text-sm text-gray-600 mt-1">
              Send SMS to {selectedLeads?.length} selected lead{selectedLeads?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Template (Optional)
            </label>
            <Select
              value={selectedTemplate}
              onChange={handleTemplateSelect}
              className="w-full"
              disabled={isSending}
            >
              <option value="">Custom Message</option>
              {templates?.map(template => (
                <option key={template?.id} value={template?.id}>
                  {template?.name} ({template?.category})
                </option>
              ))}
            </Select>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMS Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              placeholder="Enter your SMS message here. Use {{first_name}}, {{last_name}}, {{company_name}} for personalization."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              maxLength={LONG_SMS_LIMIT}
              disabled={isSending}
            />
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center space-x-4">
                <span className={getCharacterColor()}>
                  {characterCount} characters
                </span>
                <span className="text-gray-500">
                  {getSMSCount()} SMS{getSMSCount() > 1 ? ' messages' : ' message'}
                </span>
              </div>
              <div className="text-gray-500">
                Available variables: {`{{first_name}}, {{last_name}}, {{company_name}}`}
              </div>
            </div>
            {characterCount > SMS_LIMIT && (
              <div className="mt-2 text-yellow-600 text-sm">
                ⚠️ Long message will be sent as {getSMSCount()} separate SMS
              </div>
            )}
          </div>

          {/* Message Preview */}
          {messagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview (using first lead data)
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {messagePreview}
                </div>
              </div>
            </div>
          )}

          {/* Selected Leads Summary */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Selected Leads ({selectedLeads?.length})
            </h3>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="p-3 space-y-2">
                {selectedLeads?.slice(0, 10)?.map(lead => (
                  <div key={lead?.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {lead?.first_name} {lead?.last_name}
                    </span>
                    <span className="text-gray-500">
                      {lead?.phone || 'No phone'}
                    </span>
                  </div>
                ))}
                {selectedLeads?.length > 10 && (
                  <div className="text-sm text-gray-500 pt-2 border-t">
                    ... and {selectedLeads?.length - 10} more leads
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Send Results */}
          {sendResults && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Send Results</h3>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                <div className="p-3 space-y-2">
                  {sendResults?.map((result, index) => {
                    const lead = selectedLeads?.find(l => l?.id === result?.leadId);
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>
                          {lead?.first_name} {lead?.last_name}
                        </span>
                        <span className={result?.success ? 'text-green-600' : 'text-red-600'}>
                          {result?.success ? 'Sent' : `Failed: ${result?.error}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {characterCount > SMS_LIMIT && (
              <div className="text-yellow-600">
                ⚠️ Long message will be sent as {getSMSCount()} separate SMS
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Close'}
            </Button>
            <Button
              onClick={handleSendSMS}
              disabled={isSending || !message?.trim() || selectedLeads?.length === 0}
            >
              {isSending ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Send SMS to {selectedLeads?.length} Lead{selectedLeads?.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSCampaignBuilder;