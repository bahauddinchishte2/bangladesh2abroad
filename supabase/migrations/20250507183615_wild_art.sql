/*
  # Simple Admin Setup
  
  1. New Tables
    - `profiles` table with id, email, and is_admin columns
  
  2. Security
    - Enable RLS
    - Add policies for profile access
    - Create trigger for new user signup
    
  3. Data
    - Handle existing users
*/

-- Create a simple profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_admin boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles" 
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing users
INSERT INTO public.profiles (id, email, is_admin)
SELECT 
  id,
  email,
  CASE 
    WHEN email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
    ELSE false
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET is_admin = EXCLUDED.is_admin;