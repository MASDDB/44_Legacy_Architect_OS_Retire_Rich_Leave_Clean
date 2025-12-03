import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const BrandingControls = ({ selectedReseller, onSave, onCancel }) => {
  const [brandingData, setBrandingData] = useState({
    logo: selectedReseller?.branding?.logo || '',
    primaryColor: selectedReseller?.branding?.primaryColor || '#1E40AF',
    secondaryColor: selectedReseller?.branding?.secondaryColor || '#6366F1',
    accentColor: selectedReseller?.branding?.accentColor || '#F59E0B',
    customDomain: selectedReseller?.branding?.customDomain || '',
    companyName: selectedReseller?.branding?.companyName || selectedReseller?.company || '',
    tagline: selectedReseller?.branding?.tagline || '',
    supportEmail: selectedReseller?.branding?.supportEmail || selectedReseller?.email || '',
    supportPhone: selectedReseller?.branding?.supportPhone || ''
  });

  const [logoPreview, setLogoPreview] = useState(brandingData?.logo);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setBrandingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const mockUrl = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center`;
      setLogoPreview(mockUrl);
      setBrandingData(prev => ({
        ...prev,
        logo: mockUrl
      }));
      setIsUploading(false);
    }, 2000);
  };

  const handleSave = () => {
    onSave(brandingData);
  };

  const colorPresets = [
    { name: 'Blue', primary: '#1E40AF', secondary: '#6366F1', accent: '#F59E0B' },
    { name: 'Green', primary: '#059669', secondary: '#10B981', accent: '#F59E0B' },
    { name: 'Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#F59E0B' },
    { name: 'Red', primary: '#DC2626', secondary: '#EF4444', accent: '#F59E0B' },
    { name: 'Orange', primary: '#EA580C', secondary: '#F97316', accent: '#1E40AF' },
    { name: 'Teal', primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B' }
  ];

  const applyColorPreset = (preset) => {
    setBrandingData(prev => ({
      ...prev,
      primaryColor: preset?.primary,
      secondaryColor: preset?.secondary,
      accentColor: preset?.accent
    }));
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Brand Customization</h3>
            <p className="text-sm text-muted-foreground">
              Configure branding for {selectedReseller?.company}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Logo Upload Section */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-foreground">Logo & Identity</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {logoPreview ? (
                  <div className="space-y-4">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 mx-auto rounded-lg object-cover"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Current logo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload">
                        <Button variant="outline" size="sm" loading={isUploading}>
                          {isUploading ? 'Uploading...' : 'Change Logo'}
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Icon name="Upload" size={48} className="text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Upload logo</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload">
                      <Button variant="outline" size="sm" loading={isUploading}>
                        {isUploading ? 'Uploading...' : 'Choose File'}
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Company Name"
                type="text"
                value={brandingData?.companyName}
                onChange={(e) => handleInputChange('companyName', e?.target?.value)}
                placeholder="Enter company name"
              />
              <Input
                label="Tagline"
                type="text"
                value={brandingData?.tagline}
                onChange={(e) => handleInputChange('tagline', e?.target?.value)}
                placeholder="Your company tagline"
              />
            </div>
          </div>
        </div>

        {/* Color Scheme Section */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-foreground">Color Scheme</h4>
          
          {/* Color Presets */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {colorPresets?.map((preset) => (
                <button
                  key={preset?.name}
                  onClick={() => applyColorPreset(preset)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex space-x-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset?.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset?.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset?.accent }}
                    />
                  </div>
                  <span className="text-sm text-foreground">{preset?.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={brandingData?.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e?.target?.value)}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={brandingData?.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={brandingData?.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e?.target?.value)}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={brandingData?.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={brandingData?.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e?.target?.value)}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <Input
                  type="text"
                  value={brandingData?.accentColor}
                  onChange={(e) => handleInputChange('accentColor', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Domain & Contact Section */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-foreground">Domain & Contact</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              label="Custom Domain"
              type="text"
              value={brandingData?.customDomain}
              onChange={(e) => handleInputChange('customDomain', e?.target?.value)}
              placeholder="app.yourcompany.com"
              description="Configure your custom domain"
            />
            <Input
              label="Support Email"
              type="email"
              value={brandingData?.supportEmail}
              onChange={(e) => handleInputChange('supportEmail', e?.target?.value)}
              placeholder="support@yourcompany.com"
            />
            <Input
              label="Support Phone"
              type="tel"
              value={brandingData?.supportPhone}
              onChange={(e) => handleInputChange('supportPhone', e?.target?.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-foreground">Live Preview</h4>
          <div className="border border-border rounded-lg p-6 bg-muted/30">
            <div className="space-y-4">
              {/* Header Preview */}
              <div
                className="rounded-lg p-4 text-white"
                style={{ backgroundColor: brandingData?.primaryColor }}
              >
                <div className="flex items-center space-x-3">
                  {logoPreview && (
                    <Image
                      src={logoPreview}
                      alt="Logo"
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <div>
                    <h5 className="font-semibold">{brandingData?.companyName || 'Company Name'}</h5>
                    {brandingData?.tagline && (
                      <p className="text-sm opacity-90">{brandingData?.tagline}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Button Preview */}
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: brandingData?.secondaryColor }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: brandingData?.accentColor }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingControls;