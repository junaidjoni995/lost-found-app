-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create items table for both lost and found items
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  date_occurred DATE NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'inactive')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create messages table for contact system
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Insert admin user (password: admin123)
INSERT OR IGNORE INTO users (email, password, name, is_admin) 
VALUES ('admin@lostfound.com', '$2a$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', 'Admin User', TRUE);

-- Insert sample data
INSERT OR IGNORE INTO users (email, password, name, phone) 
VALUES 
  ('john@example.com', '$2a$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', 'John Doe', '+1234567890'),
  ('jane@example.com', '$2a$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', 'Jane Smith', '+0987654321');

INSERT OR IGNORE INTO items (user_id, type, title, description, category, location, date_occurred, image_url) 
VALUES 
  (2, 'lost', 'Black iPhone 14', 'Lost my black iPhone 14 with a blue case. Has a small crack on the screen.', 'Electronics', 'Central Park, NYC', '2024-01-15', '/placeholder.svg?height=200&width=200'),
  (3, 'found', 'Brown Leather Wallet', 'Found a brown leather wallet with some cash and cards. No ID visible.', 'Personal Items', 'Times Square, NYC', '2024-01-16', '/placeholder.svg?height=200&width=200'),
  (2, 'lost', 'Golden Retriever Dog', 'My golden retriever named Max went missing. Very friendly, wearing a red collar.', 'Pets', 'Brooklyn Bridge Park', '2024-01-14', '/placeholder.svg?height=200&width=200');
