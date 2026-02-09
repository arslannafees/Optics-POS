/**
 * @file core.js
 * @description Schema and migrations for Shops, Users, Branches, and Activity Logs.
 */

export function initCore(db, defaultShopId) {
  db.exec(`CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE, active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, role TEXT DEFAULT 'admin', shop_id INTEGER REFERENCES shops(id),
    branch_id INTEGER, active INTEGER DEFAULT 1, expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const userCols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  if (!userCols.includes('active')) db.exec("ALTER TABLE users ADD COLUMN active INTEGER DEFAULT 1");
  if (!userCols.includes('shop_id')) {
    db.exec(`ALTER TABLE users ADD COLUMN shop_id INTEGER`);
    db.exec(`UPDATE users SET shop_id = ${defaultShopId} WHERE shop_id IS NULL`);
  }
  if (!userCols.includes('branch_id')) db.exec("ALTER TABLE users ADD COLUMN branch_id INTEGER");
  if (!userCols.includes('expires_at')) db.exec("ALTER TABLE users ADD COLUMN expires_at DATETIME");
  if (!userCols.includes('validity_type')) db.exec("ALTER TABLE users ADD COLUMN validity_type TEXT DEFAULT 'permanent'");

  db.exec(`CREATE TABLE IF NOT EXISTS branches(
    id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
    name TEXT NOT NULL, address TEXT, phone TEXT, active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shop_id, name)
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
    branch_id INTEGER REFERENCES branches(id), user_id INTEGER REFERENCES users(id),
    user_name TEXT, user_role TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL,
    entity_id INTEGER, entity_name TEXT, changes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}
