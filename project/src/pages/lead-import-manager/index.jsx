import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import UploadZone from './components/UploadZone';
import DataPreviewTable from './components/DataPreviewTable';
import ValidationResults from './components/ValidationResults';
import IndustryTagging from './components/IndustryTagging';
import BulkActionsPanel from './components/BulkActionsPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LeadImportManager = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [validationStats, setValidationStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    duplicates: 0
  });
  const [validationErrors, setValidationErrors] = useState([]);

  // Mock leads data
  const mockLeads = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      company: "ABC Corp",
      industry: "Technology",
      source: "Website",
      aiScore: 85,
      status: "valid",
      lastContact: "2024-01-15"
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@email.com",
      phone: "(555) 987-6543",
      company: "XYZ Inc",
      industry: "Healthcare",
      source: "Referral",
      aiScore: 72,
      status: "valid",
      lastContact: "2024-02-20"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "invalid-email",
      phone: "(555) 456-7890",
      company: "Tech Solutions",
      industry: "Software",
      source: "Trade Show",
      aiScore: 45,
      status: "invalid",
      lastContact: "2024-03-10"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "(555) 234-5678",
      company: "Health Plus",
      industry: "Healthcare",
      source: "LinkedIn",
      aiScore: 90,
      status: "valid",
      lastContact: "2024-01-25"
    },
    {
      id: 5,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      company: "ABC Corp",
      industry: "Technology",
      source: "Website",
      aiScore: 85,
      status: "duplicate",
      lastContact: "2024-01-15"
    }
  ];

  const mockValidationErrors = [
    {
      row: 3,
      field: "Email",
      message: "Invalid email format"
    },
    {
      row: 7,
      field: "Phone",
      message: "Phone number format is incorrect"
    },
    {
      row: 12,
      field: "Required Field",
      message: "First name is required"
    }
  ];

  useEffect(() => {
    // Calculate validation stats when leads change
    const total = leads?.length;
    const valid = leads?.filter(lead => lead?.status === 'valid')?.length;
    const invalid = leads?.filter(lead => lead?.status === 'invalid')?.length;
    const duplicates = leads?.filter(lead => lead?.status === 'duplicate')?.length;
    
    setValidationStats({ total, valid, invalid, duplicates });
  }, [leads]);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          setLeads(mockLeads);
          setValidationErrors(mockValidationErrors);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleLeadSelect = (leadId, isSelected) => {
    setSelectedLeads(prev => 
      isSelected 
        ? [...prev, leadId]
        : prev?.filter(id => id !== leadId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedLeads(isSelected ? leads?.map(lead => lead?.id) : []);
  };

  const handleBulkAction = (action) => {
    console.log(`Performing bulk action: ${action} on leads:`, selectedLeads);
    
    switch (action) {
      case 'segment':
        // Handle segmentation
        break;
      case 'remove-duplicates':
        const uniqueLeads = leads?.filter(lead => lead?.status !== 'duplicate');
        setLeads(uniqueLeads);
        setSelectedLeads([]);
        break;
      case 'export':
        // Handle export
        const csvContent = leads?.filter(lead => selectedLeads?.includes(lead?.id))?.map(lead => `${lead?.name},${lead?.email},${lead?.phone},${lead?.company}`)?.join('\n');
        
        const blob = new Blob([`Name,Email,Phone,Company\n${csvContent}`], { type: 'text/csv' });
        const url = window.URL?.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'selected_leads.csv';
        document.body?.appendChild(a);
        a?.click();
        document.body?.removeChild(a);
        window.URL?.revokeObjectURL(url);
        break;
      case 'delete':
        const remainingLeads = leads?.filter(lead => !selectedLeads?.includes(lead?.id));
        setLeads(remainingLeads);
        setSelectedLeads([]);
        break;
      default:
        break;
    }
    
    setShowBulkActions(false);
  };

  const handleApplyTags = (leadIds, tags) => {
    console.log('Applying tags:', tags, 'to leads:', leadIds);
    // Handle tag application logic
  };

  const handleFixErrors = () => {
    console.log('Opening error fixing interface');
    // Handle error fixing logic
  };

  const handleProceedToCampaign = () => {
    navigate('/campaign-builder');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16`}>
        <div className="p-6">
          <Breadcrumb />
          
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Lead Import Manager</h1>
                <p className="text-muted-foreground mt-2">
                  Import, validate, and segment your lead database for reactivation campaigns
                </p>
              </div>
              
              {leads?.length > 0 && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="lg:hidden"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Bulk Actions
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleProceedToCampaign}
                    disabled={validationStats?.valid === 0}
                  >
                    <Icon name="ArrowRight" size={16} className="mr-2" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <UploadZone
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />

              {leads?.length > 0 && (
                <>
                  <ValidationResults
                    validationStats={validationStats}
                    errors={validationErrors}
                    onFixErrors={handleFixErrors}
                  />

                  <DataPreviewTable
                    leads={leads}
                    selectedLeads={selectedLeads}
                    onLeadSelect={handleLeadSelect}
                    onSelectAll={handleSelectAll}
                    onBulkAction={handleBulkAction}
                  />

                  {selectedLeads?.length > 0 && (
                    <IndustryTagging
                      selectedLeads={selectedLeads}
                      onApplyTags={handleApplyTags}
                      availableTags={[
                        'Technology',
                        'Healthcare', 
                        'Finance',
                        'Manufacturing',
                        'Retail',
                        'Education',
                        'Real Estate',
                        'Automotive',
                        'Food & Beverage',
                        'Consulting'
                      ]}
                    />
                  )}
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <BulkActionsPanel
                selectedLeads={selectedLeads}
                onAction={handleBulkAction}
                isVisible={showBulkActions || selectedLeads?.length > 0}
                onClose={() => setShowBulkActions(false)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadImportManager;