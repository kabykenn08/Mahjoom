-- ============================================
-- Mahjoom — Supabase Database Schema
-- Run this in the Supabase SQL editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Game Runs
-- ============================================
CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  board_seed TEXT NOT NULL,
  mood TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  moves INTEGER NOT NULL DEFAULT 0,
  mistakes INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  won BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Daily Challenges
-- ============================================
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  seed TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'focus',
  difficulty INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Leaderboard
-- ============================================
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  time INTEGER NOT NULL DEFAULT 0,
  country TEXT,
  city TEXT,
  challenge_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI Sessions
-- ============================================
CREATE TABLE IF NOT EXISTS ai_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  coaching_style TEXT,
  personality TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

-- Public read for leaderboard
CREATE POLICY "leaderboard_public_read" ON leaderboard FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "users_own_read" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_own_update" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can insert/read their own runs
CREATE POLICY "runs_own_all" ON runs USING (auth.uid() = user_id);

-- Users can manage their own AI sessions
CREATE POLICY "ai_sessions_own_all" ON ai_sessions USING (auth.uid() = user_id);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_country ON leaderboard(country);
CREATE INDEX IF NOT EXISTS idx_leaderboard_date ON leaderboard(challenge_date);
CREATE INDEX IF NOT EXISTS idx_runs_user ON runs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(date);
