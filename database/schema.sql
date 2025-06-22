CREATE TABLE IF NOT EXISTS allset_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS allset_contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email Template Data Table
CREATE TABLE IF NOT EXISTS allset_email_template_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON stringified data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CTA Configuration Table
CREATE TABLE IF NOT EXISTS allset_cta_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cta_type TEXT NOT NULL, -- 'ebook-delivery', 'newsletter', or 'welcome'
  template_data_id INTEGER NOT NULL, -- FK to allset_email_template_data(id)
  newsletter_frequency TEXT, -- 'daily', 'weekly', 'monthly' (nullable)
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_data_id) REFERENCES allset_email_template_data(id)
);
