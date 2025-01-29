/*
  # Update profile timezones to UTC

  1. Changes
    - Updates all existing profiles to use 'UTC' timezone
    - Ensures consistent timezone handling across the application

  2. Notes
    - Safe migration that only updates existing data
    - Does not modify table structure
*/

-- Update all existing profiles to use UTC timezone
UPDATE profiles 
SET timezone = 'UTC' 
WHERE timezone != 'UTC';