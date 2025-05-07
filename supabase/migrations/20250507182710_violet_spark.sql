/*
  # Add Existing Users to Profiles
  
  1. Changes
    - Insert existing auth.users into profiles table
    - Set admin status for specific email addresses
    - Handle conflicts to avoid duplicate entries
  
  2. Security
    - Only affects profiles table
    - Preserves existing admin status on conflicts
*/

-- Insert existing users into profiles table
DO $$ 
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  SELECT 
    au.id,
    au.email,
    CASE 
      WHEN au.email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
      ELSE false 
    END as is_admin
  FROM auth.users au
  ON CONFLICT (id) DO UPDATE
  SET is_admin = 
    CASE 
      WHEN au.email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
      ELSE profiles.is_admin
    END;
END $$;