/**
 * RRLC Service Layer
 * All database operations for the RRLC Exit Readiness module
 */

import { supabase } from '../lib/supabase';

// ==================== Email Captures ====================

export async function captureEmail(email, source = 'assessment', metadata = {}) {
  try {
    const { data, error } = await supabase
      .from('rrlc_email_captures')
      .insert([
        {
          email,
          source,
          ip_address: metadata.ip_address,
          user_agent: metadata.user_agent
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error capturing email:', error);
    return { data: null, error: error.message };
  }
}

// ==================== SMS Consents ====================

export async function recordSMSConsent(emailCaptureId, phoneNumber, consentText, metadata = {}) {
  try {
    const { data, error } = await supabase
      .from('rrlc_sms_consents')
      .insert([
        {
          email_capture_id: emailCaptureId,
          phone_number: phoneNumber,
          consent_given: true,
          consent_text: consentText,
          ip_address: metadata.ip_address,
          user_agent: metadata.user_agent
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error recording SMS consent:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Assessment Submissions ====================

export async function submitAssessment(userId, assessmentData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_assessment_submissions')
      .insert([
        {
          user_id: userId,
          ...assessmentData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return { data: null, error: error.message };
  }
}

export async function getAssessmentsByUserId(userId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_assessment_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return { data: null, error: error.message };
  }
}

export async function getLatestAssessment(userId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_assessment_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching latest assessment:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Businesses ====================

export async function createBusiness(userId, businessData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_businesses')
      .insert([
        {
          user_id: userId,
          ...businessData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating business:', error);
    return { data: null, error: error.message };
  }
}

export async function getBusinessesByUserId(userId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_businesses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return { data: null, error: error.message };
  }
}

export async function getBusinessById(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_businesses')
      .select('*')
      .eq('id', businessId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching business:', error);
    return { data: null, error: error.message };
  }
}

export async function updateBusiness(businessId, updates) {
  try {
    const { data, error } = await supabase
      .from('rrlc_businesses')
      .update(updates)
      .eq('id', businessId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating business:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Data Room Folders ====================

export async function initializeDataRoomFolders(businessId, userId) {
  const folders = [
    { number: 0, name: 'Executive Summary', description: 'High-level overview and CIM' },
    { number: 1, name: 'Corporate Structure', description: 'Articles, bylaws, cap table, ownership' },
    { number: 2, name: 'Financial Information', description: 'Financial statements, tax returns, audits' },
    { number: 3, name: 'Customer Contracts', description: 'Customer agreements and contracts' },
    { number: 4, name: 'Vendor & Suppliers', description: 'Vendor agreements and supplier contracts' },
    { number: 5, name: 'Employee Information', description: 'Org chart, employment agreements, compensation' },
    { number: 6, name: 'Intellectual Property', description: 'Trademarks, patents, copyrights, domain names' },
    { number: 7, name: 'Real Estate & Facilities', description: 'Leases, property documents' },
    { number: 8, name: 'Legal & Compliance', description: 'Litigation, compliance records, permits' },
    { number: 9, name: 'Operations & Technology', description: 'Process docs, IT systems, software licenses' },
    { number: 10, name: 'Marketing & Sales', description: 'Marketing materials, sales pipeline, customer lists' }
  ];

  try {
    const folderRecords = folders.map(folder => ({
      business_id: businessId,
      user_id: userId,
      folder_number: folder.number,
      folder_name: folder.name,
      folder_description: folder.description,
      required_document_count: folder.number === 0 ? 1 : 3 // Adjust as needed
    }));

    const { data, error } = await supabase
      .from('rrlc_data_room_folders')
      .insert(folderRecords)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error initializing data room folders:', error);
    return { data: null, error: error.message };
  }
}

export async function getDataRoomFolders(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_data_room_folders')
      .select('*')
      .eq('business_id', businessId)
      .order('folder_number', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching data room folders:', error);
    return { data: null, error: error.message };
  }
}

export async function updateFolderCompletion(folderId, documentCount) {
  try {
    // Get folder to check required document count
    const { data: folder } = await supabase
      .from('rrlc_data_room_folders')
      .select('required_document_count')
      .eq('id', folderId)
      .maybeSingle();

    const requiredCount = folder?.required_document_count || 1;
    const completionPercentage = Math.min((documentCount / requiredCount) * 100, 100);
    const isComplete = documentCount >= requiredCount;

    const { data, error } = await supabase
      .from('rrlc_data_room_folders')
      .update({
        document_count: documentCount,
        completion_percentage: completionPercentage,
        is_complete: isComplete,
        completed_at: isComplete ? new Date().toISOString() : null
      })
      .eq('id', folderId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating folder completion:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Documents ====================

export async function uploadDocument(businessId, folderId, userId, documentData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_documents')
      .insert([
        {
          business_id: businessId,
          folder_id: folderId,
          user_id: userId,
          uploaded_by: userId,
          ...documentData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;

    // Update folder document count
    await updateFolderDocumentCount(folderId);

    return { data, error: null };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { data: null, error: error.message };
  }
}

export async function getDocumentsByFolder(folderId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_documents')
      .select('*')
      .eq('folder_id', folderId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { data: null, error: error.message };
  }
}

export async function getDocumentsByBusiness(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_documents')
      .select('*, rrlc_data_room_folders(folder_name, folder_number)')
      .eq('business_id', businessId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching business documents:', error);
    return { data: null, error: error.message };
  }
}

export async function deleteDocument(documentId) {
  try {
    // Get document info before deleting
    const { data: doc } = await supabase
      .from('rrlc_documents')
      .select('folder_id')
      .eq('id', documentId)
      .maybeSingle();

    const { error } = await supabase
      .from('rrlc_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;

    // Update folder document count
    if (doc?.folder_id) {
      await updateFolderDocumentCount(doc.folder_id);
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { error: error.message };
  }
}

async function updateFolderDocumentCount(folderId) {
  const { data: documents } = await supabase
    .from('rrlc_documents')
    .select('id')
    .eq('folder_id', folderId);

  const count = documents?.length || 0;
  await updateFolderCompletion(folderId, count);
}

// ==================== Financial Records ====================

export async function createFinancialRecord(businessId, userId, financialData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_financial_records')
      .insert([
        {
          business_id: businessId,
          user_id: userId,
          ...financialData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating financial record:', error);
    return { data: null, error: error.message };
  }
}

export async function getFinancialRecords(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_financial_records')
      .select('*')
      .eq('business_id', businessId)
      .order('fiscal_year', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching financial records:', error);
    return { data: null, error: error.message };
  }
}

export async function updateFinancialRecord(recordId, updates) {
  try {
    const { data, error } = await supabase
      .from('rrlc_financial_records')
      .update(updates)
      .eq('id', recordId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating financial record:', error);
    return { data: null, error: error.message };
  }
}

// ==================== EBITDA Add-backs ====================

export async function createEBITDAAddback(financialRecordId, businessId, userId, addbackData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_ebitda_addbacks')
      .insert([
        {
          financial_record_id: financialRecordId,
          business_id: businessId,
          user_id: userId,
          ...addbackData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating EBITDA addback:', error);
    return { data: null, error: error.message };
  }
}

export async function getEBITDAAddbacks(financialRecordId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_ebitda_addbacks')
      .select('*')
      .eq('financial_record_id', financialRecordId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching EBITDA addbacks:', error);
    return { data: null, error: error.message };
  }
}

// ==================== KPI Metrics ====================

export async function createKPIMetric(businessId, userId, metricData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_kpi_metrics')
      .insert([
        {
          business_id: businessId,
          user_id: userId,
          ...metricData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating KPI metric:', error);
    return { data: null, error: error.message };
  }
}

export async function getKPIMetrics(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_kpi_metrics')
      .select('*')
      .eq('business_id', businessId)
      .order('measurement_date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching KPI metrics:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Contracts ====================

export async function createContract(businessId, userId, contractData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_contracts')
      .insert([
        {
          business_id: businessId,
          user_id: userId,
          ...contractData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating contract:', error);
    return { data: null, error: error.message };
  }
}

export async function getContracts(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_contracts')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return { data: null, error: error.message };
  }
}

export async function updateContract(contractId, updates) {
  try {
    const { data, error } = await supabase
      .from('rrlc_contracts')
      .update(updates)
      .eq('id', contractId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating contract:', error);
    return { data: null, error: error.message };
  }
}

// ==================== RFIs ====================

export async function createRFI(businessId, userId, rfiData) {
  try {
    const { data, error } = await supabase
      .from('rrlc_rfis')
      .insert([
        {
          business_id: businessId,
          user_id: userId,
          ...rfiData
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating RFI:', error);
    return { data: null, error: error.message };
  }
}

export async function getRFIs(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_rfis')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching RFIs:', error);
    return { data: null, error: error.message };
  }
}

export async function updateRFI(rfiId, updates) {
  try {
    const { data, error } = await supabase
      .from('rrlc_rfis')
      .update(updates)
      .eq('id', rfiId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating RFI:', error);
    return { data: null, error: error.message };
  }
}

// ==================== Working Capital ====================

export async function createWorkingCapitalRecord(businessId, userId, wcData) {
  try {
    // Calculate derived fields
    const totalCurrentAssets =
      (wcData.cash || 0) +
      (wcData.accounts_receivable || 0) +
      (wcData.inventory || 0) +
      (wcData.prepaid_expenses || 0) +
      (wcData.other_current_assets || 0);

    const totalCurrentLiabilities =
      (wcData.accounts_payable || 0) +
      (wcData.accrued_expenses || 0) +
      (wcData.deferred_revenue || 0) +
      (wcData.current_portion_debt || 0) +
      (wcData.other_current_liabilities || 0);

    const workingCapital = totalCurrentAssets - totalCurrentLiabilities;
    const workingCapitalPercentage = totalCurrentAssets > 0
      ? (workingCapital / totalCurrentAssets) * 100
      : 0;

    const { data, error } = await supabase
      .from('rrlc_working_capital_records')
      .insert([
        {
          business_id: businessId,
          user_id: userId,
          ...wcData,
          total_current_assets: totalCurrentAssets,
          total_current_liabilities: totalCurrentLiabilities,
          working_capital: workingCapital,
          working_capital_percentage: workingCapitalPercentage
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating working capital record:', error);
    return { data: null, error: error.message };
  }
}

export async function getWorkingCapitalRecords(businessId) {
  try {
    const { data, error } = await supabase
      .from('rrlc_working_capital_records')
      .select('*')
      .eq('business_id', businessId)
      .order('calculation_date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching working capital records:', error);
    return { data: null, error: error.message };
  }
}

// ==================== File Upload (Supabase Storage) ====================

export async function uploadFileToStorage(file, businessId, folderId) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}/${folderId}/${Date.now()}_${file.name}`;
    const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'data-room-documents';

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      data: {
        path: data.path,
        url: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      },
      error: null
    };
  } catch (error) {
    console.error('Error uploading file to storage:', error);
    return { data: null, error: error.message };
  }
}

export async function deleteFileFromStorage(filePath) {
  try {
    const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'data-room-documents';

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    return { error: error.message };
  }
}

// ==================== Data Room Statistics ====================

export async function getDataRoomStatistics(businessId) {
  try {
    // Get all folders with their completion status
    const { data: folders, error: foldersError } = await supabase
      .from('rrlc_data_room_folders')
      .select('*')
      .eq('business_id', businessId)
      .order('folder_number', { ascending: true });

    if (foldersError) throw foldersError;

    // Calculate overall statistics
    const totalFolders = folders?.length || 0;
    const completedFolders = folders?.filter(f => f.is_complete)?.length || 0;
    const totalDocuments = folders?.reduce((sum, f) => sum + (f.document_count || 0), 0) || 0;
    const overallCompletion = totalFolders > 0
      ? Math.round((completedFolders / totalFolders) * 100)
      : 0;

    return {
      data: {
        totalFolders,
        completedFolders,
        totalDocuments,
        overallCompletion,
        folders
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching data room statistics:', error);
    return { data: null, error: error.message };
  }
}

