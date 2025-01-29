/*
  # Remove timezone column from content table
  
  1. Changes
    - Remove timezone column from content table as all dates will be stored in UTC
    - Dates will be displayed in user's timezone from profile settings
*/

ALTER TABLE content DROP COLUMN timezone;