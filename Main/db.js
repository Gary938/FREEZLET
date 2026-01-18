// 📦 db.js — SQLite database initialization with migrations
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import { getDbPath, getTestsPath, getProgressPath } from "./Utils/appPaths.js";
import { mainLogger } from "./loggerHub.js";
import { initializeUserData } from "./Utils/dataInitializer.js";

// Initialize user data on first launch (copy Tests, MyBackground from resources)
initializeUserData();

const dbPath = getDbPath();

// Ensure Progress directory exists (backup check, dataInitializer should handle this)
const progressDir = getProgressPath();
if (!fs.existsSync(progressDir)) {
  fs.mkdirSync(progressDir, { recursive: true });
}

export const db = new Database(dbPath);
mainLogger.ready("Main/db.js — database connected: structure.db");

// ============================================================================
// 🔧 DATABASE MIGRATION SYSTEM
// ============================================================================

// Required tables with their CREATE statements
const REQUIRED_TABLES = {
  tests: `
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
    )`,
  backgroundState: `
    CREATE TABLE IF NOT EXISTS backgroundState (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      currentPath TEXT NOT NULL,
      mode TEXT DEFAULT 'random'
    )`,
  settings: `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )`,
  last_category: `
    CREATE TABLE IF NOT EXISTS last_category (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      full_path TEXT NOT NULL
    )`,
  learn_mode_answers: `
    CREATE TABLE IF NOT EXISTS learn_mode_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_path TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    )`,
  learn_mode_sessions: `
    CREATE TABLE IF NOT EXISTS learn_mode_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_path TEXT NOT NULL,
      correct_count INTEGER NOT NULL,
      total_count INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    )`,
  learn_mode_statistics: `
    CREATE TABLE IF NOT EXISTS learn_mode_statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_path TEXT UNIQUE NOT NULL,
      total_answers INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      last_update INTEGER NOT NULL
    )`,
  myBackgroundSettings: `
    CREATE TABLE IF NOT EXISTS myBackgroundSettings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      randomMode INTEGER DEFAULT 0
    )`
};

// Required columns for tests table with their definitions
const TESTS_REQUIRED_COLUMNS = [
  { name: 'id', definition: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
  { name: 'path', definition: 'TEXT UNIQUE NOT NULL' },
  { name: 'stage', definition: 'INTEGER DEFAULT 0' },
  { name: 'stars', definition: 'INTEGER DEFAULT 0' },
  { name: 'percentage', definition: 'INTEGER DEFAULT 0' },
  { name: 'name', definition: 'TEXT' },
  { name: 'questions', definition: 'INTEGER DEFAULT 0' },
  { name: 'parentPath', definition: 'TEXT' },
  { name: 'level', definition: 'INTEGER DEFAULT 0' },
  { name: 'attempts', definition: 'INTEGER DEFAULT 0' },
  { name: 'is_category_marker', definition: 'INTEGER DEFAULT 0' }
];

/**
 * Get existing tables in database
 */
function getExistingTables() {
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
  return tables.map(t => t.name);
}

/**
 * Get existing columns for a table
 */
function getTableColumns(tableName) {
  try {
    return db.prepare(`PRAGMA table_info(${tableName})`).all();
  } catch {
    return [];
  }
}

/**
 * Create missing tables
 */
function createMissingTables() {
  const existingTables = getExistingTables();
  let created = 0;

  for (const [tableName, createStatement] of Object.entries(REQUIRED_TABLES)) {
    if (!existingTables.includes(tableName)) {
      try {
        db.exec(createStatement);
        mainLogger.info("db:migration", `Created missing table: ${tableName}`);
        created++;
      } catch (err) {
        mainLogger.error("db:migration", `Failed to create table ${tableName}: ${err.message}`);
      }
    }
  }

  return created;
}

/**
 * Add missing columns to tests table
 */
function migrateTestsColumns() {
  const columns = getTableColumns('tests');
  const existingColumnNames = columns.map(c => c.name);
  let added = 0;

  for (const col of TESTS_REQUIRED_COLUMNS) {
    if (!existingColumnNames.includes(col.name)) {
      // Extract just the type and default for ALTER TABLE
      const alterDef = col.definition
        .replace('PRIMARY KEY AUTOINCREMENT', '')
        .replace('UNIQUE NOT NULL', '')
        .replace('NOT NULL', '')
        .trim() || 'TEXT';

      try {
        db.exec(`ALTER TABLE tests ADD COLUMN ${col.name} ${alterDef}`);
        mainLogger.info("db:migration", `Added column to tests: ${col.name}`);
        added++;
      } catch (err) {
        mainLogger.error("db:migration", `Failed to add column ${col.name}: ${err.message}`);
      }
    }
  }

  return added;
}

/**
 * Data migrations (MERGE → Merged Tests, etc.)
 */
function runDataMigrations() {
  // Migration: rename MERGE → Merged Tests
  try {
    const testsDir = getTestsPath();
    const oldMergePath = path.join(testsDir, "MERGE");
    const newMergePath = path.join(testsDir, "Merged Tests");

    // File system migration: folder rename
    if (fs.existsSync(oldMergePath) && !fs.existsSync(newMergePath)) {
      fs.renameSync(oldMergePath, newMergePath);
      mainLogger.info("db:migration", "FS: Tests/MERGE renamed to Tests/Merged Tests");
    }

    // DB migration: update paths
    const oldMergeTests = db.prepare(`SELECT COUNT(*) as count FROM tests WHERE path LIKE 'Tests/MERGE/%'`).get();

    if (oldMergeTests && oldMergeTests.count > 0) {
      db.exec(`UPDATE tests SET path = REPLACE(path, 'Tests/MERGE/', 'Tests/Merged Tests/') WHERE path LIKE 'Tests/MERGE/%'`);
      mainLogger.info("db:migration", `Updated ${oldMergeTests.count} paths: MERGE → Merged Tests`);
    }

    // Update lastCategory in settings
    const lastCategorySetting = db.prepare(`SELECT value FROM settings WHERE key = 'lastCategory'`).get();
    if (lastCategorySetting && lastCategorySetting.value === 'Tests/MERGE') {
      db.prepare(`UPDATE settings SET value = 'Tests/Merged Tests' WHERE key = 'lastCategory'`).run();
      mainLogger.info("db:migration", "Updated lastCategory: MERGE → Merged Tests");
    }
  } catch (err) {
    mainLogger.error("db:migration", `Data migration error: ${err.message}`);
  }
}

/**
 * Run all migrations
 */
function runMigrations() {
  mainLogger.info("db:migration", "Starting database migrations...");

  try {
    // Step 1: Create missing tables
    const tablesCreated = createMissingTables();

    // Step 2: Add missing columns to tests table
    const columnsAdded = migrateTestsColumns();

    // Step 3: Run data migrations
    runDataMigrations();

    if (tablesCreated > 0 || columnsAdded > 0) {
      mainLogger.info("db:migration", `Migrations complete: ${tablesCreated} tables created, ${columnsAdded} columns added`);
    } else {
      mainLogger.info("db:migration", "Database schema is up to date");
    }
  } catch (err) {
    mainLogger.error("db:migration", `Migration failed: ${err.message}`);
  }
}

// Run migrations on startup
runMigrations();
