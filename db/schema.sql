-- BA Interview Trainer - Database Schema (Vercel Postgres)

CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(50) PRIMARY KEY,
  module_id VARCHAR(20) NOT NULL,
  type VARCHAR(30) NOT NULL,
  level VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  explanation TEXT NOT NULL DEFAULT '',
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  question_id VARCHAR(50) REFERENCES questions(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  answer JSONB,
  attempts INTEGER DEFAULT 1,
  answered_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  diagnostics_level VARCHAR(10),
  diagnostics_data JSONB,
  exam_result JSONB,
  xp INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_module ON questions(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level);
CREATE INDEX IF NOT EXISTS idx_progress_question ON progress(question_id);
