/**
 * @file inventory.js
 * @description Schema and migrations for Brands, Frames, Lenses, Contact Lenses, and Accessories.
 */

export function initInventory(db, defaultShopId) {
  db.exec(`CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
    type TEXT CHECK(type IN ('Frame', 'Lens', 'Spectacle Lens', 'Accessory', 'Service', 'Glass', 'Sunglasses', 'Contact Lens', 'All Categories')) NOT NULL,
    remarks TEXT, active INTEGER DEFAULT 1, shop_id INTEGER REFERENCES shops(id),
    branch_id INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS frames (
    id INTEGER PRIMARY KEY AUTOINCREMENT, brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    brand_name TEXT, model TEXT, category TEXT DEFAULT 'glass', size TEXT, color TEXT,
    cost REAL DEFAULT 0, price REAL DEFAULT 0, barcode TEXT, shape TEXT, stock INTEGER DEFAULT 0,
    opening_balance INTEGER DEFAULT 0, remarks TEXT, active INTEGER DEFAULT 1,
    shop_id INTEGER REFERENCES shops(id), branch_id INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS lenses(
    id INTEGER PRIMARY KEY AUTOINCREMENT, brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    brand_name TEXT, name TEXT NOT NULL, type TEXT, material TEXT, coating TEXT,
    cost REAL DEFAULT 0, price REAL DEFAULT 0, stock INTEGER DEFAULT 0, remarks TEXT, active INTEGER DEFAULT 1,
    shop_id INTEGER REFERENCES shops(id), branch_id INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS contact_lenses(
    id INTEGER PRIMARY KEY AUTOINCREMENT, brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    brand_name TEXT, name TEXT NOT NULL, type TEXT, replacement_schedule TEXT, base_curve TEXT,
    diameter TEXT, water_content TEXT, material TEXT, sph TEXT, cyl TEXT, axis TEXT, add_power TEXT,
    dominance TEXT, uv_protection INTEGER DEFAULT 0, oxygen_permeability TEXT, eye_side TEXT,
    expiry_date TEXT, color TEXT, cost REAL DEFAULT 0, price REAL DEFAULT 0, stock INTEGER DEFAULT 0,
    remarks TEXT, active INTEGER DEFAULT 1, shop_id INTEGER REFERENCES shops(id), branch_id INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS accessories(
    id INTEGER PRIMARY KEY AUTOINCREMENT, brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL, accessory_type TEXT, cost REAL DEFAULT 0, price REAL DEFAULT 0, stock INTEGER DEFAULT 0,
    remarks TEXT, active INTEGER DEFAULT 1, shop_id INTEGER REFERENCES shops(id), branch_id INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}
