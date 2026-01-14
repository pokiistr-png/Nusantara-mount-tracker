const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.sqlite');
const dbExists = fs.existsSync(DB_FILE);

const db = new sqlite3.Database(DB_FILE);

if (!dbExists) {
  console.log('Initializing new SQLite DB...');
  db.serialize(() => {
    db.run(`CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      photo TEXT,
      premium INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE mountains (
      id TEXT PRIMARY KEY,
      slug TEXT,
      name TEXT,
      province TEXT,
      elevation INTEGER,
      status TEXT,
      description TEXT,
      image TEXT,
      data JSON
    )`);
    // Load mountains from static JSON file into mountains table
    const mountains = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/assets/mountains.json'), 'utf8'));
    const stmt = db.prepare(`INSERT INTO mountains (id, slug, name, province, elevation, status, description, image, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    mountains.forEach(m => {
      stmt.run(m.id, m.slug, m.name, m.province, m.elevation, m.status, m.description, m.image || '', JSON.stringify(m));
    });
    stmt.finalize();
  });
} else {
  console.log('Using existing SQLite DB');
}

module.exports = db;
