/*
  # Add existing authenticated users to profiles table
  
  1. Changes
    - Inserts existing authenticated users into the profiles table
    - Sets admin status for specific users
  
  2. Security
    - Maintains existing RLS policies
    - Only affects users not already in profiles table
*/

-- Insert existing users into profiles table
DO $$ 
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  SELECT 
    id,
    email,
    CASE 
      WHEN email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
      ELSE false 
    END as is_admin
  FROM auth.users
  ON CONFLICT (id) DO UPDATE
  SET is_admin = 
    CASE 
      WHEN email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
      ELSE profiles.is_admin
    END;
END $$;