-- Fix infinite recursion in admin_users RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new RLS policies using the security definer function
CREATE POLICY "Admins can manage admin_users" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin_user());

-- Allow the first admin user to be created when no admins exist
CREATE POLICY "Allow first admin creation" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (
  NOT EXISTS (SELECT 1 FROM public.admin_users WHERE is_active = true)
);

-- Create a function to check if any admin users exist
CREATE OR REPLACE FUNCTION public.has_admin_users()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE is_active = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;