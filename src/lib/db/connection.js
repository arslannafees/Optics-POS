import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/**
 * @file connection.js
 * @description Manages the singleton database connection for better-sqlite3.
 */

const dbPath = path.join(process.cwd(), 'data', 'optics.db');

// Ensure the data directory exists (required on fresh deployments e.g. Render)
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Always use a global singleton to avoid multiple connections across
// Next.js worker processes / module re-evaluations in production.
if (!global._sqliteDb) {
    global._sqliteDb = new Database(dbPath);
}

const db = global._sqliteDb;

export { db };
export default db;
