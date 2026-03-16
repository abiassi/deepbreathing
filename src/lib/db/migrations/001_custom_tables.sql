-- Custom tables for deepbreathingexercises.com
-- Run AFTER Better Auth migration (which creates user, session, account, verification tables)

CREATE TABLE IF NOT EXISTS user_settings (
  user_id           TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  mode              TEXT NOT NULL DEFAULT 'Box Breathing',
  speed_multiplier  REAL NOT NULL DEFAULT 1.0,
  selected_duration INTEGER,
  muted             BOOLEAN NOT NULL DEFAULT false,
  theme             TEXT NOT NULL DEFAULT 'system',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_stats (
  user_id            TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  total_minutes      INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
