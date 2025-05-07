/*
  # Reset and recreate profiles table with proper CASCADE handling
  
  1. Changes
    - Drop dependent objects first
    - Recreate profiles table
    - Restore policies and triggers
    - Recreate dependent objects
    
  2. Security
    - Maintain RLS policies
    - Preserve admin access control
*/

-- Drop dependent objects first
DROP POLICY IF EXISTS "Admins can upload scholarship images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all scholarships" ON public.scholarships;
ALTER TABLE IF EXISTS public.scholarships DROP CONSTRAINT IF EXISTS scholarships_author_id_fkey;

-- Now drop the profiles table
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
      ELSE false
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate foreign key constraint on scholarships table
ALTER TABLE IF EXISTS public.scholarships 
  ADD CONSTRAINT scholarships_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Recreate policies that depend on profiles
CREATE POLICY "Admins can manage all scholarships"
  ON public.scholarships
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can upload scholarship images"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'scholarship-images' AND
    (
      SELECT is_admin FROM public.profiles
      WHERE id = auth.uid()
    )
  );