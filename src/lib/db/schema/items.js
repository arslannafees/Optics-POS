/**
 * @file items.js
 * @description Schema and migrations for order_items and purchase_items.
 */

export function initItems(db) {
    db.exec(`CREATE TABLE IF NOT EXISTS purchase_items(
    id INTEGER PRIMARY KEY AUTOINCREMENT, purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
    item_type TEXT CHECK(item_type IN('glass', 'sunglasses', 'lens', 'accessory', 'service', 'frame', 'contact_lens', 'eye_checkup')),
    item_id INTEGER, item_name TEXT, quantity INTEGER DEFAULT 1, cost REAL DEFAULT 0, total REAL DEFAULT 0
  )`);

    db.exec(`CREATE TABLE IF NOT EXISTS order_items(
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    item_type TEXT CHECK(item_type IN('glass', 'sunglasses', 'lens', 'accessory', 'service', 'frame', 'contact_lens', 'eye_checkup')),
    item_id INTEGER, item_name TEXT, quantity INTEGER DEFAULT 1, price REAL DEFAULT 0, total REAL DEFAULT 0,
    prescription_data TEXT
  )`);

    checkConstraint(db, 'order_items');
    checkConstraint(db, 'purchase_items');
}

function checkConstraint(db, table) {
    const info = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(table);
    if (info && !info.sql.includes('eye_checkup')) {
        db.exec(`PRAGMA foreign_keys = OFF; BEGIN TRANSACTION; ALTER TABLE ${table} RENAME TO ${table}_old;
      CREATE TABLE ${table}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ${table === 'order_items' ? 'order_id' : 'purchase_id'} INTEGER REFERENCES ${table === 'order_items' ? 'orders' : 'purchases'}(id) ON DELETE CASCADE,
        item_type TEXT CHECK(item_type IN('glass', 'sunglasses', 'lens', 'accessory', 'service', 'frame', 'contact_lens', 'eye_checkup')),
        item_id INTEGER, item_name TEXT, quantity INTEGER DEFAULT 1,
        ${table === 'order_items' ? 'price REAL DEFAULT 0' : 'cost REAL DEFAULT 0'},
        total REAL DEFAULT 0 ${table === 'order_items' ? ', prescription_data TEXT' : ''}
      );
      INSERT INTO ${table} SELECT * FROM ${table}_old; DROP TABLE ${table}_old; COMMIT; PRAGMA foreign_keys = ON;`);
    }
}
