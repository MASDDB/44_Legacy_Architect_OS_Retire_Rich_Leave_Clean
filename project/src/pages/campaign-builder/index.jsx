import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TemplateLibrary from './components/TemplateLibrary';
import FlowBuilder from './components/FlowBuilder';
import AdvancedFlowBuilder from './components/AdvancedFlowBuilder';
import CampaignSettings from './components/CampaignSettings';
import MessageEditor from './components/MessageEditor';
import CampaignPreview from './components/CampaignPreview';
import SMSCampaignBuilder from './components/SMSCampaignBuilder';
import VoiceCampaignBuilder from './components/VoiceCampaignBuilder';
import TriggerConfiguration from './components/TriggerConfiguration';
import ConditionalLogicBuilder from './components/ConditionalLogicBuilder';
import ABTestingSetup from './components/ABTestingSetup';
import LeadScoringPanel from './components/LeadScoringPanel';
import AIPersonalizationPanel from './components/AIPersonalizationPanel';
import AIPersonalizationSettings from './components/AIPersonalizationSettings';

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [templateLibraryCollapsed, setTemplateLibraryCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('advanced-builder'); // 'builder', 'advanced-builder', 'settings'
  
  // Campaign state
  const [messages, setMessages] = useState([]);
  const [campaignSettings, setCampaignSettings] = useState({
    name: '',
    description: '',
    leadSegment: 'all',
    industry: '',
    dailyLimit: 100,
    totalLimit: 1000,
    timezone: 'EST',
    startTime: '09:00',
    endTime: '17:00',
    activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    launchDate: '',
    respectTimezones: true,
    complianceTemplate: 'standard',
    autoOptOut: true,
    tcpaCompliance: true,
    canSpamCompliance: true,
    gdprCompliance: false,
    optOutKeywords: 'STOP, UNSUBSCRIBE, REMOVE',
    businessHoursOnly: true,
    abTestEnabled: false,
    testDuration: 7,
    trafficSplit: 50,
    testMetrics: ['response'],
    minSampleSize: 100,
    // Advanced flow settings
    flowType: 'sequential', // 'sequential', 'conditional', 'trigger-based', 'multi-channel'
    triggerSettings: {
      type: 'lead-created', // 'lead-created', 'lead-updated', 'appointment-missed', 'email-opened', 'custom'
      conditions: [],
      delay: 0
    },
    multiChannelCoordination: {
      enabled: false,
      primaryChannel: 'email',
      fallbackChannels: ['sms', 'voice'],
      coordinationRules: []
    },
    conditionalLogic: {
      enabled: false,
      rules: []
    }
  });

  // Advanced flow state
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Editor state
  const [editingMessage, setEditingMessage] = useState(null);
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSMSBuilder, setShowSMSBuilder] = useState(false);
  const [showVoiceBuilder, setShowVoiceBuilder] = useState(false);
  const [showTriggerConfig, setShowTriggerConfig] = useState(false);
  const [showConditionalLogic, setShowConditionalLogic] = useState(false);
  const [showABTesting, setShowABTesting] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showLeadScoring, setShowLeadScoring] = useState(false);
  const [selectedScoredLeads, setSelectedScoredLeads] = useState([]);
  const [showAISettings, setShowAISettings] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState({
    id: 'demo-campaign',
    campaign_type: 'sms'
  });

  const handleAddTemplate = (template) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      channel: template?.channel,
      name: template?.name,
      content: template?.content,
      subject: template?.channel === 'email' ? `Re: ${template?.name}` : undefined,
      delay: 0,
      template: template?.name,
      conditions: [],
      abTest: false,
      sendDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      sendTimeStart: '09:00',
      sendTimeEnd: '17:00',
      respectTimezone: true,
      skipIfResponded: true,
      skipIfBooked: true
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setShowMessageEditor(true);
  };

  const handleSaveMessage = (updatedMessage) => {
    setMessages(prev => prev?.map(msg => 
      msg?.id === updatedMessage?.id ? updatedMessage : msg
    ));
    setShowMessageEditor(false);
    setEditingMessage(null);
  };

  const handleCancelEdit = () => {
    setShowMessageEditor(false);
    setEditingMessage(null);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleLaunchCampaign = () => {
    // Simulate campaign launch
    console.log('Launching campaign:', {
      settings: campaignSettings,
      messages: messages,
      flowNodes: flowNodes,
      flowEdges: flowEdges
    });
    
    // Show success message and redirect
    alert('Advanced campaign launched successfully! Redirecting to analytics dashboard...');
    navigate('/analytics-dashboard');
  };

  const handleSaveCampaign = () => {
    // Simulate saving campaign
    console.log('Saving campaign:', {
      settings: campaignSettings,
      messages: messages,
      flowNodes: flowNodes,
      flowEdges: flowEdges
    });
    alert('Advanced campaign saved successfully!');
  };

  // SMS Campaign Builder handlers
  const handleSMSCampaign = () => {
    // For demo purposes, simulate selected leads
    const mockLeads = [
      { 
        id: 'lead-1', 
        first_name: 'John', 
        last_name: 'Smith', 
        phone: '+1234567890',
        company: { name: 'Tech Solutions Inc' }
      },
      { 
        id: 'lead-2', 
        first_name: 'Sarah', 
        last_name: 'Johnson', 
        phone: '+1987654321',
        company: { name: 'Digital Marketing Co' }
      }
    ];
    
    setSelectedLeads(mockLeads);
    setShowSMSBuilder(true);
  };

  const handleSMSSent = (results) => {
    console.log('SMS Campaign Results:', results);
  };

  const handleCloseSMSBuilder = () => {
    setShowSMSBuilder(false);
    setSelectedLeads([]);
  };

  // Voice Campaign Builder handlers
  const handleVoiceCampaign = () => {
    // For demo purposes, simulate selected leads
    const mockLeads = [
      { 
        id: 'lead-1', 
        first_name: 'John', 
        last_name: 'Smith', 
        phone: '+1234567890',
        email: 'john.smith@techsolutions.com',
        company: { name: 'Tech Solutions Inc' }
      },
      { 
        id: 'lead-2', 
        first_name: 'Sarah', 
        last_name: 'Johnson', 
        phone: '+1987654321',
        email: 'sarah@digitalmarketing.com',
        company: { name: 'Digital Marketing Co' }
      },
      { 
        id: 'lead-3', 
        first_name: 'Michael', 
        last_name: 'Brown', 
        phone: '+1555123456',
        email: 'michael.brown@startupventures.com',
        company: { name: 'Startup Ventures' }
      }
    ];
    
    setSelectedLeads(mockLeads);
    setShowVoiceBuilder(true);
  };

  const handleVoiceSent = (results) => {
    console.log('Voice Campaign Results:', results);
    // Show success notification or update UI as needed
  };

  const handleCloseVoiceBuilder = () => {
    setShowVoiceBuilder(false);
    setSelectedLeads([]);
  };

  // Advanced flow handlers
  const handleNodesChange = (changes) => {
    console.log('Nodes changed:', changes);
  };

  const handleEdgesChange = (changes) => {
    console.log('Edges changed:', changes);
  };

  const handleConnect = (connection) => {
    console.log('New connection:', connection);
  };

  // Trigger configuration handlers
  const handleConfigureTriggers = () => {
    setShowTriggerConfig(true);
  };

  const handleSaveTriggers = (triggerConfig) => {
    setCampaignSettings(prev => ({
      ...prev,
      triggerSettings: triggerConfig
    }));
    setShowTriggerConfig(false);
  };

  const handleCloseTriggerConfig = () => {
    setShowTriggerConfig(false);
  };

  // Conditional logic handlers
  const handleConfigureConditionalLogic = () => {
    setShowConditionalLogic(true);
  };

  const handleSaveConditionalLogic = (logicConfig) => {
    setCampaignSettings(prev => ({
      ...prev,
      conditionalLogic: logicConfig
    }));
    setShowConditionalLogic(false);
  };

  const handleCloseConditionalLogic = () => {
    setShowConditionalLogic(false);
  };

  // A/B Testing handlers
  const handleConfigureABTesting = () => {
    setShowABTesting(true);
  };

  const handleSaveABTesting = (abConfig) => {
    setCampaignSettings(prev => ({
      ...prev,
      ...abConfig
    }));
    setShowABTesting(false);
  };

  const handleCloseABTesting = () => {
    setShowABTesting(false);
  };

  // Lead scoring handlers
  const handleOpenLeadScoring = () => {
    setShowLeadScoring(true);
  };

  const handleCloseLeadScoring = () => {
    setShowLeadScoring(false);
  };

  const handleLeadSelected = (leadScore) => {
    const leadData = {
      id: leadScore?.lead_id || leadScore?.id,
      name: `${leadScore?.lead?.first_name} ${leadScore?.lead?.last_name}`,
      email: leadScore?.lead?.email,
      company: leadScore?.lead?.company?.name,
      score: leadScore?.overall_score,
      category: leadScore?.category
    };
    
    setSelectedScoredLeads(prev => [...prev, leadData]);
    setShowLeadScoring(false);
    
    // Show success feedback
    console.log('Added lead to campaign:', leadData);
  };

  const handlePersonalizationApplied = (result) => {
    if (result?.personalizedContent) {
      setPersonalizedMessage(result?.personalizedContent);
      // You can also update the campaign's message template here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-60'
      } mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Campaign Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Breadcrumb />
              
              {/* Page Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Advanced Campaign Builder</h1>
                  <p className="text-muted-foreground">
                    Create sophisticated multi-channel AI-powered campaigns with visual workflow builder, conditional logic, and advanced triggers
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <Button
                    variant={activeView === 'builder' ? 'default' : 'outline'}
                    onClick={() => setActiveView('builder')}
                    size="sm"
                  >
                    <Icon name="List" size={16} className="mr-2" />
                    Simple Flow
                  </Button>
                  <Button
                    variant={activeView === 'advanced-builder' ? 'default' : 'outline'}
                    onClick={() => setActiveView('advanced-builder')}
                    size="sm"
                  >
                    <Icon name="GitBranch" size={16} className="mr-2" />
                    Visual Flow
                  </Button>
                  <Button
                    variant={activeView === 'settings' ? 'default' : 'outline'}
                    onClick={() => setActiveView('settings')}
                    size="sm"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSMSCampaign}
                    size="sm"
                  >
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    SMS Campaign
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleVoiceCampaign}
                    size="sm"
                  >
                    <Icon name="Phone" size={16} className="mr-2" />
                    Voice Campaign
                  </Button>
                </div>
              </div>

              {/* Advanced Campaign Stats */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="MessageSquare" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Messages</p>
                      <p className="text-xl font-semibold text-foreground">{messages?.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="GitBranch" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Flow Nodes</p>
                      <p className="text-xl font-semibold text-foreground">{flowNodes?.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="Target" size={20} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Triggers</p>
                      <p className="text-xl font-semibold text-foreground">
                        {campaignSettings?.triggerSettings?.conditions?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name="TestTube" size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">A/B Tests</p>
                      <p className="text-xl font-semibold text-foreground">
                        {campaignSettings?.abTestEnabled ? '1' : '0'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                      <Icon name="Zap" size={20} className="text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Channels</p>
                      <p className="text-xl font-semibold text-foreground">
                        {new Set(messages?.map(m => m?.channel))?.size || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* NEW: Lead Scoring Stats */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple/10 rounded-lg flex items-center justify-center">
                      <Icon name="Brain" size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Scored Leads</p>
                      <p className="text-xl font-semibold text-foreground">{selectedScoredLeads?.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Controls Panel */}
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-foreground">Advanced Features</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        campaignSettings?.flowType === 'sequential' ? 'bg-blue-100 text-blue-800' :
                        campaignSettings?.flowType === 'conditional' ? 'bg-green-100 text-green-800' :
                        campaignSettings?.flowType === 'trigger-based'? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {campaignSettings?.flowType?.replace('-', ' ')?.toUpperCase()}
                      </span>
                      {campaignSettings?.multiChannelCoordination?.enabled && (
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                          MULTI-CHANNEL
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleOpenLeadScoring}
                    >
                      <Icon name="Brain" size={16} className="mr-2" />
                      AI Lead Scoring
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleConfigureTriggers}
                    >
                      <Icon name="Zap" size={16} className="mr-2" />
                      Triggers
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleConfigureConditionalLogic}
                    >
                      <Icon name="GitBranch" size={16} className="mr-2" />
                      Logic
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleConfigureABTesting}
                    >
                      <Icon name="TestTube" size={16} className="mr-2" />
                      A/B Test
                    </Button>
                  </div>
                </div>

                {/* Selected Scored Leads Display */}
                {selectedScoredLeads?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected AI-Scored Leads:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedScoredLeads?.map((lead, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1"
                        >
                          <span className="text-sm text-purple-900">{lead?.name}</span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {lead?.score}/100
                          </span>
                          <button
                            onClick={() => setSelectedScoredLeads(prev => prev?.filter((_, i) => i !== index))}
                            className="text-purple-400 hover:text-purple-600"
                          >
                            <Icon name="X" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="flex h-[calc(100vh-25rem)] space-x-6">
                {/* Template Library */}
                {(activeView === 'builder' || activeView === 'advanced-builder') && (
                  <TemplateLibrary
                    onAddTemplate={handleAddTemplate}
                    isCollapsed={templateLibraryCollapsed}
                    onToggle={() => setTemplateLibraryCollapsed(!templateLibraryCollapsed)}
                  />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                  {activeView === 'builder' ? (
                    <FlowBuilder
                      messages={messages}
                      onMessagesChange={setMessages}
                      onEditMessage={handleEditMessage}
                    />
                  ) : activeView === 'advanced-builder' ? (
                    <AdvancedFlowBuilder
                      messages={messages}
                      initialNodes={flowNodes}
                      initialEdges={flowEdges}
                      onNodesChange={handleNodesChange}
                      onEdgesChange={handleEdgesChange}
                      onConnect={handleConnect}
                      onEditMessage={handleEditMessage}
                      campaignSettings={campaignSettings}
                    />
                  ) : (
                    <CampaignSettings
                      settings={campaignSettings}
                      onSettingsChange={setCampaignSettings}
                      onSave={handleSaveCampaign}
                      onPreview={handlePreview}
                    />
                  )}
                </div>
              </div>

              {/* Add AI Personalization Panel */}
              <AIPersonalizationPanel
                campaignId={selectedCampaign?.id}
                messageType={selectedCampaign?.campaign_type || 'sms'}
                onPersonalizationApplied={handlePersonalizationApplied}
              />

              {personalizedMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">AI-Personalized Message Preview:</h4>
                  <p className="text-green-800">{personalizedMessage}</p>
                </div>
              )}
            </div>

            {/* Right Column - Preview and Actions */}
            <div className="space-y-6">
              {/* Campaign Preview Modal */}
              <CampaignPreview
                campaign={campaignSettings}
                messages={messages}
                settings={campaignSettings}
                flowNodes={flowNodes}
                flowEdges={flowEdges}
                onClose={handleClosePreview}
                onLaunch={handleLaunchCampaign}
                isOpen={showPreview}
              />

              {/* Quick Actions Bar */}
              <div className="fixed bottom-6 right-6 flex items-center space-x-3 bg-card border border-border rounded-lg p-3 shadow-elevated">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveCampaign}
                  disabled={messages?.length === 0 && flowNodes?.length === 0}
                >
                  <Icon name="Save" size={16} className="mr-2" />
                  Save Draft
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  disabled={messages?.length === 0 && flowNodes?.length === 0}
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleLaunchCampaign}
                  disabled={(messages?.length === 0 && flowNodes?.length === 0) || !campaignSettings?.name}
                >
                  <Icon name="Rocket" size={16} className="mr-2" />
                  Launch
                </Button>
              </div>

              {/* Add AI Settings Quick Access */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Personalization</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAISettings(true)}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Icon name="Settings" size={16} />
                    <span>AI Settings</span>
                  </Button>
                  <div className="text-sm text-gray-600">
                    <p>• Behavioral personalization enabled</p>
                    <p>• GPT-5 model selected</p>
                    <p>• 3 active personalization rules</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Settings Modal */}
      {showAISettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AIPersonalizationSettings onClose={() => setShowAISettings(false)} />
          </div>
        </div>
      )}

      {/* Message Editor Modal */}
      <MessageEditor
        message={editingMessage}
        onSave={handleSaveMessage}
        onCancel={handleCancelEdit}
        isOpen={showMessageEditor}
      />
      {/* SMS Campaign Builder Modal */}
      <SMSCampaignBuilder
        campaign={{ id: 'demo-campaign', ...campaignSettings }}
        selectedLeads={selectedLeads}
        onSendSMS={handleSMSSent}
        onClose={handleCloseSMSBuilder}
        isOpen={showSMSBuilder}
      />
      {/* Voice Campaign Builder Modal */}
      <VoiceCampaignBuilder
        campaign={{ id: 'demo-campaign', ...campaignSettings }}
        selectedLeads={selectedLeads}
        onSendVoice={handleVoiceSent}
        onClose={handleCloseVoiceBuilder}
        isOpen={showVoiceBuilder}
      />
      {/* Trigger Configuration Modal */}
      <TriggerConfiguration
        config={campaignSettings?.triggerSettings}
        onSave={handleSaveTriggers}
        onClose={handleCloseTriggerConfig}
        isOpen={showTriggerConfig}
      />
      {/* Conditional Logic Builder Modal */}
      <ConditionalLogicBuilder
        config={campaignSettings?.conditionalLogic}
        onSave={handleSaveConditionalLogic}
        onClose={handleCloseConditionalLogic}
        isOpen={showConditionalLogic}
      />
      {/* A/B Testing Setup Modal */}
      <ABTestingSetup
        config={campaignSettings}
        onSave={handleSaveABTesting}
        onClose={handleCloseABTesting}
        isOpen={showABTesting}
      />
      {/* NEW: Lead Scoring Panel Modal */}
      <LeadScoringPanel
        isOpen={showLeadScoring}
        onLeadSelected={handleLeadSelected}
        onClose={handleCloseLeadScoring}
      />
    </div>
  );
};

export default CampaignBuilder;