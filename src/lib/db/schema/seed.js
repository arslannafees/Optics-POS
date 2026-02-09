/**
 * @file seed.js
 * @description Default data seeding for new installations.
 */

export function seedData(db) {
    const shopCount = db.prepare('SELECT COUNT(*) as count FROM shops').get().count;
    if (shopCount === 0) {
        const res = db.prepare(`INSERT INTO shops (name, slug) VALUES (?, ?)`).run('Default Shop', 'default-shop');
        const shopId = res.lastInsertRowid;
        const sets = [['currency', 'PKR'], ['taxRate', '18'], ['dateFormat', 'DD/MM/YYYY'], ['invoicePrefix', 'INV'], ['invoiceStartNumber', '1'], ['lowStockThreshold', '5'], ['lowStockAlert', 'true'], ['printerType', 'laserjet'], ['businessName', 'Default Shop']];
        const ins = db.prepare('INSERT INTO settings (shop_id, key, value) VALUES (?, ?, ?)');
        for (const [k, v] of sets) ins.run(shopId, k, v);
    }

    const defaultShopId = db.prepare('SELECT id FROM shops LIMIT 1').get().id;
    seedAdmin(db, 'admin@optics.com', 'Admin', defaultShopId, 'admin');
    seedAdmin(db, 'superadmin@optics.com', 'Super Admin', null, 'super-admin');
    return defaultShopId;
}

function seedAdmin(db, email, name, shopId, role) {
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!exists) {
        db.prepare(`INSERT INTO users(name, email, password, role, shop_id) VALUES(?, ?, ?, ?, ?)`)
            .run(name, email, '$2b$10$t6pz5/4NHvkkDL4CgAViEOfxGBz3tuBMYv11ZgqTLW2a.eQrChHchi', role, shopId);
    }
}
