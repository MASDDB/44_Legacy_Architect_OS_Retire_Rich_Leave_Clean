import React, { useState, useEffect, useRef } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import Icon from '../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const AIVoiceDemo = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Idle');
  const [isCalling, setIsCalling] = useState(false);
  const retellClientRef = useRef(null);

  useEffect(() => {
    const retellWebClient = new RetellWebClient();
    retellClientRef.current = retellWebClient;

    retellWebClient.on('call_started', () => {
      console.log('call started');
      setStatus('In call');
      setIsCalling(true);
    });

    retellWebClient.on('call_ended', () => {
      console.log('call ended');
      setStatus('Call ended');
      setIsCalling(false);
    });

    retellWebClient.on('agent_start_talking', () => {
      console.log('agent is talking');
    });

    retellWebClient.on('agent_stop_talking', () => {
      console.log('agent stopped talking');
    });

    retellWebClient.on('update', (update) => {
      console.log('update', update);
    });

    retellWebClient.on('error', (error) => {
      console.error('An error occurred:', error);
      setStatus('Error, see console');
      setIsCalling(false);
      retellWebClient.stopCall();
    });

    return () => {
      if (retellClientRef.current) {
        try {
          retellClientRef.current.stopCall();
        } catch (e) {
          console.log('Cleanup: no active call to stop');
        }
      }
    };
  }, []);

  const handleStartCall = async () => {
    try {
      setStatus('Requesting token');
      setIsCalling(true);
      console.log('Sending request to n8n webhook');

      const response = await fetch('https://z6gljx4z.rsrv.host/webhook/lillian-receptionist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source: 'web_demo' }),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response from n8n webhook:', data);
      console.log('Response keys:', Object.keys(data));
      console.log('access_token:', data.access_token);
      console.log('accessToken:', data.accessToken);

      // Handle both access_token and accessToken formats
      const accessToken = data.access_token || data.accessToken;

      if (!accessToken) {
        console.error('Full response data:', JSON.stringify(data, null, 2));
        throw new Error(`No access token in response. Received keys: ${Object.keys(data).join(', ')}`);
      }

      console.log('Starting call with Retell');
      setStatus('Connecting');

      await retellClientRef.current.startCall({
        accessToken: accessToken,
      });

      setStatus('In call');
    } catch (error) {
      console.error('Error starting call:', error);
      const errorMessage = error.message || 'Unknown error';
      setStatus(`Error: ${errorMessage}`);
      setIsCalling(false);
    }
  };

  const handleStopCall = () => {
    try {
      console.log('Stop call requested');
      retellClientRef.current.stopCall();
      setStatus('Call ended');
      setIsCalling(false);
    } catch (error) {
      console.error('Error stopping call:', error);
      setStatus('Error stopping call');
      setIsCalling(false);
    }
  };

  const getStatusColor = () => {
    if (status.includes('Error')) return 'text-red-600';
    if (status === 'In call') return 'text-green-600';
    if (status === 'Connecting' || status === 'Requesting token') return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon name="Mic" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Legacy Architect OS</h1>
                <p className="text-blue-100 text-sm">AI Voice Reception Demo</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Status Display */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Call Status
                </span>
                {isCalling && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                )}
              </div>
              <p className={`text-2xl font-bold ${getStatusColor()}`}>
                {status}
              </p>
            </div>

            {/* Information Panel */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Experience AI-Powered Reception
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Click "Start Call" to speak with our AI receptionist. She'll answer questions about Legacy Architect OS, qualify your business needs, and demonstrate how we handle incoming calls 24/7.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleStartCall}
                disabled={isCalling}
                className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isCalling
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                <Icon name="Phone" size={20} />
                <span>Start Call</span>
              </button>

              <button
                onClick={handleStopCall}
                disabled={!isCalling}
                className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  !isCalling
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                <Icon name="PhoneOff" size={20} />
                <span>Stop Call</span>
              </button>
            </div>

            {/* Error Troubleshooting */}
            {status.includes('Error') && (
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Troubleshooting</h4>
                    <p className="text-sm text-red-800 mb-2">{status}</p>
                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                      <li>Check browser console for detailed error logs</li>
                      <li>Verify the n8n webhook is running and accessible</li>
                      <li>Ensure the webhook returns access_token in the response</li>
                      <li>Check that your microphone permissions are enabled</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Features List */}
            <div className="border-t-2 border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">What You'll Experience:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Icon name="CheckCircle" size={16} className="text-green-600 flex-shrink-0" />
                  <span>Natural conversation flow</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Icon name="CheckCircle" size={16} className="text-green-600 flex-shrink-0" />
                  <span>Lead qualification questions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Icon name="CheckCircle" size={16} className="text-green-600 flex-shrink-0" />
                  <span>Service business expertise</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Icon name="CheckCircle" size={16} className="text-green-600 flex-shrink-0" />
                  <span>24/7 availability demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            This demo uses real AI voice technology. Open your browser console to see technical logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceDemo;
