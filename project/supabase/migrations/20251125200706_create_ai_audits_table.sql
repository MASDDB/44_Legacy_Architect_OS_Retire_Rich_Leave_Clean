/*
  # AI + Exit Audit System

  1. New Tables
    - `ai_audits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `answers` (jsonb) - stores all audit question answers
      - `ai_readiness_score` (integer) - computed AI readiness score (0-100)
      - `exit_readiness_score` (integer) - computed exit readiness score (0-100)
      - `recommended_missions` (jsonb) - array of recommended mission objects in priority order
      - `created_at` (timestamptz) - timestamp of audit completion

  2. Security
    - Enable RLS on `ai_audits` table
    - Add policy for authenticated users to read their own audits
    - Add policy for authenticated users to create their own audits
    - Add policy for authenticated users to update their own audits

  3. Indexes
    - Index on user_id for efficient user audit lookups
    - Index on created_at for sorting by recency
*/

CREATE TABLE IF NOT EXISTS ai_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_readiness_score integer NOT NULL CHECK (ai_readiness_score >= 0 AND ai_readiness_score <= 100),
  exit_readiness_score integer NOT NULL CHECK (exit_readiness_score >= 0 AND exit_readiness_score <= 100),
  recommended_missions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_audits ENABLE ROW LEVEL SECURITY;

-- Users can read their own audits
CREATE POLICY "Users can read own audits"
  ON ai_audits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own audits
CREATE POLICY "Users can create own audits"
  ON ai_audits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own audits
CREATE POLICY "Users can update own audits"
  ON ai_audits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_audits_user_id ON ai_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_audits_created_at ON ai_audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audits_user_created ON ai_audits(user_id, created_at DESC);
