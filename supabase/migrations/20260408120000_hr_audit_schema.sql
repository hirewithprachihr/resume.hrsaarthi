-- HR audit: JD on resumes, job applications, cover letters (persisted)

-- ── Job description text (per resume, for dashboard badges & sync) ──
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_description TEXT DEFAULT '';

COMMENT ON COLUMN public.resumes.job_description IS 'Optional pasted job description for tailoring; synced from client.';

-- ── Job applications (candidate job search tracker) ──
CREATE TABLE IF NOT EXISTS public.job_applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id   UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  company     TEXT NOT NULL DEFAULT '',
  role_title  TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'wishlist'
    CHECK (status IN ('wishlist','applied','interview','offer','rejected','closed')),
  applied_at  TIMESTAMPTZ,
  notes       TEXT,
  jd_text     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_applications_user_id_idx ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS job_applications_resume_id_idx ON public.job_applications(resume_id);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own applications" ON public.job_applications;
CREATE POLICY "Users manage own applications"
  ON public.job_applications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins read all applications" ON public.job_applications;
CREATE POLICY "Admins read all applications"
  ON public.job_applications FOR SELECT
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.set_job_applications_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER set_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_job_applications_updated_at();

-- ── Cover letters (versioned saves) ──
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id   UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  title       TEXT NOT NULL DEFAULT 'Cover letter',
  body        TEXT NOT NULL DEFAULT '',
  tone        TEXT DEFAULT 'formal',
  template_id TEXT DEFAULT 'modern',
  company     TEXT,
  job_title   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cover_letters_user_id_idx ON public.cover_letters(user_id);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own cover letters" ON public.cover_letters;
CREATE POLICY "Users manage own cover letters"
  ON public.cover_letters FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins read all cover letters" ON public.cover_letters;
CREATE POLICY "Admins read all cover letters"
  ON public.cover_letters FOR SELECT
  USING (public.is_admin());

DROP TRIGGER IF EXISTS set_cover_letters_updated_at ON public.cover_letters;
CREATE TRIGGER set_cover_letters_updated_at
  BEFORE UPDATE ON public.cover_letters
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
