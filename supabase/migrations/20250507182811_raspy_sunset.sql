/*
  # Insert existing users into profiles table
  
  1. Changes
    - Insert existing auth.users into profiles table
    - Set admin status for specific email addresses
    - Handle conflicts by updating admin status
*/

DO $$ 
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  SELECT 
    users.id,
    users.email,
    CASE 
      WHEN users.email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
      ELSE false 
    END as is_admin
  FROM auth.users
  ON CONFLICT (id) DO UPDATE
  SET is_admin = EXCLUDED.is_admin;
END $$;