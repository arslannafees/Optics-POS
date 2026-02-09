import { db } from './connection';

/**
 * @file config.js
 * @description Performance tuning and statement caching for the database.
 */

const stmtCache = new Map();

export function applyPragmas() {
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('foreign_keys = ON');
    db.pragma('cache_size = 20000');
    db.pragma('mmap_size = 300000000');
    db.pragma('temp_store = MEMORY');
    db.pragma('busy_timeout = 5000');
}

export function query(sql) {
    let stmt = stmtCache.get(sql);
    if (!stmt) {
        stmt = db.prepare(sql);
        stmtCache.set(sql, stmt);
    }
    return stmt;
}
