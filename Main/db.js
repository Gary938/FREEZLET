// 📦 db.js — SQLite database initialization
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Database from "better-sqlite3";
import { mainLogger } from "./loggerHub.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "../Progress/structure.db");
export const db = new Database(dbPath);
mainLogger.ready("Main/db.js — database connected: structure.db");

// 🔧 Initialize tables on first run (minimum)
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT UNIQUE NOT NULL,
      stage INTEGER DEFAULT 0,
      stars INTEGER DEFAULT 0,
      percentage INTEGER DEFAULT 0,
      name TEXT,
      questions INTEGER DEFAULT 0,
      parentPath TEXT,
      level INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      is_category_marker INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS backgroundState (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      currentPath TEXT NOT NULL,
      mode TEXT DEFAULT 'random'
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Check if is_category_marker column exists, add if not
  try {
    const columns = db.prepare(`PRAGMA table_info(tests)`).all();
    const hasCategoryMarker = columns.some(col => col.name === 'is_category_marker');

    if (!hasCategoryMarker) {
      db.exec(`ALTER TABLE tests ADD COLUMN is_category_marker INTEGER DEFAULT 0`);
      mainLogger.info("db", "Added is_category_marker column to tests table");
    }
  } catch (alterError) {
    mainLogger.error("db", `Error checking/adding is_category_marker column: ${alterError.message}`);
  }

  // Migration: rename MERGE → Merged Tests
  try {
    const testsDir = path.join(__dirname, "../Tests");
    const oldMergePath = path.join(testsDir, "MERGE");
    const newMergePath = path.join(testsDir, "Merged Tests");

    // File system migration: folder rename
    if (fs.existsSync(oldMergePath) && !fs.existsSync(newMergePath)) {
      fs.renameSync(oldMergePath, newMergePath);
      mainLogger.info("db", "FS migration: Tests/MERGE folder renamed to Tests/Merged Tests");
    }

    // DB migration: update paths
    const oldMergeTests = db.prepare(`SELECT COUNT(*) as count FROM tests WHERE path LIKE 'Tests/MERGE/%'`).get();

    if (oldMergeTests && oldMergeTests.count > 0) {
      db.exec(`UPDATE tests SET path = REPLACE(path, 'Tests/MERGE/', 'Tests/Merged Tests/') WHERE path LIKE 'Tests/MERGE/%'`);
      mainLogger.info("db", `DB migration: updated ${oldMergeTests.count} records from Tests/MERGE/ to Tests/Merged Tests/`);
    }

    // Also check lastCategory in settings
    const lastCategorySetting = db.prepare(`SELECT value FROM settings WHERE key = 'lastCategory'`).get();
    if (lastCategorySetting && lastCategorySetting.value === 'Tests/MERGE') {
      db.prepare(`UPDATE settings SET value = 'Tests/Merged Tests' WHERE key = 'lastCategory'`).run();
      mainLogger.info("db", "Migration: updated lastCategory from Tests/MERGE to Tests/Merged Tests");
    }
  } catch (migrationError) {
    mainLogger.error("db", `Error migrating MERGE → Merged Tests: ${migrationError.message}`);
  }

  mainLogger.info("db", "Tables tests, backgroundState and settings checked/created");
} catch (err) {
  mainLogger.error("db", `Error initializing DB: ${err.message}`);
}
