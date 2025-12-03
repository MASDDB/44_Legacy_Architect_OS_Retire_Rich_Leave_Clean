import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';

const SalesKitManager = ({ selectedReseller, onClose }) => {
  const [activeTab, setActiveTab] = useState('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const salesAssets = [
    {
      id: 1,
      name: 'Database Reactivation Pitch Deck',
      type: 'presentation',
      category: 'presentations',
      size: '2.4 MB',
      downloads: 156,
      lastUpdated: '2025-01-02',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      description: 'Complete pitch deck for database reactivation services'
    },
    {
      id: 2,
      name: 'ROI Calculator Spreadsheet',
      type: 'spreadsheet',
      category: 'tools',
      size: '1.2 MB',
      downloads: 89,
      lastUpdated: '2025-01-01',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      description: 'Interactive ROI calculator for prospects'
    },
    {
      id: 3,
      name: 'Case Study: Solar Company Success',
      type: 'document',
      category: 'case-studies',
      size: '856 KB',
      downloads: 234,
      lastUpdated: '2024-12-28',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop',
      description: '300% increase in appointments for solar company'
    },
    {
      id: 4,
      name: 'Email Templates Collection',
      type: 'document',
      category: 'templates',
      size: '445 KB',
      downloads: 178,
      lastUpdated: '2024-12-25',
      thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&h=200&fit=crop',
      description: 'Pre-written email templates for outreach'
    },
    {
      id: 5,
      name: 'Product Demo Video',
      type: 'video',
      category: 'videos',
      size: '45.2 MB',
      downloads: 67,
      lastUpdated: '2024-12-20',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
      description: '15-minute product demonstration video'
    },
    {
      id: 6,
      name: 'Pricing Comparison Sheet',
      type: 'spreadsheet',
      category: 'pricing',
      size: '678 KB',
      downloads: 145,
      lastUpdated: '2024-12-18',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      description: 'Competitive pricing analysis and positioning'
    }
  ];

  const customizationTemplates = [
    {
      id: 1,
      name: 'Branded Proposal Template',
      type: 'template',
      customizable: true,
      fields: ['Company Logo', 'Company Name', 'Contact Info', 'Pricing'],
      lastModified: '2025-01-02'
    },
    {
      id: 2,
      name: 'Email Signature Generator',
      type: 'generator',
      customizable: true,
      fields: ['Name', 'Title', 'Company', 'Phone', 'Email'],
      lastModified: '2024-12-30'
    },
    {
      id: 3,
      name: 'Social Media Post Templates',
      type: 'template',
      customizable: true,
      fields: ['Company Name', 'Logo', 'Brand Colors'],
      lastModified: '2024-12-28'
    }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'presentations', label: 'Presentations' },
    { value: 'case-studies', label: 'Case Studies' },
    { value: 'templates', label: 'Templates' },
    { value: 'tools', label: 'Tools' },
    { value: 'videos', label: 'Videos' },
    { value: 'pricing', label: 'Pricing' }
  ];

  const filteredAssets = salesAssets?.filter(asset => {
    const matchesSearch = asset?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         asset?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || asset?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'presentation':
        return 'Presentation';
      case 'spreadsheet':
        return 'FileSpreadsheet';
      case 'document':
        return 'FileText';
      case 'video':
        return 'Video';
      default:
        return 'File';
    }
  };

  const handleDownload = (asset) => {
    // Simulate download
    console.log(`Downloading ${asset?.name}`);
  };

  const handleCustomize = (template) => {
    // Simulate customization
    console.log(`Customizing ${template?.name}`);
  };

  const tabs = [
    { id: 'assets', label: 'Marketing Assets', icon: 'FolderOpen' },
    { id: 'templates', label: 'Customizable Templates', icon: 'Edit' },
    { id: 'analytics', label: 'Usage Analytics', icon: 'BarChart3' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Sales Kit Manager</h2>
            <p className="text-sm text-muted-foreground">
              Marketing assets for {selectedReseller?.company}
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            <Icon name="X" size={16} />
            Close
          </Button>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="font-medium">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'assets' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                />
              </div>
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="Filter by category"
                className="w-full sm:w-48"
              />
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets?.map((asset) => (
                <div key={asset?.id} className="bg-muted/30 rounded-lg border border-border overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={asset?.thumbnail}
                      alt={asset?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-card/90 backdrop-blur-sm rounded-full p-2">
                        <Icon name={getFileIcon(asset?.type)} size={16} className="text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-2">{asset?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {asset?.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{asset?.size}</span>
                      <span>{asset?.downloads} downloads</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(asset)}
                        className="flex-1"
                      >
                        <Icon name="Download" size={14} />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Customizable Templates</h3>
              <p className="text-muted-foreground">
                Personalize marketing materials with your branding
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {customizationTemplates?.map((template) => (
                <div key={template?.id} className="bg-muted/30 rounded-lg border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{template?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last modified: {template?.lastModified}
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-full p-2">
                      <Icon name="Edit" size={16} className="text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <p className="text-sm font-medium text-foreground">Customizable Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {template?.fields?.map((field, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCustomize(template)}
                      className="flex-1"
                    >
                      <Icon name="Edit" size={14} />
                      Customize
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Usage Analytics</h3>
              <p className="text-muted-foreground">
                Track how your sales materials are performing
              </p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/30 rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Icon name="Download" size={20} className="text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">1,247</span>
                </div>
                <h3 className="font-medium text-foreground">Total Downloads</h3>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </div>

              <div className="bg-muted/30 rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-success/10 rounded-full p-3">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">89%</span>
                </div>
                <h3 className="font-medium text-foreground">Engagement Rate</h3>
                <p className="text-sm text-muted-foreground">+5% from last month</p>
              </div>

              <div className="bg-muted/30 rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-warning/10 rounded-full p-3">
                    <Icon name="Star" size={20} className="text-warning" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">4.8</span>
                </div>
                <h3 className="font-medium text-foreground">Average Rating</h3>
                <p className="text-sm text-muted-foreground">Based on feedback</p>
              </div>
            </div>

            {/* Most Popular Assets */}
            <div className="bg-muted/30 rounded-lg border border-border p-6">
              <h3 className="font-medium text-foreground mb-4">Most Popular Assets</h3>
              <div className="space-y-3">
                {salesAssets?.slice(0, 5)?.map((asset, index) => (
                  <div key={asset?.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <Icon name={getFileIcon(asset?.type)} size={16} className="text-primary" />
                      <span className="text-sm text-foreground">{asset?.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        {asset?.downloads} downloads
                      </span>
                      <div className="w-20 bg-border rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(asset?.downloads / 250) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesKitManager;