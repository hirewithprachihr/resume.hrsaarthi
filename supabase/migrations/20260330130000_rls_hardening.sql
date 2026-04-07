-- ============================================================
-- RLS Policy Hardening Migration
-- Migration: 20260330_rls_hardening
-- ============================================================

-- ── Drop and recreate all policies cleanly ──────────────────

-- PROFILES: explicit per-operation policies
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Read: only own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Insert: only own row, only when authenticated
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update: only own profile, cannot change id
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No DELETE on profiles (only CASCADE from auth.users handles that)

-- RESUMES: explicit per-operation policies
DROP POLICY IF EXISTS "Users can select own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can insert own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;
-- Drop old catch-all if it exists
DROP POLICY IF EXISTS "Users can manage own resumes" ON public.resumes;

-- Read: only own resumes
CREATE POLICY "resumes_select_own"
  ON public.resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert: user_id must match authenticated user — prevents spoofed inserts
CREATE POLICY "resumes_insert_own"
  ON public.resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update: only own resumes, cannot hijack by changing user_id
CREATE POLICY "resumes_update_own"
  ON public.resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: only own resumes
CREATE POLICY "resumes_delete_own"
  ON public.resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── Anon user: explicit DENY (belt-and-suspenders) ──────────
-- By default RLS blocks anon if no matching policy exists,
-- but we add explicit denials for clarity.
-- (These policies have FALSE conditions so they never allow.)

-- Service-role can bypass RLS for admin operations — that's expected.
-- Ensure we're NOT granting anon any access.
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.resumes   FROM anon;

-- Keep authenticated role access
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;

-- ── Edge function service role access ────────────────────────
-- The parse-resume edge function uses the service role to write
-- to resumes table (no RLS bypass needed — it uses user JWT)
-- No extra grants needed.
