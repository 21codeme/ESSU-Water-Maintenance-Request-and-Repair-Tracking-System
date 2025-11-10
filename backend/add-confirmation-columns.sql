-- Migration: Add confirmation columns to reports table
-- IMPORTANT: Run this SQL in your Supabase SQL Editor if the columns don't exist yet
-- This will add the columns needed for technician confirmation tracking

-- Add confirmed_by_technician column
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS confirmed_by_technician BOOLEAN DEFAULT FALSE;

-- Add confirmed_at timestamp column
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE NULL;

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'reports' 
AND column_name IN ('confirmed_by_technician', 'confirmed_at');


