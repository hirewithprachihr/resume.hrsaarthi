-- Admin tables for HR Saarthi platform management
-- Idempotent version — safe to run multiple times

-- ── Admin roles table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role       TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','super_admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed the admin user
INSERT INTO public.admin_roles (user_id, role)
VALUES ('7d7d97a2-ac96-4564-ba40-6668c74d46ad', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;

-- ── Discount / Offer Codes ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT NOT NULL UNIQUE,
  description  TEXT,
  discount_pct INTEGER NOT NULL DEFAULT 10 CHECK (discount_pct >= 0 AND discount_pct <= 100),
  valid_from   TIMESTAMPTZ DEFAULT now(),
  valid_until  TIMESTAMPTZ,
  max_uses     INTEGER DEFAULT NULL,
  uses_count   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  created_by   UUID REFERENCES auth.users(id)
);

-- ── Platform settings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Default platform settings
INSERT INTO public.platform_settings (key, value) VALUES
  ('site_name',          '"HR Saarthi"'),
  ('tagline',            '"Build Resumes That Actually Get Interviews"'),
  ('support_email',      '"hello@hrsaarthi.com"'),
  ('razorpay_live_mode', 'true'),
  ('ai_enabled',         'true'),
  ('free_template_limit','3'),
  ('plans', '[
    {"id":"monthly","name":"Elite Pro Monthly","price":299,"currency":"INR","interval":"month"},
    {"id":"annual","name":"Elite Pro Annual","price":1999,"currency":"INR","interval":"year"}
  ]')
ON CONFLICT (key) DO NOTHING;

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.admin_roles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin_roles (idempotent)
DROP POLICY IF EXISTS "Admins read admin_roles" ON public.admin_roles;
CREATE POLICY "Admins read admin_roles" ON public.admin_roles
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.admin_roles));

-- Only admins manage discounts
DROP POLICY IF EXISTS "Admins manage discounts" ON public.discount_codes;
CREATE POLICY "Admins manage discounts" ON public.discount_codes
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_roles));

-- Only admins manage settings
DROP POLICY IF EXISTS "Admins manage settings" ON public.platform_settings;
CREATE POLICY "Admins manage settings" ON public.platform_settings
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_roles));

-- ── Admin view of all users (via profiles) ────────────────────
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_roles)
    OR auth.uid() = id
  );

-- ── Admin view of all resumes ─────────────────────────────────
DROP POLICY IF EXISTS "Admins read all resumes" ON public.resumes;
CREATE POLICY "Admins read all resumes" ON public.resumes
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.admin_roles)
    OR auth.uid() = user_id
  );
