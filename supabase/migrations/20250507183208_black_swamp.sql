/*
  # Update Admin Status Migration
  
  1. Changes
     - Updates admin status for specific users in profiles table
     - Adds trigger to automatically set admin status for new users
  
  2. Security
     - Function runs with security definer
     - Only affects specific email addresses
*/

-- Update existing users' admin status
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

-- Create function to automatically set admin status for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_status()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET is_admin = CASE 
    WHEN NEW.email IN ('bahauddinchishte@gmail.com', 'baha7uddin@gmail.com') THEN true
    ELSE false
  END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run after profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created_set_admin
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_admin_status();