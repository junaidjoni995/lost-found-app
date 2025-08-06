const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

// Paths
const dbPath = path.join(__dirname, "..", "database.sqlite");
const sqlPath = path.join(__dirname, "..", "scripts/init-database.sql");

// Load SQL
const sql = fs.readFileSync(sqlPath, "utf8");

// Initialize DB
const db = new Database(dbPath);
db.exec(sql);

console.log("✅ Database initialized successfully");
