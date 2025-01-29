/*
  # Add timezone column to content table

  1. Changes
    - Add timezone column to content table with default value
    - Make timezone column non-nullable
*/

-- Add timezone column with default value
ALTER TABLE content 
ADD COLUMN timezone text NOT NULL DEFAULT 'UTC';