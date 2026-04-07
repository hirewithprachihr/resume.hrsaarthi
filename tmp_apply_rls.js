import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const queries = [
  `CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$ SELECT EXISTS ( SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() ); $$;`,
  `DROP POLICY IF EXISTS "Admins read admin_roles" ON public.admin_roles;`,
  `DROP POLICY IF EXISTS "Admins manage discounts" ON public.discount_codes;`,
  `DROP POLICY IF EXISTS "Admins manage settings" ON public.platform_settings;`,
  `DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;`,
  `DROP POLICY IF EXISTS "Admins read all resumes" ON public.resumes;`,
  `CREATE POLICY "Admins read admin_roles" ON public.admin_roles FOR SELECT USING (public.is_admin());`,
  `CREATE POLICY "Admins manage discounts" ON public.discount_codes FOR ALL USING (public.is_admin());`,
  `CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL USING (public.is_admin());`,
  `CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT USING ( public.is_admin() OR auth.uid() = id );`,
  `CREATE POLICY "Admins read all resumes" ON public.resumes FOR SELECT USING ( public.is_admin() OR auth.uid() = user_id );`
];

for (const q of queries) {
  try {
    console.log('Running:', q.substring(0, 50) + '...');
    const result = execSync(`npx supabase db query "${q.replace(/"/g, '\\"')}" --linked`, { encoding: 'utf-8' });
    console.log('Success.');
  } catch (e) {
    console.error('Failed:', e.message);
  }
}
