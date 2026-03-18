-- =====================================================================
-- Akta.my — Initial Database Schema
-- Run this in the Supabase SQL Editor (or via supabase db push)
-- =====================================================================

-- ── Acts ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS acts (
  id            TEXT PRIMARY KEY,               -- e.g. "act-265"
  act_number    TEXT NOT NULL,                  -- e.g. "265"
  title_en      TEXT NOT NULL,
  title_ms      TEXT NOT NULL,
  year          INTEGER NOT NULL,
  category      TEXT NOT NULL DEFAULT 'other',  -- see ActCategory enum
  description   TEXT,
  last_updated  DATE NOT NULL DEFAULT CURRENT_DATE,
  total_sections INTEGER,
  is_featured   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Parts ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parts (
  id           TEXT PRIMARY KEY,               -- e.g. "act-265-p1"
  act_id       TEXT NOT NULL REFERENCES acts(id) ON DELETE CASCADE,
  part_number  TEXT NOT NULL,                  -- "I", "II", etc.
  title_en     TEXT NOT NULL,
  title_ms     TEXT,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS parts_act_id_idx ON parts(act_id);

-- ── Sections ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sections (
  id             TEXT PRIMARY KEY,             -- e.g. "act-265-s60a"
  act_id         TEXT NOT NULL REFERENCES acts(id) ON DELETE CASCADE,
  part_id        TEXT REFERENCES parts(id) ON DELETE SET NULL,
  section_number TEXT NOT NULL,               -- "60A", "374", etc.
  title_en       TEXT NOT NULL,
  content        TEXT NOT NULL,
  order_index    INTEGER NOT NULL DEFAULT 0,
  -- Full-text search
  content_fts    TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title_en, '') || ' ' || coalesce(content, ''))
  ) STORED,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sections_act_id_idx   ON sections(act_id);
CREATE INDEX IF NOT EXISTS sections_part_id_idx  ON sections(part_id);
CREATE INDEX IF NOT EXISTS sections_fts_idx      ON sections USING GIN(content_fts);

-- ── Subsections ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subsections (
  id          TEXT PRIMARY KEY,               -- e.g. "act-265-s60a-ss1"
  section_id  TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,                 -- "(1)", "(a)", "(i)"
  content     TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subsections_section_id_idx ON subsections(section_id);

-- ── Row-Level Security (public read-only) ─────────────────────────────
ALTER TABLE acts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections    ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read acts"        ON acts        FOR SELECT USING (true);
CREATE POLICY "Public read parts"       ON parts       FOR SELECT USING (true);
CREATE POLICY "Public read sections"    ON sections    FOR SELECT USING (true);
CREATE POLICY "Public read subsections" ON subsections FOR SELECT USING (true);

-- ── Full-text search function ─────────────────────────────────────────
-- Usage: SELECT * FROM search_sections('maternity leave');
CREATE OR REPLACE FUNCTION search_sections(query TEXT)
RETURNS TABLE (
  section_id      TEXT,
  act_id          TEXT,
  section_number  TEXT,
  section_title   TEXT,
  act_title_en    TEXT,
  act_number      TEXT,
  snippet         TEXT,
  rank            REAL
)
LANGUAGE SQL
AS $$
  SELECT
    s.id             AS section_id,
    s.act_id,
    s.section_number,
    s.title_en       AS section_title,
    a.title_en       AS act_title_en,
    a.act_number,
    ts_headline('english', s.content, plainto_tsquery('english', query),
                'MaxWords=50, MinWords=10, ShortWord=3, HighlightAll=false') AS snippet,
    ts_rank(s.content_fts, plainto_tsquery('english', query)) AS rank
  FROM sections s
  JOIN acts a ON a.id = s.act_id
  WHERE s.content_fts @@ plainto_tsquery('english', query)
  ORDER BY rank DESC
  LIMIT 40;
$$;
