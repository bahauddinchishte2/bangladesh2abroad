/*
  # Create storage bucket for images
  
  1. New Storage
    - Creates a public bucket for storing scholarship images
    - Sets up appropriate security policies
  
  2. Security
    - Enable RLS on storage
    - Add policy for public read access
    - Add policy for admin write access
*/

-- Create public storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('scholarship-images', 'scholarship-images', true);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to images
CREATE POLICY "Public can read scholarship images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'scholarship-images');

-- Allow admins to upload/delete images
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