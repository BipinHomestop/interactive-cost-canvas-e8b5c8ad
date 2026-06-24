
-- 1. Remove dangerous first-admin bootstrap policy on admin_users
DROP POLICY IF EXISTS "Allow first admin creation" ON public.admin_users;

-- 2. Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated.
--    is_admin_user() is intentionally left executable because it is used by RLS policies.
REVOKE EXECUTE ON FUNCTION public.has_admin_users() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_security_event(text, uuid, text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_discount_code(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_public_url() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_admin_users() TO service_role;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, uuid, text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.validate_discount_code(text) TO service_role;

-- 3. Storage: restrict uploads to admins only
DROP POLICY IF EXISTS "Allow Calculator Images Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to garage-images" ON storage.objects;

CREATE POLICY "Admins can upload calculator images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'calculator-images' AND public.is_admin_user());

CREATE POLICY "Admins can upload garage images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'garage-images' AND public.is_admin_user());

-- 4. Storage: remove broad public SELECT policies that enable listing.
--    Files in public buckets are still reachable via their public URL even
--    without a SELECT policy on storage.objects.
DROP POLICY IF EXISTS "Give public access to garage-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
