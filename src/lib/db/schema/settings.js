/**
 * @file settings.js
 * @description Schema and migrations for Settings and default data initialization.
 */

export function initSettings(db, defaultShopId) {
    db.exec(`CREATE TABLE IF NOT EXISTS settings(
    id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
    key TEXT NOT NULL, value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(shop_id, key)
  )`);

    const settingsCols = db.prepare("PRAGMA table_info(settings)").all().map(c => c.name);
    if (!settingsCols.includes('shop_id')) {
        db.exec(`ALTER TABLE settings ADD COLUMN shop_id INTEGER`);
        db.exec(`UPDATE settings SET shop_id = ${defaultShopId} WHERE shop_id IS NULL`);
    }

    // Handle unique constraint migration if necessary
    const indexes = db.prepare("PRAGMA index_list(settings)").all();
    const hasGlobalUnique = indexes.some(idx => {
        const info = db.prepare(`PRAGMA index_info(${idx.name})`).all();
        return idx.unique === 1 && info.length === 1 && info[0].name === 'key';
    });

    if (hasGlobalUnique) migrateSettings(db, defaultShopId);

    // Default Creator PIN
    const pinExists = db.prepare('SELECT id FROM settings WHERE key = ? AND shop_id = ?').get('creator_pin', defaultShopId);
    if (!pinExists) db.prepare(`INSERT OR IGNORE INTO settings(key, value, shop_id) VALUES(?, ?, ?)`).run('creator_pin', 'BranchCreatorPin3047', defaultShopId);
}

function migrateSettings(db, defaultShopId) {
    db.exec(`PRAGMA foreign_keys = OFF; BEGIN TRANSACTION; ALTER TABLE settings RENAME TO settings_old;
    CREATE TABLE settings(
      id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
      key TEXT NOT NULL, value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(shop_id, key)
    );
    INSERT INTO settings (id, shop_id, key, value, updated_at)
    SELECT id, COALESCE(shop_id, ${defaultShopId}), key, value, updated_at FROM settings_old;
    DROP TABLE settings_old; COMMIT; PRAGMA foreign_keys = ON;`);
}
