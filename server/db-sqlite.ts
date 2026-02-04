import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@shared/schema';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

// Create SQLite database
const sqlite = new Database('./urban_intelligence_dev.db');

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

// Run migrations
async function runMigrations() {
  try {
    migrate(db, { migrationsFolder: './migrations' });
    console.log('✅ SQLite migrations completed');
  } catch (error) {
    console.log('ℹ️ Running without migrations - creating tables manually');
    // Create tables manually if migrations don't exist
    createTables();
  }
}

function createTables() {
  // Create users table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT UNIQUE,
      first_name TEXT,
      last_name TEXT,
      profile_image_url TEXT,
      role TEXT DEFAULT 'planner',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create projects table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      progress INTEGER DEFAULT 0,
      user_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Create land_use_zones table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS land_use_zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      zone_type TEXT NOT NULL,
      coordinates TEXT,
      efficiency TEXT DEFAULT '0.00',
      project_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id)
    )
  `);

  // Create traffic_nodes table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS traffic_nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      node_type TEXT NOT NULL,
      latitude TEXT,
      longitude TEXT,
      flow_rate INTEGER DEFAULT 0,
      efficiency TEXT DEFAULT '0.00',
      project_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id)
    )
  `);

  // Create environmental_metrics table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS environmental_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_type TEXT NOT NULL,
      value TEXT NOT NULL,
      unit TEXT NOT NULL,
      latitude TEXT,
      longitude TEXT,
      project_id INTEGER,
      recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id)
    )
  `);

  // Create activity_logs table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  console.log('✅ Database tables created');
}

// Initialize database
if (process.env.NODE_ENV !== 'production') {
  runMigrations();
}

export default sqlite;
