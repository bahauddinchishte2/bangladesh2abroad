/*
  # Create scholarships table and related functionality

  1. New Tables
    - `scholarships`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `country` (text)
      - `deadline` (date)
      - `funding_type` (text)
      - `host_institution` (text)
      - `level_of_study` (text)
      - `official_link` (text)
      - `category` (text)
      - `tags` (text[])
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `author_id` (uuid, references profiles)

  2. Security
    - Enable RLS on `scholarships` table
    - Add policy for public to view published scholarships
    - Add policy for admins to manage all scholarships

  3. Functions & Triggers
    - Add function to update updated_at timestamp
    - Add trigger to automatically update updated_at on changes
*/

-- Create scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  country text NOT NULL,
  deadline date NOT NULL,
  funding_type text NOT NULL,
  host_institution text NOT NULL,
  level_of_study text NOT NULL,
  official_link text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published scholarships"
  ON public.scholarships
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage all scholarships"
  ON public.scholarships
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_scholarships_updated_at
  BEFORE UPDATE ON public.scholarships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();