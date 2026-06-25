CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  caption TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  publish_date TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  youtube_url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO admin_settings(id, password_hash) 
VALUES(1, '0192023a7bbd73250516f069df18b500a16b61a4d30a3be4ff622bafcfd824b1');

INSERT OR IGNORE INTO services(id, name, display_order) VALUES
(1, 'Root Canal Treatment', 1),
(2, 'Orthodontic Treatment', 2),
(3, 'Dental Implants', 3),
(4, 'Crowns, Bridges & Veneers', 4),
(5, 'Tooth Colour Fillings', 5),
(6, 'Teeth Whitening', 6),
(7, 'Other / General Consultation', 7);
