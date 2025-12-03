/**
 * Cloud Storage Service
 * Handles integrations with Google Drive and Dropbox
 */

import { supabase } from '../lib/supabase';

// Environment variables for cloud storage
const GOOGLE_DRIVE_CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID;
const DROPBOX_APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY;
const REDIRECT_URI = `${window.location.origin}/exit-readiness/data-room`;

// ==================== Google Drive ====================

/**
 * Initiate Google Drive OAuth flow
 */
export function initiateGoogleDriveAuth(businessId) {
  if (!GOOGLE_DRIVE_CLIENT_ID) {
    console.warn('Google Drive Client ID not configured');
    return {
      error: 'Google Drive integration requires API credentials. Please contact your administrator.'
    };
  }

  const scope = 'https://www.googleapis.com/auth/drive.readonly';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_DRIVE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=token&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${businessId}`;

  window.location.href = authUrl;
}

/**
 * Save Google Drive connection
 */
export async function saveGoogleDriveConnection(businessId, userId, accessToken) {
  try {
    const { data, error } = await supabase
      .from('rrlc_cloud_storage_connections')
      .upsert([
        {
          business_id: businessId,
          user_id: userId,
          provider: 'google_drive',
          access_token: accessToken,
          is_active: true,
          connected_at: new Date().toISOString()
        }
      ], {
        onConflict: 'business_id,provider'
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving Google Drive connection:', error);
    return { data: null, error: error.message };
  }
}

/**
 * List files from Google Drive
 */
export async function listGoogleDriveFiles(accessToken, folderId = 'root') {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?` +
      `q='${folderId}'+in+parents&` +
      `fields=files(id,name,mimeType,size,modifiedTime)`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch Google Drive files');
    const data = await response.json();
    return { data: data.files, error: null };
  } catch (error) {
    console.error('Error listing Google Drive files:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Import file from Google Drive
 */
export async function importFromGoogleDrive(accessToken, fileId, fileName) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) throw new Error('Failed to download file from Google Drive');
    const blob = await response.blob();
    return { data: { blob, fileName }, error: null };
  } catch (error) {
    console.error('Error importing from Google Drive:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Dropbox ====================

/**
 * Initiate Dropbox OAuth flow
 */
export function initiateDropboxAuth(businessId) {
  if (!DROPBOX_APP_KEY) {
    console.warn('Dropbox App Key not configured');
    return {
      error: 'Dropbox integration requires API credentials. Please contact your administrator.'
    };
  }

  const authUrl = `https://www.dropbox.com/oauth2/authorize?` +
    `client_id=${DROPBOX_APP_KEY}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=token&` +
    `state=${businessId}`;

  window.location.href = authUrl;
}

/**
 * Save Dropbox connection
 */
export async function saveDropboxConnection(businessId, userId, accessToken) {
  try {
    const { data, error } = await supabase
      .from('rrlc_cloud_storage_connections')
      .upsert([
        {
          business_id: businessId,
          user_id: userId,
          provider: 'dropbox',
          access_token: accessToken,
          is_active: true,
          connected_at: new Date().toISOString()
        }
      ], {
        onConflict: 'business_id,provider'
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving Dropbox connection:', error);
    return { data: null, error: error.message };
  }
}

/**
 * List files from Dropbox
 */
export async function listDropboxFiles(accessToken, path = '') {
  try {
    const response = await fetch(
      'https://api.dropboxapi.com/2/files/list_folder',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: path || '',
          limit: 100
        })
      }
    );

    if (!response.ok) throw new Error('Failed to fetch Dropbox files');
    const data = await response.json();
    return { data: data.entries, error: null };
  } catch (error) {
    console.error('Error listing Dropbox files:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Import file from Dropbox
 */
export async function importFromDropbox(accessToken, filePath) {
  try {
    const response = await fetch(
      'https://content.dropboxapi.com/2/files/download',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({ path: filePath })
        }
      }
    );

    if (!response.ok) throw new Error('Failed to download file from Dropbox');
    const blob = await response.blob();
    const fileName = filePath.split('/').pop();
    return { data: { blob, fileName }, error: null };
  } catch (error) {
    console.error('Error importing from Dropbox:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Cloud Storage Connections ====================

/**
 * Get cloud storage connections for a business
 */
export async function getCloudStorageConnections(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_cloud_storage_connections')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching cloud storage connections:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Disconnect cloud storage
 */
export async function disconnectCloudStorage(businessId, provider) {
  try {
    const { error } = await supabase
      .from('rrlc_cloud_storage_connections')
      .update({ is_active: false, disconnected_at: new Date().toISOString() })
      .eq('business_id', businessId)
      .eq('provider', provider);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error disconnecting cloud storage:', error);
    return { error: error.message };
  }
}

/**
 * Check if a provider is connected
 */
export async function isProviderConnected(businessId, provider) {
  try {
    const { data, error } = await supabase
      .from('rrlc_cloud_storage_connections')
      .select('id')
      .eq('business_id', businessId)
      .eq('provider', provider)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return { connected: !!data, error: null };
  } catch (error) {
    console.error('Error checking provider connection:', error);
    return { connected: false, error: error.message };
  }
}
