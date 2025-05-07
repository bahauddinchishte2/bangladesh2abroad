/*
  # Add Admin Profile

  1. Changes
    - Inserts admin profile for existing authenticated user
    - Sets admin privileges for the user

  2. Security
    - Only affects specified user
    - Maintains RLS policies
*/

-- Get the user's ID and email from auth.users and create their profile
DO $$ 
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  SELECT 
    id,
    email,
    true  -- Set as admin
  FROM auth.users
  WHERE email = 'your.email@example.com'  -- Replace with your email
  ON CONFLICT (id) DO UPDATE
  SET is_admin = true;
END $$;