import React, { useState, useRef } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const DocumentUploadModal = ({
    folder,
    onClose,
    onUpload,
    showCloudImport = false
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentType, setDocumentType] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !documentType) {
            alert('Please select a file and document type');
            return;
        }

        setUploading(true);
        try {
            await onUpload(selectedFile, documentType);
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background border border-border rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Upload Document</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Folder {folder.folder_number}: {folder.folder_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Icon name="X" size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Drag and Drop Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {selectedFile ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                    <Icon name="FileText" size={48} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-foreground font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFile(null)}
                                    iconName="X"
                                >
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center mb-4">
                                    <Icon name="Upload" size={48} className="text-muted-foreground" />
                                </div>
                                <p className="text-foreground font-medium mb-2">
                                    Drag and drop your file here
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">or</p>
                                <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    iconName="FolderOpen"
                                >
                                    Browse Files
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                                />
                            </>
                        )}
                    </div>

                    {/* Document Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Document Type *
                        </label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select document type...</option>
                            <option value="Financial Statement">Financial Statement</option>
                            <option value="Contract">Contract</option>
                            <option value="Agreement">Agreement</option>
                            <option value="Legal Document">Legal Document</option>
                            <option value="Tax Return">Tax Return</option>
                            <option value="Certificate">Certificate</option>
                            <option value="License">License</option>
                            <option value="Report">Report</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Cloud Import Section (Optional) */}
                    {showCloudImport && (
                        <div className="border-t border-border pt-6">
                            <p className="text-sm font-medium text-foreground mb-3">
                                Or import from cloud storage
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    iconName="Cloud"
                                    onClick={() => alert('Cloud import feature coming soon')}
                                >
                                    Google Drive
                                </Button>
                                <Button
                                    variant="outline"
                                    iconName="Cloud"
                                    onClick={() => alert('Cloud import feature coming soon')}
                                >
                                    Dropbox
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                    <Button variant="ghost" onClick={onClose} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || !documentType || uploading}
                        iconName={uploading ? 'Loader' : 'Upload'}
                    >
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadModal;
