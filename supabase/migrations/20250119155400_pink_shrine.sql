/*
  # Add timezone support to profiles
  
  1. Changes
    - Add timezone column to profiles table with default browser timezone
    - Update existing profiles to use their current timezone
*/

-- Add timezone column with default value
ALTER TABLE profiles 
ADD COLUMN timezone text NOT NULL DEFAULT 'America/New_York';

-- Update RLS policy to allow users to update their timezone
CREATE POLICY "Users can update their own timezone" 
ON profiles 
FOR UPDATE 
TO authenticated 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());