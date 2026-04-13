-- Fix potential RLS recursion on profiles and resumes tables
-- This ensures that users can always access their own data without complex subqueries

-- 1. Profiles: Simple UID check
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2. Resumes: Simple UID check
DROP POLICY IF EXISTS "Users can manage own resumes" ON public.resumes;
CREATE POLICY "Users can manage own resumes" 
ON public.resumes FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Public access: Allow anyone to view a resume if it is marked as public
DROP POLICY IF EXISTS "Anyone can view public resumes" ON public.resumes;
CREATE POLICY "Anyone can view public resumes" 
ON public.resumes FOR SELECT 
USING (is_public = true);

-- 4. Re-apply Admin overrides using the SAFE is_admin() function to avoid recursion
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT USING (
  public.is_admin()
);

DROP POLICY IF EXISTS "Admins read all resumes" ON public.resumes;
CREATE POLICY "Admins read all resumes" ON public.resumes FOR SELECT USING (
  public.is_admin()
);
