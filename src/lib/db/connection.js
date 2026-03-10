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

let db;

if (process.env.NODE_ENV === 'production') {
    db = new Database(dbPath);
} else {
    if (!global._sqliteDb) {
        global._sqliteDb = new Database(dbPath);
    }
    db = global._sqliteDb;
}

export { db };
export default db;
