-- Drop any existing recursive policies on admin_roles
DROP POLICY IF EXISTS "Admins read admin_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Users can read own admin role" ON public.admin_roles;

-- Simplify: Anyone can check if THEY are an admin.
-- We do NOT need is_admin() here because this is the base table!
CREATE POLICY "Users can read own admin role" 
ON public.admin_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- If an admin needs to see *all* admins, we use a distinct rule that doesn't rely on querying the exact same table using is_admin().
-- But since the front-end only does `.eq('user_id', userId)`, the above policy is perfectly sufficient for 100% of current client-side use cases.
