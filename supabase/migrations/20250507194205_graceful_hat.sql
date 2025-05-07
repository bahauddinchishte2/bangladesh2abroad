-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;

-- Create base policy for all users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND NOT is_admin);

-- Create admin policy using email check instead of recursive profile check
CREATE POLICY "Admins have full access"
  ON public.profiles
  FOR ALL
  USING (
    auth.jwt() ->> 'email' IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com')
  );

-- Update dependent policies to use the same email-based admin check
DROP POLICY IF EXISTS "Admins can manage all scholarships" ON public.scholarships;
CREATE POLICY "Admins can manage all scholarships"
  ON public.scholarships
  FOR ALL
  USING (
    auth.jwt() ->> 'email' IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com')
  );

DROP POLICY IF EXISTS "Admins can upload scholarship images" ON storage.objects;
CREATE POLICY "Admins can upload scholarship images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'scholarship-images' AND
    auth.jwt() ->> 'email' IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com')
  );