/*
  # Make scheduled date optional

  1. Changes
    - Modify `scheduled_date` column in `content` table to allow null values
    - Update content status trigger to handle null scheduled dates

  2. Notes
    - Content without a scheduled date will be marked as 'draft'
    - Existing content will not be affected
*/

-- Make scheduled_date column nullable
ALTER TABLE content ALTER COLUMN scheduled_date DROP NOT NULL;

-- Add trigger to automatically set status based on scheduled_date
CREATE OR REPLACE FUNCTION handle_content_status()
RETURNS trigger AS $$
BEGIN
  IF NEW.scheduled_date IS NULL THEN
    NEW.status := 'draft';
  ELSE
    NEW.status := 'scheduled';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new content
CREATE OR REPLACE TRIGGER on_content_insert
  BEFORE INSERT ON content
  FOR EACH ROW
  EXECUTE FUNCTION handle_content_status();