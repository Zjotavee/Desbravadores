-- SQL Script for Supabase Setup
-- Run this in your Supabase SQL Editor

-- Meetings Table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  ageGroup TEXT,
  theme TEXT,
  activities TEXT[],
  leaders TEXT[],
  materials TEXT[],
  notes TEXT,
  program JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  objective TEXT,
  ageGroup TEXT,
  materials TEXT[],
  steps TEXT[],
  duration TEXT,
  spiritualization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spiritual Content Table
CREATE TABLE IF NOT EXISTS spiritual_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  reference TEXT,
  isFavorite BOOLEAN DEFAULT FALSE,
  isCompleted BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting Templates Table
CREATE TABLE IF NOT EXISTS meeting_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  location TEXT,
  ageGroup TEXT,
  theme TEXT,
  activities TEXT[],
  materials TEXT[],
  notes TEXT,
  program JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
-- For this demo, we'll allow public access, but in production you should restrict this
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE spiritual_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (READ/WRITE)
CREATE POLICY "Public Read Access" ON meetings FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON meetings FOR UPDATE USING (true);

CREATE POLICY "Public Read Access" ON activities FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON activities FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access" ON spiritual_content FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON spiritual_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON spiritual_content FOR UPDATE USING (true);

CREATE POLICY "Public Read Access" ON meeting_templates FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON meeting_templates FOR INSERT WITH CHECK (true);
