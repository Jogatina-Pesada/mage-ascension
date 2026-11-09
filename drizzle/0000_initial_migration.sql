CREATE TABLE IF NOT EXISTS members (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','player')),
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1))
);
CREATE TABLE IF NOT EXISTS records (
  path TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('sheet','lineage','coven','lists','catalog','image')),
  owner_id TEXT NOT NULL REFERENCES members(user_id),
  content TEXT NOT NULL,
  version TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  source_sha256 TEXT,
  list_name TEXT NOT NULL DEFAULT 'default'
);
CREATE TABLE IF NOT EXISTS record_access (
  path TEXT NOT NULL REFERENCES records(path) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES members(user_id) ON DELETE CASCADE,
  permission TEXT NOT NULL CHECK(permission IN ('read','write')),
  PRIMARY KEY(path,user_id)
);
CREATE INDEX IF NOT EXISTS records_owner ON records(owner_id);
-- A failed optimistic precondition aborts the entire D1 batch, including earlier writes.
CREATE TABLE IF NOT EXISTS write_guards (
  id TEXT PRIMARY KEY,
  ok INTEGER NOT NULL CHECK(ok=1)
);
