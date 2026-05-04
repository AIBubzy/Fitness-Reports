const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../data/fitness.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeSchema();
  }
});

function initializeSchema() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        weight REAL,
        height REAL,
        gender TEXT,
        goal TEXT,
        activity_level TEXT,
        injuries TEXT,
        email TEXT,
        bmi REAL,
        bmr REAL,
        tdee REAL,
        report_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safely attempt to add the AI plans column in case table exists
    db.run("ALTER TABLE submissions ADD COLUMN ai_plans TEXT", (e) => {
        // ignore error if column already exists
    });
    db.run("ALTER TABLE submissions ADD COLUMN macros TEXT", (e) => {
        // ignore error if column already exists
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS client_daily_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        log_date TEXT,
        meals_checked TEXT,
        workout_completed BOOLEAN,
        hydration_ml INTEGER,
        FOREIGN KEY(client_id) REFERENCES submissions(id)
      )
    `);
  });
}

module.exports = db;
