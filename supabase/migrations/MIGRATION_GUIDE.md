# Migration Guide: Job Applications & Cover Letters Tables

## Overview

This migration creates two new tables for Phase 2 feature completions:
- `job_applications` - For job tracking Kanban board functionality
- `cover_letters` - For cover letter save/load functionality

## Files Created

1. **20260408130000_job_applications_cover_letters.sql** - Main migration file
2. **verify_migration.sql** - Verification script to test the migration
3. **README.md** - General migration documentation
4. **MIGRATION_GUIDE.md** - This file

## What This Migration Does

### 1. Creates `job_applications` Table

**Columns:**
- `id` (uuid, primary key) - Unique identifier
- `user_id` (uuid, foreign key) - References auth.users, cascades on delete
- `company` (text, required) - Company name
- `role` (text, required) - Job role/title
- `status` (text) - One of: applied, screening, interview, offer, rejected
- `applied_date` (date) - When the application was submitted
- `notes` (text) - User notes about the application
- `resume_id` (uuid) - Optional link to resume used
- `job_url` (text) - Link to job posting
- `created_at` (timestamptz) - Auto-set on creation
- `updated_at` (timestamptz) - Auto-set on creation/update

**Security:**
- Row Level Security (RLS) enabled
- 4 policies: SELECT, INSERT, UPDATE, DELETE (all user-scoped)
- Users can only access their own applications

**Performance:**
- Index on `user_id` for fast user queries
- Index on `status` for Kanban board filtering

### 2. Creates `cover_letters` Table

**Columns:**
- `id` (uuid, primary key) - Unique identifier
- `user_id` (uuid, foreign key) - References auth.users, cascades on delete
- `resume_id` (uuid) - Optional link to resume
- `title` (text, required) - User-defined title for the letter
- `company` (text) - Target company
- `job_title` (text) - Target job title
- `content` (text, required) - The cover letter content
- `tone` (text) - Tone used (professional, friendly, etc.)
- `template_id` (text) - Template used for generation
- `created_at` (timestamptz) - Auto-set on creation
- `updated_at` (timestamptz) - Auto-set on creation/update

**Security:**
- Row Level Security (RLS) enabled
- 4 policies: SELECT, INSERT, UPDATE, DELETE (all user-scoped)
- Users can only access their own cover letters

**Performance:**
- Index on `user_id` for fast user queries

## How to Apply

### Method 1: Supabase Dashboard (Recommended for Production)

1. Log in to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `20260408130000_job_applications_cover_letters.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success message appears

### Method 2: Supabase CLI (Recommended for Development)

```bash
# If you have Supabase CLI installed and linked
supabase db push

# Or to reset and apply all migrations
supabase db reset
```

### Method 3: Local Development

```bash
# Start local Supabase (migrations auto-apply)
supabase start
```

## Verification Steps

After applying the migration, run the verification script:

1. In Supabase SQL Editor, open a new query
2. Copy contents of `verify_migration.sql`
3. Paste and run
4. Check that all tests show "✓ PASS"

Expected results:
- ✓ PASS: Both tables exist
- ✓ PASS: All 10 columns present (job_applications)
- ✓ PASS: All 10 columns present (cover_letters)
- ✓ PASS: RLS enabled on both tables
- ✓ PASS: All 8 policies created (4 per table)
- ✓ PASS: All required indexes created

## Testing the Tables

### Test job_applications

```sql
-- Insert a test application (replace with your user_id)
INSERT INTO job_applications (user_id, company, role, status)
VALUES ('your-user-id-here', 'Test Company', 'Software Engineer', 'applied');

-- Query your applications
SELECT * FROM job_applications WHERE user_id = auth.uid();

-- Update status
UPDATE job_applications 
SET status = 'screening', updated_at = now()
WHERE id = 'your-job-id-here';

-- Delete test data
DELETE FROM job_applications WHERE company = 'Test Company';
```

### Test cover_letters

```sql
-- Insert a test cover letter (replace with your user_id)
INSERT INTO cover_letters (user_id, title, company, content)
VALUES ('your-user-id-here', 'Test Letter', 'Test Company', 'This is a test cover letter.');

-- Query your letters
SELECT * FROM cover_letters WHERE user_id = auth.uid();

-- Update content
UPDATE cover_letters 
SET content = 'Updated content', updated_at = now()
WHERE id = 'your-letter-id-here';

-- Delete test data
DELETE FROM cover_letters WHERE title = 'Test Letter';
```

## RLS Policy Details

### job_applications Policies

1. **"Users can view own applications"** (SELECT)
   - Allows users to view only their own job applications
   - Uses: `auth.uid() = user_id`

2. **"Users can insert own applications"** (INSERT)
   - Allows users to create job applications for themselves
   - Uses: `auth.uid() = user_id`

3. **"Users can update own applications"** (UPDATE)
   - Allows users to update only their own job applications
   - Uses: `auth.uid() = user_id`

4. **"Users can delete own applications"** (DELETE)
   - Allows users to delete only their own job applications
   - Uses: `auth.uid() = user_id`

### cover_letters Policies

1. **"Users can view own letters"** (SELECT)
   - Allows users to view only their own cover letters
   - Uses: `auth.uid() = user_id`

2. **"Users can insert own letters"** (INSERT)
   - Allows users to create cover letters for themselves
   - Uses: `auth.uid() = user_id`

3. **"Users can update own letters"** (UPDATE)
   - Allows users to update only their own cover letters
   - Uses: `auth.uid() = user_id`

4. **"Users can delete own letters"** (DELETE)
   - Allows users to delete only their own cover letters
   - Uses: `auth.uid() = user_id`

## Rollback Instructions

If you need to rollback this migration:

```sql
-- Drop tables (CASCADE will remove foreign key constraints)
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS cover_letters CASCADE;

-- Note: Indexes and policies are automatically dropped with the tables
```

## Next Steps

After successfully applying this migration:

1. ✅ Task 1 Complete: Database tables created
2. ➡️ Task 2: Implement Job Applications API Functions in `src/services/supabase.js`
3. ➡️ Task 3: Build Job Tracker Kanban Board UI in `src/pages/DashboardPage.jsx`

## Troubleshooting

### Error: "relation already exists"

The tables already exist. Either:
- Skip this migration (already applied)
- Drop the existing tables first (see Rollback Instructions)

### Error: "permission denied"

You don't have sufficient permissions. Ensure you're:
- Logged in as the project owner
- Using the correct Supabase project
- Have database admin privileges

### Error: "auth.users does not exist"

The auth schema is not set up. This shouldn't happen in a standard Supabase project. Contact Supabase support.

### RLS Policies Not Working

Check that:
1. RLS is enabled: `SELECT rowsecurity FROM pg_tables WHERE tablename = 'job_applications';`
2. Policies exist: `SELECT * FROM pg_policies WHERE tablename = 'job_applications';`
3. User is authenticated: `SELECT auth.uid();` should return a UUID, not NULL

## Support

For issues with this migration:
1. Check the verification script output
2. Review the troubleshooting section
3. Check Supabase logs in the dashboard
4. Refer to the Phase 2 design document: `.kiro/specs/phase-2-feature-completions/design.md`
