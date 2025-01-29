/*
  # Add image support
  
  1. Changes
    - Add image_url column to content table
    - Create storage bucket for content images
    - Set up storage policies for image access and management
  
  2. Security
    - Enable public read access to content images
    - Restrict upload/update/delete to authenticated users
    - Users can only modify their own images
*/

-- Add image_url column to content table
ALTER TABLE content ADD COLUMN image_url text;

-- Enable storage by creating bucket
INSERT INTO storage.buckets (id, name) 
VALUES ('content-images', 'content-images');

-- Set bucket to public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'content-images';

-- Set up storage policies
CREATE POLICY "Content images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

CREATE POLICY "Users can upload content images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own content images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-images' 
  AND auth.uid() = owner
);

CREATE POLICY "Users can delete their own content images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-images' 
  AND auth.uid() = owner
);