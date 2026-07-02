-- ==============================================================
-- Supabase Schema for Birthday Gallery
-- Run this in your Supabase SQL Editor before using the site.
-- ==============================================================

-- 1. Create the photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (recommended)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon key)
CREATE POLICY "Allow public read access"
  ON photos FOR SELECT
  TO anon
  USING (true);

-- Allow public insert access (anon key)
CREATE POLICY "Allow public insert access"
  ON photos FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public delete access (anon key)
CREATE POLICY "Allow public delete access"
  ON photos FOR DELETE
  TO anon
  USING (true);

-- 3. Storage bucket setup
--    Go to Storage in the Supabase dashboard and create a public bucket
--    named "birthday-gallery" with public access policy.
--
--    Or run this SQL (requires storage extension):
/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('birthday-gallery', 'birthday-gallery', true);

CREATE POLICY "Give anon public access to files"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'birthday-gallery');

CREATE POLICY "Give anon upload access"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'birthday-gallery');

CREATE POLICY "Give anon delete access"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'birthday-gallery');
*/
