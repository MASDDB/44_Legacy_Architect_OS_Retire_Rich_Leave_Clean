import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import MessageNode from './MessageNode';

const FlowBuilder = ({ messages, onMessagesChange, onEditMessage }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = useCallback((e, message, index) => {
    setDraggedItem({ message, index });
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e?.preventDefault();
    
    if (!draggedItem || draggedItem?.index === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    const newMessages = [...messages];
    const [movedMessage] = newMessages?.splice(draggedItem?.index, 1);
    newMessages?.splice(dropIndex, 0, movedMessage);
    
    onMessagesChange(newMessages);
    setDraggedItem(null);
    setDragOverIndex(null);
  }, [draggedItem, messages, onMessagesChange]);

  const handleDeleteMessage = useCallback((messageId) => {
    const newMessages = messages?.filter(msg => msg?.id !== messageId);
    onMessagesChange(newMessages);
  }, [messages, onMessagesChange]);

  const handleDuplicateMessage = useCallback((message) => {
    const newMessage = {
      ...message,
      id: Date.now() + Math.random(),
      name: `${message?.name} (Copy)`
    };
    const messageIndex = messages?.findIndex(msg => msg?.id === message?.id);
    const newMessages = [...messages];
    newMessages?.splice(messageIndex + 1, 0, newMessage);
    onMessagesChange(newMessages);
  }, [messages, onMessagesChange]);

  const addNewMessage = (channel) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      channel,
      name: `${channel?.charAt(0)?.toUpperCase() + channel?.slice(1)} Message`,
      content: '',
      delay: 0,
      template: null,
      conditions: [],
      abTest: false
    };
    onMessagesChange([...messages, newMessage]);
  };

  if (messages?.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-border">
        <div className="text-center max-w-md">
          <Icon name="Workflow" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Start Building Your Campaign</h3>
          <p className="text-muted-foreground mb-6">
            Add your first message to begin creating your reactivation sequence. 
            You can drag and drop to reorder messages later.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="default"
              onClick={() => addNewMessage('email')}
              className="flex items-center"
            >
              <Icon name="Mail" size={16} className="mr-2" />
              Add Email
            </Button>
            <Button
              variant="outline"
              onClick={() => addNewMessage('sms')}
              className="flex items-center"
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Add SMS
            </Button>
            <Button
              variant="outline"
              onClick={() => addNewMessage('voice')}
              className="flex items-center"
            >
              <Icon name="Phone" size={16} className="mr-2" />
              Add Voice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        {/* Flow Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Campaign Flow</h3>
            <p className="text-sm text-muted-foreground">
              {messages?.length} message{messages?.length !== 1 ? 's' : ''} in sequence
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addNewMessage('email')}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Add Message
            </Button>
          </div>
        </div>

        {/* Flow Visualization */}
        <div className="space-y-4">
          {/* Start Node */}
          <div className="flex justify-center">
            <div className="bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
              <Icon name="Play" size={16} />
              <span>Campaign Start</span>
            </div>
          </div>

          {/* Message Nodes */}
          {messages?.map((message, index) => (
            <div key={message?.id} className="relative">
              {/* Drop Zone Above */}
              <div
                className={`h-4 flex items-center justify-center transition-all ${
                  dragOverIndex === index ? 'bg-primary/20 border-2 border-dashed border-primary rounded' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                {dragOverIndex === index && (
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                    Drop here
                  </span>
                )}
              </div>

              {/* Connection Line */}
              {index > 0 && (
                <div className="flex justify-center mb-4">
                  <div className="w-px h-8 bg-border"></div>
                </div>
              )}

              {/* Message Node */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <MessageNode
                    message={message}
                    onEdit={onEditMessage}
                    onDelete={handleDeleteMessage}
                    onDuplicate={handleDuplicateMessage}
                    isDragging={draggedItem?.message?.id === message?.id}
                    dragHandleProps={{
                      draggable: true,
                      onDragStart: (e) => handleDragStart(e, message, index)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Drop Zone at End */}
          <div
            className={`h-12 flex items-center justify-center transition-all ${
              dragOverIndex === messages?.length ? 'bg-primary/20 border-2 border-dashed border-primary rounded' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, messages?.length)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, messages?.length)}
          >
            {dragOverIndex === messages?.length && (
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                Drop here
              </span>
            )}
          </div>

          {/* End Node */}
          <div className="flex justify-center">
            <div className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
              <Icon name="Flag" size={16} />
              <span>Campaign End</span>
            </div>
          </div>
        </div>

        {/* Quick Add Actions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Add Message</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addNewMessage('email')}
              className="flex items-center"
            >
              <Icon name="Mail" size={16} className="mr-2" />
              Email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addNewMessage('sms')}
              className="flex items-center"
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              SMS
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addNewMessage('voice')}
              className="flex items-center"
            >
              <Icon name="Phone" size={16} className="mr-2" />
              Voice Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;