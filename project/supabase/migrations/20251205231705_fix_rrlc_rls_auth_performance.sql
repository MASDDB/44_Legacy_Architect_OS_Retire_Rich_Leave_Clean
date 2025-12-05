/*
  # Fix RLS Auth Initialization Pattern for RRLC Tables
  
  This migration updates all remaining RLS policies on RRLC tables to use the optimized 
  (select auth.uid()) pattern instead of direct auth.uid() calls. This prevents 
  re-evaluation of auth functions for each row, dramatically improving query performance at scale.
  
  ## Tables Updated
  
  1. rrlc_contracts (5 policies)
  2. rrlc_rfis (5 policies)
  3. rrlc_data_room_folders (5 policies)
  4. rrlc_documents (5 policies)
  5. rrlc_financial_records (5 policies)
  6. rrlc_ebitda_addbacks (5 policies)
  7. rrlc_kpi_metrics (5 policies)
  8. rrlc_assessment_submissions (4 policies)
  9. rrlc_businesses (5 policies)
  10. rrlc_working_capital_records (5 policies)
  
  ## Performance Impact
  - Eliminates redundant auth function calls per row
  - Significantly improves query performance on large datasets
  - Reduces database CPU usage for authenticated queries
*/

-- ============================================
-- RRLC Contracts Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own contracts" ON public.rrlc_contracts;
CREATE POLICY "Users can view own contracts"
  ON public.rrlc_contracts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own contracts" ON public.rrlc_contracts;
CREATE POLICY "Users can insert own contracts"
  ON public.rrlc_contracts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own contracts" ON public.rrlc_contracts;
CREATE POLICY "Users can update own contracts"
  ON public.rrlc_contracts
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own contracts" ON public.rrlc_contracts;
CREATE POLICY "Users can delete own contracts"
  ON public.rrlc_contracts
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC RFIs Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own RFIs" ON public.rrlc_rfis;
CREATE POLICY "Users can view own RFIs"
  ON public.rrlc_rfis
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own RFIs" ON public.rrlc_rfis;
CREATE POLICY "Users can insert own RFIs"
  ON public.rrlc_rfis
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own RFIs" ON public.rrlc_rfis;
CREATE POLICY "Users can update own RFIs"
  ON public.rrlc_rfis
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own RFIs" ON public.rrlc_rfis;
CREATE POLICY "Users can delete own RFIs"
  ON public.rrlc_rfis
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC Data Room Folders Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own folders" ON public.rrlc_data_room_folders;
CREATE POLICY "Users can view own folders"
  ON public.rrlc_data_room_folders
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own folders" ON public.rrlc_data_room_folders;
CREATE POLICY "Users can insert own folders"
  ON public.rrlc_data_room_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own folders" ON public.rrlc_data_room_folders;
CREATE POLICY "Users can update own folders"
  ON public.rrlc_data_room_folders
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own folders" ON public.rrlc_data_room_folders;
CREATE POLICY "Users can delete own folders"
  ON public.rrlc_data_room_folders
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC Documents Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own documents" ON public.rrlc_documents;
CREATE POLICY "Users can view own documents"
  ON public.rrlc_documents
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own documents" ON public.rrlc_documents;
CREATE POLICY "Users can insert own documents"
  ON public.rrlc_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own documents" ON public.rrlc_documents;
CREATE POLICY "Users can update own documents"
  ON public.rrlc_documents
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own documents" ON public.rrlc_documents;
CREATE POLICY "Users can delete own documents"
  ON public.rrlc_documents
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC Financial Records Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own financial records" ON public.rrlc_financial_records;
CREATE POLICY "Users can view own financial records"
  ON public.rrlc_financial_records
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own financial records" ON public.rrlc_financial_records;
CREATE POLICY "Users can insert own financial records"
  ON public.rrlc_financial_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own financial records" ON public.rrlc_financial_records;
CREATE POLICY "Users can update own financial records"
  ON public.rrlc_financial_records
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own financial records" ON public.rrlc_financial_records;
CREATE POLICY "Users can delete own financial records"
  ON public.rrlc_financial_records
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC EBITDA Addbacks Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own addbacks" ON public.rrlc_ebitda_addbacks;
CREATE POLICY "Users can view own addbacks"
  ON public.rrlc_ebitda_addbacks
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own addbacks" ON public.rrlc_ebitda_addbacks;
CREATE POLICY "Users can insert own addbacks"
  ON public.rrlc_ebitda_addbacks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own addbacks" ON public.rrlc_ebitda_addbacks;
CREATE POLICY "Users can update own addbacks"
  ON public.rrlc_ebitda_addbacks
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own addbacks" ON public.rrlc_ebitda_addbacks;
CREATE POLICY "Users can delete own addbacks"
  ON public.rrlc_ebitda_addbacks
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC KPI Metrics Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own KPI metrics" ON public.rrlc_kpi_metrics;
CREATE POLICY "Users can view own KPI metrics"
  ON public.rrlc_kpi_metrics
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own KPI metrics" ON public.rrlc_kpi_metrics;
CREATE POLICY "Users can insert own KPI metrics"
  ON public.rrlc_kpi_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own KPI metrics" ON public.rrlc_kpi_metrics;
CREATE POLICY "Users can update own KPI metrics"
  ON public.rrlc_kpi_metrics
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own KPI metrics" ON public.rrlc_kpi_metrics;
CREATE POLICY "Users can delete own KPI metrics"
  ON public.rrlc_kpi_metrics
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC Assessment Submissions Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own assessments" ON public.rrlc_assessment_submissions;
CREATE POLICY "Users can view own assessments"
  ON public.rrlc_assessment_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own assessments" ON public.rrlc_assessment_submissions;
CREATE POLICY "Users can insert own assessments"
  ON public.rrlc_assessment_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own assessments" ON public.rrlc_assessment_submissions;
CREATE POLICY "Users can update own assessments"
  ON public.rrlc_assessment_submissions
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- RRLC Businesses Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own businesses" ON public.rrlc_businesses;
CREATE POLICY "Users can view own businesses"
  ON public.rrlc_businesses
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own businesses" ON public.rrlc_businesses;
CREATE POLICY "Users can insert own businesses"
  ON public.rrlc_businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own businesses" ON public.rrlc_businesses;
CREATE POLICY "Users can update own businesses"
  ON public.rrlc_businesses
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own businesses" ON public.rrlc_businesses;
CREATE POLICY "Users can delete own businesses"
  ON public.rrlc_businesses
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- RRLC Working Capital Records Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own working capital records" ON public.rrlc_working_capital_records;
CREATE POLICY "Users can view own working capital records"
  ON public.rrlc_working_capital_records
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own working capital records" ON public.rrlc_working_capital_records;
CREATE POLICY "Users can insert own working capital records"
  ON public.rrlc_working_capital_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own working capital records" ON public.rrlc_working_capital_records;
CREATE POLICY "Users can update own working capital records"
  ON public.rrlc_working_capital_records
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own working capital records" ON public.rrlc_working_capital_records;
CREATE POLICY "Users can delete own working capital records"
  ON public.rrlc_working_capital_records
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
