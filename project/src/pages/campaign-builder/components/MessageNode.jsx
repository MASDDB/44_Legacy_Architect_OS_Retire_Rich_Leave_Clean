import React from 'react';
import { Handle, Position } from '@xyflow/react';
import Icon from '../../../components/AppIcon';

const MessageNode = ({ data, selected }) => {
  const getChannelColor = (channel) => {
    switch (channel) {
      case 'voice': return 'border-blue-500 bg-blue-50 text-blue-900';
      case 'sms': return 'border-green-500 bg-green-50 text-green-900';
      case 'email': return 'border-purple-500 bg-purple-50 text-purple-900';
      case 'social': return 'border-pink-500 bg-pink-50 text-pink-900';
      default: return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'voice': return 'Phone';
      case 'sms': return 'MessageSquare';
      case 'email': return 'Mail';
      case 'social': return 'Share2';
      default: return 'MessageCircle';
    }
  };

  const formatDelay = (delay) => {
    if (!delay || delay === 0) return null;
    if (delay < 60) return `${delay}m`;
    if (delay < 1440) return `${Math.floor(delay / 60)}h`;
    return `${Math.floor(delay / 1440)}d`;
  };

  return (
    <div className={`relative px-4 py-3 rounded-lg border-2 min-w-[220px] max-w-[280px] transition-all duration-200 ${
      getChannelColor(data?.channel)
    } ${selected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'shadow-sm hover:shadow-md'}`}>
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position?.Top}
        style={{ 
          background: '#555',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name={getChannelIcon(data?.channel)} size={16} />
          <span className="font-semibold text-sm uppercase tracking-wide">
            {data?.channel || 'Message'}
          </span>
        </div>
        {data?.abTest && (
          <div className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-medium">
            A/B
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm line-clamp-2">
          {data?.name || data?.subject || 'Untitled Message'}
        </h3>
        
        {data?.content && (
          <p className="text-xs opacity-75 line-clamp-2">
            {data?.content}
          </p>
        )}
      </div>

      {/* Features & Timing */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/20">
        <div className="flex items-center space-x-2">
          {data?.conditions && data?.conditions?.length > 0 && (
            <div className="bg-current/20 text-current px-1.5 py-0.5 rounded text-xs">
              <Icon name="GitBranch" size={10} className="inline mr-1" />
              Conditional
            </div>
          )}
          {data?.skipIfResponded && (
            <div className="bg-current/20 text-current px-1.5 py-0.5 rounded text-xs">
              Smart
            </div>
          )}
        </div>
        
        {formatDelay(data?.delay) && (
          <div className="flex items-center space-x-1 text-xs opacity-75">
            <Icon name="Clock" size={10} />
            <span>{formatDelay(data?.delay)}</span>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position?.Bottom}
        style={{ 
          background: '#555',
          border: '2px solid #fff',
          width: '12px',
          height: '12px'
        }}
      />

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default MessageNode;