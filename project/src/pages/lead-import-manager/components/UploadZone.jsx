import React, { useState, useCallback, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFileUpload, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    const csvFile = files?.find(file => file?.type === 'text/csv' || file?.name?.endsWith('.csv'));
    if (csvFile && onFileUpload) {
      onFileUpload(csvFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e) => {
    const file = e?.target?.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset the input value so the same file can be selected again
    if (e?.target) {
      e.target.value = '';
    }
  }, [onFileUpload]);

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef?.current && !isUploading) {
      fileInputRef?.current?.click();
    }
  }, [isUploading]);

  const downloadTemplate = () => {
    const csvContent = `First Name,Last Name,Email,Phone,Company,Industry,Source,Last Contact Date
John,Smith,john.smith@email.com,(555) 123-4567,ABC Corp,Technology,Website,2024-01-15
Jane,Doe,jane.doe@email.com,(555) 987-6543,XYZ Inc,Healthcare,Referral,2024-02-20
Mike,Johnson,mike.j@email.com,(555) 456-7890,Tech Solutions,Software,Trade Show,2024-03-10`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Import Lead Database</h2>
        <p className="text-muted-foreground">
          Upload your CSV file to import leads into the system. Maximum file size: 10MB
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-foreground font-medium">Uploading and processing...</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-muted-foreground mb-4">or</p>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Upload CSV file"
              />
              
              {/* Browse Files Button */}
              <Button 
                variant="outline" 
                onClick={handleBrowseClick}
                disabled={isUploading}
                className="cursor-pointer"
                type="button"
              >
                <Icon name="FolderOpen" size={16} className="mr-2" />
                Browse Files
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="FileText" size={16} className="mr-2 text-primary" />
            Supported Format
          </h3>
          <p className="text-sm text-muted-foreground">CSV files only (.csv)</p>
          <p className="text-sm text-muted-foreground">Maximum size: 10MB</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="Download" size={16} className="mr-2 text-primary" />
            Need a Template?
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTemplate}
            className="text-primary hover:text-primary/80"
            type="button"
          >
            Download Sample CSV
          </Button>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          <strong>Required columns:</strong> First Name, Last Name, Email, Phone
        </p>
        <p>
          <strong>Optional columns:</strong> Company, Industry, Source, Last Contact Date
        </p>
      </div>
    </div>
  );
};

export default UploadZone;