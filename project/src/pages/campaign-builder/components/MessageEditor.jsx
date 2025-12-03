import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MessageEditor = ({ message, onSave, onCancel, isOpen }) => {
  const [editedMessage, setEditedMessage] = useState({});
  const [characterCount, setCharacterCount] = useState(0);

  // SMS character limits
  const SMS_LIMIT = 160;
  const LONG_SMS_LIMIT = 1600;

  useEffect(() => {
    if (message && isOpen) {
      setEditedMessage({
        id: message?.id,
        channel: message?.channel || 'sms',
        name: message?.name || '',
        content: message?.content || '',
        subject: message?.subject || '',
        delay: message?.delay || 0,
        template: message?.template || '',
        conditions: message?.conditions || [],
        abTest: message?.abTest || false,
        sendDays: message?.sendDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        sendTimeStart: message?.sendTimeStart || '09:00',
        sendTimeEnd: message?.sendTimeEnd || '17:00',
        respectTimezone: message?.respectTimezone || true,
        skipIfResponded: message?.skipIfResponded || true,
        skipIfBooked: message?.skipIfBooked || true
      });
    }
  }, [message, isOpen]);

  useEffect(() => {
    setCharacterCount(editedMessage?.content?.length || 0);
  }, [editedMessage?.content]);

  const handleSave = () => {
    if (!editedMessage?.name?.trim()) {
      alert('Please enter a message name');
      return;
    }
    
    if (!editedMessage?.content?.trim()) {
      alert('Please enter message content');
      return;
    }

    // Validate SMS character limit
    if (editedMessage?.channel === 'sms' && characterCount > LONG_SMS_LIMIT) {
      alert(`SMS message is too long. Maximum ${LONG_SMS_LIMIT} characters allowed.`);
      return;
    }

    onSave?.(editedMessage);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {message?.id ? 'Edit Message' : 'New Message'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Name *
              </label>
              <Input
                value={editedMessage?.name || ''}
                onChange={(e) => setEditedMessage({ ...editedMessage, name: e?.target?.value })}
                placeholder="Enter message name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel *
              </label>
              <Select
                value={editedMessage?.channel || 'sms'}
                onChange={(value) => setEditedMessage({ ...editedMessage, channel: value })}
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
              </Select>
            </div>
          </div>

          {/* Email Subject (only for email channel) */}
          {editedMessage?.channel === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <Input
                value={editedMessage?.subject || ''}
                onChange={(e) => setEditedMessage({ ...editedMessage, subject: e?.target?.value })}
                placeholder="Enter email subject"
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content *
            </label>
            <textarea
              value={editedMessage?.content || ''}
              onChange={(e) => setEditedMessage({ ...editedMessage, content: e?.target?.value })}
              placeholder={
                editedMessage?.channel === 'sms'
                  ? "Enter your SMS message. Use {{first_name}}, {{last_name}}, {{company_name}} for personalization."
                  : "Enter your message content. Use {{first_name}}, {{last_name}}, {{company_name}} for personalization."
              }
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={editedMessage?.channel === 'sms' ? LONG_SMS_LIMIT : undefined}
            />
            
            {/* Character count for SMS */}
            {editedMessage?.channel === 'sms' && (
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
                  Available variables: {{first_name}}, {{last_name}}, {{company_name}}
                </div>
              </div>
            )}

            {characterCount > SMS_LIMIT && editedMessage?.channel === 'sms' && (
              <div className="mt-2 text-yellow-600 text-sm">
                ⚠️ Long message will be sent as {getSMSCount()} separate SMS
              </div>
            )}
          </div>

          {/* Timing Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timing & Conditions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay (minutes)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={editedMessage?.delay || 0}
                  onChange={(e) => setEditedMessage({ ...editedMessage, delay: parseInt(e?.target?.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={editedMessage?.sendTimeStart || '09:00'}
                  onChange={(e) => setEditedMessage({ ...editedMessage, sendTimeStart: e?.target?.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <Input
                  type="time"
                  value={editedMessage?.sendTimeEnd || '17:00'}
                  onChange={(e) => setEditedMessage({ ...editedMessage, sendTimeEnd: e?.target?.value })}
                />
              </div>
            </div>

            {/* Send Days */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Days
              </label>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']?.map(day => (
                  <label key={day} className="flex items-center">
                    <Checkbox
                      checked={editedMessage?.sendDays?.includes(day)}
                      onChange={(checked) => {
                        const sendDays = editedMessage?.sendDays || [];
                        if (checked) {
                          setEditedMessage({ 
                            ...editedMessage, 
                            sendDays: [...sendDays, day] 
                          });
                        } else {
                          setEditedMessage({ 
                            ...editedMessage, 
                            sendDays: sendDays?.filter(d => d !== day) 
                          });
                        }
                      }}
                    />
                    <span className="ml-2 text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <Checkbox
                  checked={editedMessage?.respectTimezone || false}
                  onChange={(checked) => setEditedMessage({ ...editedMessage, respectTimezone: checked })}
                />
                <span className="ml-2 text-sm">Respect recipient timezone</span>
              </label>

              <label className="flex items-center">
                <Checkbox
                  checked={editedMessage?.skipIfResponded || false}
                  onChange={(checked) => setEditedMessage({ ...editedMessage, skipIfResponded: checked })}
                />
                <span className="ml-2 text-sm">Skip if lead already responded</span>
              </label>

              <label className="flex items-center">
                <Checkbox
                  checked={editedMessage?.skipIfBooked || false}
                  onChange={(checked) => setEditedMessage({ ...editedMessage, skipIfBooked: checked })}
                />
                <span className="ml-2 text-sm">Skip if lead already booked appointment</span>
              </label>

              <label className="flex items-center">
                <Checkbox
                  checked={editedMessage?.abTest || false}
                  onChange={(checked) => setEditedMessage({ ...editedMessage, abTest: checked })}
                />
                <span className="ml-2 text-sm">Enable A/B testing for this message</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
          >
            <Icon name="Save" size={16} className="mr-2" />
            Save Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageEditor;