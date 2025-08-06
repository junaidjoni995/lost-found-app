import Database from "better-sqlite3";
import { join } from "path";

// ---------------------------------------------------------------------------
// Use a writable directory for serverless platforms (e.g. Vercel):
const dbPath =
  process.env.NODE_ENV === "production"
    ? "/tmp/database.sqlite"
    : join(process.cwd(), "database.sqlite");
// ---------------------------------------------------------------------------

const db = new Database(dbPath, {
  verbose: process.env.DEBUG ? console.log : undefined,
});
db.pragma("foreign_keys = ON");

/** Initialise tables if they don't exist (idempotent). */
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('lost','found')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      date_occurred DATE NOT NULL,
      image_url TEXT,
      status TEXT DEFAULT 'active' CHECK (status IN ('active','resolved','inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

// Ensure schema exists before any queries run
initDB();

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone?: string;
  is_admin: boolean;
  created_at: string;
}

export interface Item {
  id: number;
  user_id: number;
  type: "lost" | "found";
  title: string;
  description: string;
  category: string;
  location: string;
  date_occurred: string;
  image_url?: string;
  status: "active" | "resolved" | "inactive";
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
}

export interface Message {
  id: number;
  item_id: number;
  sender_id: number;
  receiver_id: number;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  receiver_name?: string;
  item_title?: string;
}

// User operations
export const userQueries = {
  create: db.prepare(`
    INSERT INTO users (email, password, name, phone)
    VALUES (?, ?, ?, ?)
  `),

  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

  findById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),

  getAll: db.prepare(`
    SELECT id, email, name, phone, is_admin, created_at FROM users
    ORDER BY created_at DESC
  `),

  delete: db.prepare(`
    DELETE FROM users WHERE id = ?
  `),
};

// Item operations
export const itemQueries = {
  create: db.prepare(`
    INSERT INTO items (user_id, type, title, description, category, location, date_occurred, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getAll: db.prepare(`
    SELECT i.*, u.name as user_name, u.email as user_email, u.phone as user_phone
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.status = 'active'
    ORDER BY i.created_at DESC
  `),

  getByUser: db.prepare(`
    SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC
  `),

  getById: db.prepare(`
    SELECT i.*, u.name as user_name, u.email as user_email, u.phone as user_phone
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.id = ?
  `),

  search: db.prepare(`
    SELECT i.*, u.name as user_name, u.email as user_email, u.phone as user_phone
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.status = 'active' 
    AND (i.title LIKE ? OR i.description LIKE ? OR i.location LIKE ?)
    ORDER BY i.created_at DESC
  `),

  filterByCategory: db.prepare(`
    SELECT i.*, u.name as user_name, u.email as user_email, u.phone as user_phone
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.status = 'active' AND i.category = ?
    ORDER BY i.created_at DESC
  `),

  filterByType: db.prepare(`
    SELECT i.*, u.name as user_name, u.email as user_email, u.phone as user_phone
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.status = 'active' AND i.type = ?
    ORDER BY i.created_at DESC
  `),

  updateStatus: db.prepare(`
    UPDATE items SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),

  delete: db.prepare(`
    DELETE FROM items WHERE id = ?
  `),
};

// Message operations
export const messageQueries = {
  create: db.prepare(`
    INSERT INTO messages (item_id, sender_id, receiver_id, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `),

  getByUser: db.prepare(`
    SELECT m.*, 
           s.name as sender_name,
           r.name as receiver_name,
           i.title as item_title
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
    JOIN items i ON m.item_id = i.id
    WHERE m.receiver_id = ? OR m.sender_id = ?
    ORDER BY m.created_at DESC
  `),

  markAsRead: db.prepare(`
    UPDATE messages SET is_read = TRUE WHERE id = ?
  `),

  getAll: db.prepare(`
    SELECT m.*, 
           s.name as sender_name,
           r.name as receiver_name,
           i.title as item_title
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
    JOIN items i ON m.item_id = i.id
    ORDER BY m.created_at DESC
  `),
};

export default db;
