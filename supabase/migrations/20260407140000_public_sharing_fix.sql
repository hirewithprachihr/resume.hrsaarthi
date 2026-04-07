-- Fix: public sharing requires resumes.is_public (used by SharePage + togglePublic)

ALTER TABLE public.resumes
ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;

-- Index for fast public resume lookups
CREATE INDEX IF NOT EXISTS resumes_is_public_idx ON public.resumes (is_public);

-- Ensure anon/auth users can read public resumes only
DROP POLICY IF EXISTS "Public resumes are viewable by anyone" ON public.resumes;
CREATE POLICY "Public resumes are viewable by anyone"
  ON public.resumes FOR SELECT
  USING (is_public = true);

