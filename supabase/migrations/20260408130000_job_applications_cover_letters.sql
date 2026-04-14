-- Migration: Extend job_applications and cover_letters tables
-- This migration adds EXTRA columns missing from the 20260408120000 version
-- Uses IF NOT EXISTS / DO NOTHING everywhere to be safe and idempotent

-- Extra columns on job_applications not in 120000 version
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS role        TEXT NOT NULL DEFAULT '';
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS applied_date DATE;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS job_url     TEXT;

-- Extra index on status
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
-- Alias index names
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);

-- Extra column on cover_letters
ALTER TABLE public.cover_letters ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '';

-- Extra index alias
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);

-- Extra cover_letters RLS policies (granular per-operation)
DROP POLICY IF EXISTS "Users can view own letters" ON public.cover_letters;
CREATE POLICY "Users can view own letters"
  ON public.cover_letters FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own letters" ON public.cover_letters;
CREATE POLICY "Users can insert own letters"
  ON public.cover_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own letters" ON public.cover_letters;
CREATE POLICY "Users can update own letters"
  ON public.cover_letters FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own letters" ON public.cover_letters;
CREATE POLICY "Users can delete own letters"
  ON public.cover_letters FOR DELETE
  USING (auth.uid() = user_id);

-- Extra job_applications RLS policies
DROP POLICY IF EXISTS "Users can view own applications" ON public.job_applications;
CREATE POLICY "Users can view own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own applications" ON public.job_applications;
CREATE POLICY "Users can insert own applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own applications" ON public.job_applications;
CREATE POLICY "Users can update own applications"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own applications" ON public.job_applications;
CREATE POLICY "Users can delete own applications"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = user_id);
