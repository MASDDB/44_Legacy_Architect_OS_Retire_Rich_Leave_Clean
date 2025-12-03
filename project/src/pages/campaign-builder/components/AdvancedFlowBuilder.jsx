import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// Custom Node Components
const MessageNode = ({ data, selected }) => {
  const getChannelColor = (channel) => {
    switch (channel) {
      case 'voice': return 'border-blue-500 bg-blue-50';
      case 'sms': return 'border-green-500 bg-green-50';
      case 'email': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'voice': return 'Phone';
      case 'sms': return 'MessageSquare';
      case 'email': return 'Mail';
      default: return 'MessageCircle';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg border-2 min-w-[200px] ${
      getChannelColor(data?.channel)
    } ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      <Handle
        type="target"
        position={Position?.Top}
        style={{ background: '#555' }}
      />
      <div className="flex items-center space-x-2 mb-2">
        <Icon name={getChannelIcon(data?.channel)} size={16} />
        <span className="font-medium text-sm">{data?.channel?.toUpperCase()}</span>
      </div>
      <p className="text-xs text-gray-600 mb-2">{data?.name}</p>
      {data?.delay > 0 && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Icon name="Clock" size={12} />
          <span>
            {data?.delay < 60 ? `${data?.delay}m` : 
             data?.delay < 1440 ? `${Math.floor(data?.delay / 60)}h` : 
             `${Math.floor(data?.delay / 1440)}d`}
          </span>
        </div>
      )}
      {data?.conditions && data?.conditions?.length > 0 && (
        <div className="flex items-center space-x-1 text-xs text-orange-600 mt-1">
          <Icon name="GitBranch" size={12} />
          <span>Conditional</span>
        </div>
      )}
      <Handle
        type="source"
        position={Position?.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
};

const ConditionalNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-lg border-2 border-orange-500 bg-orange-50 min-w-[180px] ${
      selected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      <Handle
        type="target"
        position={Position?.Top}
        style={{ background: '#555' }}
      />
      <div className="flex items-center space-x-2 mb-2">
        <Icon name="GitBranch" size={16} />
        <span className="font-medium text-sm">CONDITION</span>
      </div>
      <p className="text-xs text-gray-600 mb-2">{data?.condition || 'If/Then Logic'}</p>
      <div className="flex justify-between mt-2">
        <div className="text-xs text-green-600">✓ TRUE</div>
        <div className="text-xs text-red-600">✗ FALSE</div>
      </div>
      <Handle
        type="source"
        position={Position?.Bottom}
        id="true"
        style={{ background: '#10b981', left: '25%' }}
      />
      <Handle
        type="source"
        position={Position?.Bottom}
        id="false"
        style={{ background: '#ef4444', right: '25%', left: 'auto' }}
      />
    </div>
  );
};

const DelayNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-lg border-2 border-yellow-500 bg-yellow-50 min-w-[160px] ${
      selected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      <Handle
        type="target"
        position={Position?.Top}
        style={{ background: '#555' }}
      />
      <div className="flex items-center space-x-2 mb-2">
        <Icon name="Clock" size={16} />
        <span className="font-medium text-sm">DELAY</span>
      </div>
      <p className="text-xs text-gray-600">
        Wait {data?.delay || '1'} {data?.unit || 'hour'}(s)
      </p>
      <Handle
        type="source"
        position={Position?.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
};

const TriggerNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-lg border-2 border-indigo-500 bg-indigo-50 min-w-[180px] ${
      selected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      <Handle
        type="target"
        position={Position?.Top}
        style={{ background: '#555' }}
      />
      <div className="flex items-center space-x-2 mb-2">
        <Icon name="Zap" size={16} />
        <span className="font-medium text-sm">TRIGGER</span>
      </div>
      <p className="text-xs text-gray-600">{data?.triggerType || 'Custom Trigger'}</p>
      <Handle
        type="source"
        position={Position?.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
};

const StartNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-full border-2 border-green-500 bg-green-100 min-w-[120px] text-center ${
      selected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      <div className="flex items-center justify-center space-x-2">
        <Icon name="Play" size={16} />
        <span className="font-medium text-sm">START</span>
      </div>
      <Handle
        type="source"
        position={Position?.Bottom}
        style={{ background: '#10b981' }}
      />
    </div>
  );
};

const EndNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-full border-2 border-red-500 bg-red-100 min-w-[120px] text-center ${
      selected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      <Handle
        type="target"
        position={Position?.Top}
        style={{ background: '#ef4444' }}
      />
      <div className="flex items-center justify-center space-x-2">
        <Icon name="Square" size={16} />
        <span className="font-medium text-sm">END</span>
      </div>
    </div>
  );
};

// Node types mapping
const nodeTypes = {
  messageNode: MessageNode,
  conditionalNode: ConditionalNode,
  delayNode: DelayNode,
  triggerNode: TriggerNode,
  startNode: StartNode,
  endNode: EndNode
};

const AdvancedFlowBuilder = ({
  messages,
  flowNodes: initialNodes,
  flowEdges: initialEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEditMessage,
  campaignSettings
}) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Initialize with default nodes if empty
  const getInitialNodes = () => {
    if (initialNodes?.length > 0) return initialNodes;
    
    return [
      {
        id: 'start-1',
        type: 'startNode',
        position: { x: 250, y: 50 },
        data: { label: 'Campaign Start' }
      },
      {
        id: 'end-1',
        type: 'endNode',
        position: { x: 250, y: 500 },
        data: { label: 'Campaign End' }
      }
    ];
  };

  const [nodes, setNodes, onNodesChangeCallback] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChangeCallback] = useEdgesState(initialEdges || []);

  const onConnectCallback = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event?.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event?.preventDefault();

      const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
      const type = event?.dataTransfer?.getData('application/reactflow');

      if (!type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance?.project({
        x: event?.clientX - reactFlowBounds?.left,
        y: event?.clientY - reactFlowBounds?.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type} node`,
          ...(type === 'messageNode' && { channel: 'email', name: 'New Message' }),
          ...(type === 'delayNode' && { delay: 1, unit: 'hour' }),
          ...(type === 'conditionalNode' && { condition: 'If lead responded' }),
          ...(type === 'triggerNode' && { triggerType: 'Lead Created' })
        },
      };

      setNodes((nds) => nds?.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    if (node?.type === 'messageNode' && onEditMessage) {
      onEditMessage(node?.data);
    }
  }, [onEditMessage]);

  const addNodeToFlow = (nodeType) => {
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: `${nodeType}Node`,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 200 },
      data: { 
        label: `${nodeType} node`,
        ...(nodeType === 'message' && { channel: 'email', name: 'New Message' }),
        ...(nodeType === 'delay' && { delay: 1, unit: 'hour' }),
        ...(nodeType === 'conditional' && { condition: 'If lead responded' }),
        ...(nodeType === 'trigger' && { triggerType: 'Lead Created' })
      },
    };

    setNodes((nds) => nds?.concat(newNode));
  };

  const clearFlow = () => {
    setNodes(getInitialNodes());
    setEdges([]);
  };

  const autoLayout = () => {
    // Simple auto-layout logic
    const layoutNodes = nodes?.map((node, index) => ({
      ...node,
      position: {
        x: 100 + (index % 3) * 200,
        y: 100 + Math.floor(index / 3) * 150
      }
    }));
    setNodes(layoutNodes);
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Visual Flow Builder</h3>
            <p className="text-sm text-muted-foreground">
              Drag nodes to create advanced campaign workflows with conditional logic
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={autoLayout}
            >
              <Icon name="Layout" size={16} className="mr-2" />
              Auto Layout
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFlow}
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
      {/* Node Palette */}
      <div className="p-3 border-b border-border bg-background">
        <p className="text-xs font-medium text-muted-foreground mb-2">DRAG NODES TO CANVAS</p>
        <div className="flex items-center space-x-2 overflow-x-auto">
          <div
            className="px-3 py-2 bg-purple-100 border border-purple-300 rounded cursor-pointer hover:bg-purple-200 transition-colors flex items-center space-x-1 whitespace-nowrap"
            draggable
            onDragStart={(event) => {
              event?.dataTransfer?.setData('application/reactflow', 'messageNode');
              event.dataTransfer.effectAllowed = 'move';
            }}
            onClick={() => addNodeToFlow('message')}
          >
            <Icon name="Mail" size={14} />
            <span className="text-xs font-medium">Message</span>
          </div>

          <div
            className="px-3 py-2 bg-orange-100 border border-orange-300 rounded cursor-pointer hover:bg-orange-200 transition-colors flex items-center space-x-1 whitespace-nowrap"
            draggable
            onDragStart={(event) => {
              event?.dataTransfer?.setData('application/reactflow', 'conditionalNode');
              event.dataTransfer.effectAllowed = 'move';
            }}
            onClick={() => addNodeToFlow('conditional')}
          >
            <Icon name="GitBranch" size={14} />
            <span className="text-xs font-medium">Condition</span>
          </div>

          <div
            className="px-3 py-2 bg-yellow-100 border border-yellow-300 rounded cursor-pointer hover:bg-yellow-200 transition-colors flex items-center space-x-1 whitespace-nowrap"
            draggable
            onDragStart={(event) => {
              event?.dataTransfer?.setData('application/reactflow', 'delayNode');
              event.dataTransfer.effectAllowed = 'move';
            }}
            onClick={() => addNodeToFlow('delay')}
          >
            <Icon name="Clock" size={14} />
            <span className="text-xs font-medium">Delay</span>
          </div>

          <div
            className="px-3 py-2 bg-indigo-100 border border-indigo-300 rounded cursor-pointer hover:bg-indigo-200 transition-colors flex items-center space-x-1 whitespace-nowrap"
            draggable
            onDragStart={(event) => {
              event?.dataTransfer?.setData('application/reactflow', 'triggerNode');
              event.dataTransfer.effectAllowed = 'move';
            }}
            onClick={() => addNodeToFlow('trigger')}
          >
            <Icon name="Zap" size={14} />
            <span className="text-xs font-medium">Trigger</span>
          </div>
        </div>
      </div>
      {/* React Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChangeCallback}
              onEdgesChange={onEdgesChangeCallback}
              onConnect={onConnectCallback}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              proOptions={{ hideAttribution: true }}
            >
              <Controls className="bg-background border border-border" />
              <MiniMap
                className="bg-background border border-border"
                nodeColor={(node) => {
                  switch (node?.type) {
                    case 'messageNode': return '#8b5cf6';
                    case 'conditionalNode': return '#f97316';
                    case 'delayNode': return '#eab308';
                    case 'triggerNode': return '#6366f1';
                    case 'startNode': return '#10b981';
                    case 'endNode': return '#ef4444';
                    default: return '#6b7280';
                  }
                }}
                nodeStrokeWidth={3}
                maskColor="rgba(0, 0, 0, 0.1)"
                pannable
                zoomable
              />
              <Background 
                variant={BackgroundVariant?.Dots} 
                gap={20} 
                size={1}
                color="#e5e7eb"
              />
              
              <Panel position="top-right" className="bg-background p-2 rounded border border-border">
                <div className="text-xs text-muted-foreground">
                  <div>Nodes: {nodes?.length}</div>
                  <div>Connections: {edges?.length}</div>
                </div>
              </Panel>

              {campaignSettings?.flowType && (
                <Panel position="top-left" className="bg-background p-2 rounded border border-border">
                  <div className="text-xs font-medium text-foreground">
                    Flow Type: {campaignSettings?.flowType?.replace('-', ' ')?.toUpperCase()}
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
      {/* Node Properties Panel */}
      {selectedNode && (
        <div className="p-4 border-t border-border bg-muted/30">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Node Properties: {selectedNode?.data?.label || selectedNode?.type}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">ID:</span>
              <p className="font-mono">{selectedNode?.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p>{selectedNode?.type}</p>
            </div>
            {selectedNode?.data?.channel && (
              <div>
                <span className="text-muted-foreground">Channel:</span>
                <p className="capitalize">{selectedNode?.data?.channel}</p>
              </div>
            )}
            {selectedNode?.data?.delay && (
              <div>
                <span className="text-muted-foreground">Delay:</span>
                <p>{selectedNode?.data?.delay} {selectedNode?.data?.unit}(s)</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFlowBuilder;