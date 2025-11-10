-- ESSU Water Maintenance System - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'technician', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    location VARCHAR(500) NOT NULL,
    issue_type VARCHAR(20) NOT NULL CHECK (issue_type IN ('Leak', 'Supply', 'Drainage', 'Other')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Cancelled')),
    assigned_to UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    admin_note TEXT NULL,
    image_path VARCHAR(500) NULL,
    completion_proof_path VARCHAR(500) NULL,
    confirmed_by_technician BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_assigned_to ON reports(assigned_to);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist, then create triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (adjust as needed)
-- Allow service role to do everything (for backend API)
CREATE POLICY "Service role can do everything on users" ON users
    FOR ALL USING (true);

-- Create policies for reports table
-- Allow service role to do everything (for backend API)
CREATE POLICY "Service role can do everything on reports" ON reports
    FOR ALL USING (true);

-- Allow public to read resolved/in progress reports
CREATE POLICY "Public can read resolved reports" ON reports
    FOR SELECT USING (status IN ('Resolved', 'In Progress'));

-- Insert demo users (passwords will be updated by setup script)
-- Note: These are placeholder passwords, update them using bcrypt hashes
INSERT INTO users (full_name, email, password, role) VALUES
('Admin User', 'admin@essu.edu', '$2a$10$placeholder', 'admin'),
('Technician User', 'tech@essu.edu', '$2a$10$placeholder', 'technician'),
('Regular User', 'user@essu.edu', '$2a$10$placeholder', 'user')
ON CONFLICT (email) DO NOTHING;

