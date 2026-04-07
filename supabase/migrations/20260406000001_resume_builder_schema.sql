-- ═══════════════════════════════════════════════════════════════
-- Resume Builder — Production Schema Migration
-- Project: mtfxwyezotzrzzsyhoay (HireWithPrachi)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. profiles (user accounts & plan) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT,
  avatar_url            TEXT,
  plan                  TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro')),
  razorpay_payment_id   TEXT,
  pro_activated_at      TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ── Auto-create profile on new user signup ───────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. resumes ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resumes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'My Resume',
  template_id TEXT NOT NULL DEFAULT 'ats-classic',
  resume_data JSONB NOT NULL DEFAULT '{}',
  settings    JSONB NOT NULL DEFAULT '{}',
  ats_score   INTEGER DEFAULT 0,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own resumes" ON public.resumes;

CREATE POLICY "Users own resumes"
  ON public.resumes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public resumes are viewable by anyone"
  ON public.resumes FOR SELECT
  USING (is_public = true);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS resumes_updated_at_idx ON public.resumes(updated_at DESC);

-- ── 3. payments (Razorpay receipts) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_order_id  TEXT,
  razorpay_payment_id TEXT UNIQUE,
  amount             INTEGER NOT NULL DEFAULT 49900, -- paise (₹499)
  currency           TEXT NOT NULL DEFAULT 'INR',
  status             TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid','failed')),
  plan               TEXT NOT NULL DEFAULT 'pro',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- ── 4. Update timestamps trigger ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_resumes_updated_at ON public.resumes;
CREATE TRIGGER set_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
