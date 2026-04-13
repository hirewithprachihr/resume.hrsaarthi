# Database Migrations

This directory contains SQL migration files for the Supabase database.

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have Supabase CLI installed and linked to your project:

```bash
# Apply all pending migrations
supabase db push

# Or reset the database and apply all migrations
supabase db reset
```

### Option 2: Using Supabase Dashboard (Manual)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file you want to run
4. Copy the SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute

### Option 3: Using Local Development

If running Supabase locally:

```bash
# Start local Supabase
supabase start

# Migrations are automatically applied on start
```

## Migration Files

Migrations are named with timestamps to ensure proper ordering:

- `20260408130000_job_applications_cover_letters.sql` - Creates job_applications and cover_letters tables with RLS policies

## Testing Migrations

After applying a migration, verify it worked:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('job_applications', 'cover_letters');

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('job_applications', 'cover_letters');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('job_applications', 'cover_letters');
```

## Rollback

If you need to rollback a migration, create a new migration file that reverses the changes:

```sql
-- Example rollback for job_applications_cover_letters
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS cover_letters CASCADE;
```
