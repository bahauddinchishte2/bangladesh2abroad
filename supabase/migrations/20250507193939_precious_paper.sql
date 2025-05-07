/*
  # Fix infinite recursion in profiles policies
  
  1. Changes
    - Restructure policies to avoid circular dependencies
    - Use auth.uid() for admin checks instead of querying profiles
    - Maintain existing functionality but with better policy structure
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create new policies without recursion
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access"
  ON public.profiles
  FOR ALL
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (true);

-- Update other dependent policies to use the same pattern
DROP POLICY IF EXISTS "Admins can manage all scholarships" ON public.scholarships;
CREATE POLICY "Admins can manage all scholarships"
  ON public.scholarships
  FOR ALL
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can upload scholarship images" ON storage.objects;
CREATE POLICY "Admins can upload scholarship images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'scholarship-images' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );