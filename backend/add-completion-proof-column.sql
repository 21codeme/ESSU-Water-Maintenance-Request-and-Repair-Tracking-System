-- Migration: Add completion_proof_path and confirmation columns to reports table
-- IMPORTANT: Run this SQL in your Supabase SQL Editor if the columns don't exist yet
-- This will add the columns needed for completion proof and technician confirmation tracking

-- Add completion_proof_path column
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS completion_proof_path VARCHAR(500) NULL;

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
AND column_name IN ('completion_proof_path', 'confirmed_by_technician', 'confirmed_at');

