/**
 * @file seed.js
 * @description Default data seeding for new installations.
 */

export function seedData(db) {
    const shopCount = db.prepare('SELECT COUNT(*) as count FROM shops').get().count;
    if (shopCount === 0) {
        db.prepare(`INSERT INTO shops (name, slug) VALUES (?, ?)`).run('Default Shop', 'default-shop');
    }

    const defaultShopId = db.prepare('SELECT id FROM shops LIMIT 1').get().id;
    
    // Seed branch first so we can assign its ID to users
    seedDefaultBranch(db, defaultShopId);
    const mainBranchId = db.prepare('SELECT id FROM branches WHERE shop_id = ? AND name = ?').get(defaultShopId, 'Main Branch')?.id || 1;

    seedAdmin(db, 'owner@optics.com', 'Owner', defaultShopId, mainBranchId, 'owner', '$2b$10$roNwMySjCZjRD5dkL/x.X.o24J9vGrQkrJ/UaIE4y7VXH9uiQy7TW');
    seedAdmin(db, 'superadmin@optics.com', 'Super Admin', null, null, 'superadmin', '$2b$10$DhLGHQ71zMigPcttF8ubLuTJzrME16o2E.Y.a4b.Mg1eYW3E7iREe');
    seedAdmin(db, 'staff@optics.com', 'Staff', defaultShopId, mainBranchId, 'staff', '$2b$10$X8QvU6nsIP6P9UWQbXnf1u.6cRqTYnfbG4H7FYyPPf2x9n62zaf6u');
    seedAdmin(db, 'lensfabricator@optics.com', 'Lens Fabricator', defaultShopId, mainBranchId, 'lens fabricator', '$2b$10$2Bl76LkNmeho/nXdDaP2T.wOFPmw8IgqNm/srGEXv2PX3qNjTavra');
    
    return defaultShopId;
}

function seedAdmin(db, email, name, shopId, branchId, role, hashedPassword) {
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!exists) {
        db.prepare(`INSERT INTO users(name, email, password, role, shop_id, branch_id) VALUES(?, ?, ?, ?, ?, ?)`)
            .run(name, email, hashedPassword, role, shopId, branchId);
    }
}

function seedDefaultBranch(db, shopId) {
    const exists = db.prepare('SELECT id FROM branches WHERE shop_id = ?').get(shopId);
    if (!exists) {
        db.prepare(`INSERT INTO branches (shop_id, name) VALUES (?, ?)`).run(shopId, 'Main Branch');
    }
}
