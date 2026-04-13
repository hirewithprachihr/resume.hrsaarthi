-- Verification script for job_applications and cover_letters migration
-- Run this after applying the migration to verify everything is set up correctly

-- ============================================================================
-- Check if tables exist
-- ============================================================================

SELECT 
  'Tables Check' as test_category,
  CASE 
    WHEN COUNT(*) = 2 THEN '✓ PASS: Both tables exist'
    ELSE '✗ FAIL: Missing tables'
  END as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('job_applications', 'cover_letters');

-- ============================================================================
-- Check job_applications columns
-- ============================================================================

SELECT 
  'job_applications Columns' as test_category,
  CASE 
    WHEN COUNT(*) = 10 THEN '✓ PASS: All 10 columns present'
    ELSE '✗ FAIL: Expected 10 columns, found ' || COUNT(*)
  END as result
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'job_applications';

-- ============================================================================
-- Check cover_letters columns
-- ============================================================================

SELECT 
  'cover_letters Columns' as test_category,
  CASE 
    WHEN COUNT(*) = 10 THEN '✓ PASS: All 10 columns present'
    ELSE '✗ FAIL: Expected 10 columns, found ' || COUNT(*)
  END as result
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cover_letters';

-- ============================================================================
-- Check RLS is enabled
-- ============================================================================

SELECT 
  'RLS Enabled' as test_category,
  CASE 
    WHEN COUNT(*) = 2 THEN '✓ PASS: RLS enabled on both tables'
    ELSE '✗ FAIL: RLS not enabled on all tables'
  END as result
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('job_applications', 'cover_letters')
AND rowsecurity = true;

-- ============================================================================
-- Check RLS policies
-- ============================================================================

SELECT 
  'RLS Policies' as test_category,
  CASE 
    WHEN COUNT(*) = 8 THEN '✓ PASS: All 8 policies created (4 per table)'
    ELSE '✗ FAIL: Expected 8 policies, found ' || COUNT(*)
  END as result
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('job_applications', 'cover_letters');

-- ============================================================================
-- Check indexes
-- ============================================================================

SELECT 
  'Indexes' as test_category,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✓ PASS: All required indexes created'
    ELSE '✗ FAIL: Missing indexes'
  END as result
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('job_applications', 'cover_letters')
AND indexname LIKE 'idx_%';

-- ============================================================================
-- Detailed view of all policies (for reference)
-- ============================================================================

SELECT 
  tablename,
  policyname,
  cmd as operation,
  qual as using_clause,
  with_check as with_check_clause
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('job_applications', 'cover_letters')
ORDER BY tablename, policyname;

-- ============================================================================
-- Detailed view of all indexes (for reference)
-- ============================================================================

SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('job_applications', 'cover_letters')
ORDER BY tablename, indexname;
