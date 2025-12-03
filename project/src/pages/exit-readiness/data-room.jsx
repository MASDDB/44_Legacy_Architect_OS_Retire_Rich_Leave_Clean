import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DataRoomFolder from '../../components/rrlc/DataRoomFolder';
import CloudStorageCard from '../../components/rrlc/CloudStorageCard';
import DocumentUploadModal from '../../components/rrlc/DocumentUploadModal';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import {
  getBusinessesByUserId,
  getDataRoomFolders,
  initializeDataRoomFolders,
  getDocumentsByFolder,
  uploadDocument,
  uploadFileToStorage,
  deleteDocument,
  deleteFileFromStorage,
  getDataRoomStatistics
} from '../../services/rrclService';
import {
  getCloudStorageConnections,
  initiateGoogleDriveAuth,
  initiateDropboxAuth,
  disconnectCloudStorage,
  isProviderConnected
} from '../../services/cloudStorageService';

const DataRoom = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderDocuments, setFolderDocuments] = useState({});
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [cloudConnections, setCloudConnections] = useState({});
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    if (initialized && !user) {
      navigate('/user-authentication');
    }
  }, [user, initialized, navigate]);

  useEffect(() => {
    if (user) {
      loadDataRoom();
    }
  }, [user]);

  const loadDataRoom = async () => {
    setLoading(true);
    try {
      const { data: businesses } = await getBusinessesByUserId(user.id);
      if (businesses && businesses.length > 0) {
        const currentBusiness = businesses[0];
        setBusiness(currentBusiness);

        // Initialize folders if they don't exist
        let { data: foldersData } = await getDataRoomFolders(currentBusiness.id);

        if (!foldersData || foldersData.length === 0) {
          await initializeDataRoomFolders(currentBusiness.id, user.id);
          const { data: newFolders } = await getDataRoomFolders(currentBusiness.id);
          foldersData = newFolders;
        }

        setFolders(foldersData || []);

        // Load documents for each folder
        const docsMap = {};
        for (const folder of foldersData || []) {
          const { data: docs } = await getDocumentsByFolder(folder.id);
          docsMap[folder.id] = docs || [];
        }
        setFolderDocuments(docsMap);

        // Load statistics
        const { data: stats } = await getDataRoomStatistics(currentBusiness.id);
        setStatistics(stats);

        // Load cloud storage connections
        const { data: connections } = await getCloudStorageConnections(currentBusiness.id);
        const connectionsMap = {};
        connections?.forEach(conn => {
          connectionsMap[conn.provider] = conn;
        });
        setCloudConnections(connectionsMap);
      }
    } catch (error) {
      console.error('Error loading data room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (folderId, folder) => {
    setSelectedFolder(folder);
    setUploadModalOpen(true);
  };

  const handleUploadDocument = async (file, documentType) => {
    if (!business || !selectedFolder) return;

    try {
      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await uploadFileToStorage(
        file,
        business.id,
        selectedFolder.id
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      // Save document metadata to database
      const documentData = {
        document_name: fileData.fileName,
        document_type: documentType,
        file_url: fileData.url,
        file_path: fileData.path,
        file_size: fileData.fileSize,
        file_type: fileData.fileType
      };

      await uploadDocument(business.id, selectedFolder.id, user.id, documentData);

      // Reload data room
      await loadDataRoom();
      setUploadModalOpen(false);
      setSelectedFolder(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const handleDelete = async (documentId) => {
    try {
      // Get document to find file path
      const allDocs = Object.values(folderDocuments).flat();
      const doc = allDocs.find(d => d.id === documentId);

      // Delete from storage
      if (doc?.file_path) {
        await deleteFileFromStorage(doc.file_path);
      }

      // Delete from database
      await deleteDocument(documentId);

      // Reload data room
      await loadDataRoom();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleConnectCloud = async (provider) => {
    if (!business) return;

    if (provider === 'google_drive') {
      const result = initiateGoogleDriveAuth(business.id);
      if (result?.error) {
        alert(result.error);
      }
    } else if (provider === 'dropbox') {
      const result = initiateDropboxAuth(business.id);
      if (result?.error) {
        alert(result.error);
      }
    }
  };

  const handleDisconnectCloud = async (provider) => {
    if (!business) return;

    if (confirm(`Are you sure you want to disconnect ${provider === 'google_drive' ? 'Google Drive' : 'Dropbox'}?`)) {
      await disconnectCloudStorage(business.id, provider);
      await loadDataRoom();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Data Room Generator</h1>
              <p className="text-muted-foreground">
                Organize your M&A data room with industry-standard 0-10 structure
              </p>
            </div>
            <Link
              to="/exit-readiness"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
              <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4" />
              <p>Loading data room...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Cloud Storage Integration Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Cloud Storage Integration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CloudStorageCard
                    provider="google_drive"
                    icon="Cloud"
                    title="Google Drive"
                    description="Import folders from Google Drive"
                    connected={!!cloudConnections.google_drive?.is_active}
                    onConnect={() => handleConnectCloud('google_drive')}
                    onDisconnect={() => handleDisconnectCloud('google_drive')}
                  />
                  <CloudStorageCard
                    provider="dropbox"
                    icon="Cloud"
                    title="Dropbox"
                    description="Import folders from Dropbox"
                    connected={!!cloudConnections.dropbox?.is_active}
                    onConnect={() => handleConnectCloud('dropbox')}
                    onDisconnect={() => handleDisconnectCloud('dropbox')}
                  />
                </div>
              </div>

              {/* Data Room Statistics */}
              {statistics && (
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Data Room Completeness
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {statistics.completedFolders} of {statistics.totalFolders} folders complete • {statistics.totalDocuments} documents uploaded
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-primary">
                        {statistics.overallCompletion}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Overall Progress</div>
                    </div>
                  </div>
                  <div className="mt-4 h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${statistics.overallCompletion}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Data Room Structure (0-10 Sections) */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Data Room Structure (0-10 Sections)
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Standard M&A diligence folder structure. Upload your documents by section.
                </p>
                <div className="space-y-4">
                  {folders.map((folder) => (
                    <DataRoomFolder
                      key={folder.id}
                      folder={folder}
                      documents={folderDocuments[folder.id] || []}
                      onUpload={handleUpload}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && selectedFolder && (
        <DocumentUploadModal
          folder={selectedFolder}
          onClose={() => {
            setUploadModalOpen(false);
            setSelectedFolder(null);
          }}
          onUpload={handleUploadDocument}
          showCloudImport={false}
        />
      )}
    </div>
  );
};

export default DataRoom;
