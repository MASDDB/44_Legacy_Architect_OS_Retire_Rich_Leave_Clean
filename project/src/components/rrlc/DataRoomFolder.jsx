import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const DataRoomFolder = ({ folder, documents = [], onUpload, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
            <Icon name={isExpanded ? 'FolderOpen' : 'Folder'} size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base font-semibold text-foreground">
                {folder.folder_number}. {folder.folder_name}
              </h3>
              {folder.is_complete && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-full">
                  <Icon name="CheckCircle" size={14} className="text-success" />
                  <span className="text-xs font-medium text-success">Complete</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{folder.folder_description}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">
              {folder.document_count || 0} / {folder.required_document_count || 3}
            </div>
            <div className="text-xs text-muted-foreground">documents</div>
          </div>
          <div className="w-28">
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${(folder.completion_percentage || 0) >= 100
                    ? 'bg-success'
                    : 'bg-primary'
                  }`}
                style={{ width: `${Math.min(folder.completion_percentage || 0, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center mt-1.5">
              {Math.round(folder.completion_percentage || 0)}%
            </div>
          </div>
          <Icon
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            size={20}
            className="text-muted-foreground"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border bg-muted/20">
          <div className="p-5 space-y-3">
            {documents.length > 0 ? (
              <>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-lg">
                        <Icon name="FileText" size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {doc.document_name}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{doc.document_type || 'Document'}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploaded_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.file_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(doc.file_url, '_blank');
                          }}
                          iconName="Download"
                        >
                          Download
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this document?')) {
                            onDelete(doc.id);
                          }
                        }}
                        iconName="Trash2"
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg border border-dashed border-border">
                <div className="flex items-center justify-center mb-3">
                  <Icon name="FileX" size={40} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No documents uploaded yet</p>
                <p className="text-xs text-muted-foreground">
                  Start uploading your {folder.folder_name.toLowerCase()} documents
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpload(folder.id, folder);
                }}
                iconName="Upload"
                variant="outline"
                fullWidth
                className="border-dashed"
              >
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataRoomFolder;
