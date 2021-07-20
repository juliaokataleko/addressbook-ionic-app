CREATE TABLE IF NOT EXISTS properties(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT);
INSERT OR IGNORE INTO properties(id, name) VALUES (1, 'Privada');
INSERT OR IGNORE INTO properties(id, name) VALUES (2, 'Pública');
CREATE TABLE IF NOT EXISTS addresses(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), data DATE NULL, activity_niche VARCHAR(255) NULL, classe VARCHAR(255) NULL, property_type VARCHAR(255) NULL, description TEXT NULL, follow_up_start DATE NULL, follow_up_end DATE NULL);
INSERT OR IGNORE INTO addresses(id, name) VALUES (1, "Avenida Francisco Matarazzo.");