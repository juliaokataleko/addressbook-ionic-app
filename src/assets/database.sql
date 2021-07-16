CREATE TABLE IF NOT EXISTS properties(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT);
INSERT or IGNORE INTO porperty_types(id, name) VALUES (1, 'Privado');
INSERT or IGNORE INTO porperty_types(id, name) VALUES (2, 'Público');

CREATE TABLE IF NOT EXISTS addresses(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, 
    data DATE, 
    activity_niche VARCHAR(200),
    classe VARCHAR(200),
    porperty_type VARCHAR(200),
    description TEXT NULL,
    follow_up_start DATE NULL,
    follow_up_end DATE NULL,
);
