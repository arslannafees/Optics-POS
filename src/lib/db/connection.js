import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/**
 * @file connection.js
 * @description Manages the singleton database connection for better-sqlite3.
 *
 * DB path priority:
 *  1. DB_PATH env variable (set in .env.local for a custom/persistent location)
 *  2. %APPDATA%\OpticsPos\optics.db  (Windows persistent folder, survives app updates)
 *  3. <project>/data/optics.db       (fallback for dev / non-Windows)
 */

function resolveDbPath() {
    if (process.env.DB_PATH) {
        return process.env.DB_PATH;
    }
    // On Windows use AppData so the DB survives app folder replacements/updates
    if (process.platform === 'win32' && process.env.APPDATA) {
        return path.join(process.env.APPDATA, 'OpticsPos', 'optics.db');
    }
    return path.join(process.cwd(), 'data', 'optics.db');
}

const dbPath = resolveDbPath();

// Ensure the data directory exists (required on fresh deployments e.g. Render)
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// One-time migration: if the new path has no DB yet but the legacy path does,
// copy the existing data over so nothing is lost on first update.
const legacyPath = path.join(process.cwd(), 'data', 'optics.db');
if (dbPath !== legacyPath && !fs.existsSync(dbPath) && fs.existsSync(legacyPath)) {
    try {
        fs.copyFileSync(legacyPath, dbPath);
        console.log(`[DB] Migrated database from ${legacyPath} to ${dbPath}`);
    } catch (err) {
        console.warn('[DB] Could not copy legacy database:', err.message);
    }
}

// Always use a global singleton to avoid multiple connections across
// Next.js worker processes / module re-evaluations in production.
if (!global._sqliteDb) {
    global._sqliteDb = new Database(dbPath);
}

const db = global._sqliteDb;

export { db };
export default db;
