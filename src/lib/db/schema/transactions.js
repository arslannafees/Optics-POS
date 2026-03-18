/**
 * @file transactions.js
 * @description Schema and migrations for Customers, Orders, Prescriptions, Vendors, and Purchases.
 */

export function initTransactions(db, defaultShopId) {
  db.exec(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
    local_id INTEGER,
    first_name TEXT NOT NULL, last_name TEXT, phone TEXT, mobile TEXT NOT NULL,
    email TEXT, address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS vendors(
    id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
    local_id INTEGER,
    name TEXT NOT NULL, company TEXT, contact_person TEXT, phone TEXT, email TEXT,
    address TEXT, city TEXT, gst_number TEXT, pan_number TEXT, balance REAL DEFAULT 0,
    remarks TEXT, active INTEGER DEFAULT 1, branch_id INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS purchases(
    id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
    local_id INTEGER,
    branch_id INTEGER REFERENCES branches(id), vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    invoice_number TEXT, date DATE, subtotal REAL DEFAULT 0, discount REAL DEFAULT 0,
    tax REAL DEFAULT 0, total REAL DEFAULT 0, paid REAL DEFAULT 0, balance REAL DEFAULT 0,
    payment_method TEXT, status TEXT DEFAULT 'pending', remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT, shop_id INTEGER REFERENCES shops(id),
    local_id INTEGER,
    branch_id INTEGER REFERENCES branches(id), customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    customer_name TEXT, order_type TEXT, order_date DATE, delivery_date DATE,
    status TEXT DEFAULT 'pending', subtotal REAL DEFAULT 0, discount REAL DEFAULT 0,
    tax REAL DEFAULT 0, total REAL DEFAULT 0, advance REAL DEFAULT 0, balance REAL DEFAULT 0,
    notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS prescriptions(
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    right_sph TEXT, right_cyl TEXT, right_axis TEXT, right_add TEXT, right_prism TEXT, right_diameter TEXT,
    right_base_curve TEXT, right_segment TEXT, right_pd TEXT, left_sph TEXT, left_cyl TEXT, left_axis TEXT,
    left_add TEXT, left_prism TEXT, left_diameter TEXT, left_base_curve TEXT, left_segment TEXT, left_pd TEXT,
    remarks TEXT, pd_type TEXT DEFAULT 'dual', total_pd TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Migration: add pd_type and total_pd columns if missing
  const rxCols = db.prepare("PRAGMA table_info(prescriptions)").all().map(c => c.name);
  if (!rxCols.includes('pd_type')) db.exec("ALTER TABLE prescriptions ADD COLUMN pd_type TEXT DEFAULT 'dual'");
  if (!rxCols.includes('total_pd')) db.exec("ALTER TABLE prescriptions ADD COLUMN total_pd TEXT");

  // Migrations to add local_id if missing
  const tablesToUpdate = ['customers', 'orders', 'vendors', 'purchases'];
  
  const orderColsLocal = db.prepare("PRAGMA table_info(orders)").all().map(c => c.name);
  if (!orderColsLocal.includes('user_id')) db.exec("ALTER TABLE orders ADD COLUMN user_id INTEGER REFERENCES users(id)");
  if (!orderColsLocal.includes('actual_total')) db.exec("ALTER TABLE orders ADD COLUMN actual_total REAL DEFAULT 0");



  tablesToUpdate.forEach(tableName => {
    const cols = db.prepare(`PRAGMA table_info(${tableName})`).all().map(c => c.name);
    if (!cols.includes('local_id')) {
      db.exec(`ALTER TABLE ${tableName} ADD COLUMN local_id INTEGER`);
      // Backfill local_id
      const shops = db.prepare(`SELECT DISTINCT shop_id FROM ${tableName} WHERE shop_id IS NOT NULL`).all();
      for (const shop of shops) {
        const records = db.prepare(`SELECT id FROM ${tableName} WHERE shop_id = ? ORDER BY id ASC`).all(shop.shop_id);
        let counter = 1;
        const updateStmt = db.prepare(`UPDATE ${tableName} SET local_id = ? WHERE id = ?`);
        for (const record of records) {
          updateStmt.run(counter++, record.id);
        }
      }
    }
  });
}
