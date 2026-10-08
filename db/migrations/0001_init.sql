-- Migration number: 0001 	 2026-10-08
-- Admin area: leads, their submissions and timeline, emails sent, documents (proposals and agreements) and invoices.

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'new',
  notes TEXT NOT NULL DEFAULT '',
  prescan_json TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS leads_stage ON leads (stage, updated_at);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  created_at TEXT NOT NULL,
  type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  summary_text TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS submissions_lead ON submissions (lead_id, created_at);
CREATE INDEX IF NOT EXISTS submissions_created ON submissions (created_at);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  created_at TEXT NOT NULL,
  type TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS events_lead ON events (lead_id, created_at);
CREATE INDEX IF NOT EXISTS events_created ON events (created_at);

CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  created_at TEXT NOT NULL,
  template TEXT NOT NULL DEFAULT '',
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  resend_id TEXT
);
CREATE INDEX IF NOT EXISTS emails_lead ON emails (lead_id, created_at);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body_md TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  token TEXT NOT NULL UNIQUE,
  sent_at TEXT,
  viewed_at TEXT,
  accepted_at TEXT,
  accepted_name TEXT,
  accepted_ip TEXT,
  accepted_ua TEXT
);
CREATE INDEX IF NOT EXISTS documents_lead ON documents (lead_id, created_at);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  number TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  link TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  paid_at TEXT
);
CREATE INDEX IF NOT EXISTS invoices_lead ON invoices (lead_id, created_at);
