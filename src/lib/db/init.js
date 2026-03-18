import { db } from './connection';
import { applyPragmas } from './config';
import { initCore } from './schema/core';
import { initInventory } from './schema/inventory';
import { initTransactions } from './schema/transactions';
import { initItems } from './schema/items';
import { initSettings } from './schema/settings';
import { initIndexes } from './schema/indexes';
import { initFabrication } from './schema/fabrication';
import { seedData } from './schema/seed';

const CURRENT_VERSION = 17;

export function initialize() {
    if (global._sqliteInitialized) return db;

    applyPragmas();
    const dbVersion = db.pragma('user_version', { simple: true });

    if (dbVersion < CURRENT_VERSION) {
        console.log(`[DB] Initialize/Migrate (v${dbVersion} -> v${CURRENT_VERSION})...`);

        if (dbVersion > 0 && dbVersion < 13) {
            try {
                // Disable foreign keys temporarily to allow dropping the table
                db.pragma('foreign_keys = OFF');

                db.exec(`
                    BEGIN TRANSACTION;
                    
                    -- Drop temporary table if it exists from a previous failed attempt
                    DROP TABLE IF EXISTS brands_new;
                    
                    CREATE TABLE brands_new (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        name TEXT NOT NULL,
                        type TEXT CHECK(type IN ('Frame', 'Lens', 'Spectacle Lens', 'Accessory', 'Service', 'Glass', 'Sunglasses', 'Contact Lens', 'All Categories')) NOT NULL,
                        remarks TEXT, 
                        active INTEGER DEFAULT 1, 
                        shop_id INTEGER REFERENCES shops(id),
                        branch_id INTEGER DEFAULT 1, 
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    
                    INSERT INTO brands_new (id, name, type, remarks, active, shop_id, branch_id, created_at, updated_at)
                    SELECT id, name, type, remarks, active, shop_id, branch_id, created_at, updated_at FROM brands;
                    
                    DROP TABLE brands;
                    ALTER TABLE brands_new RENAME TO brands;
                    
                    COMMIT;
                `);

                console.log("[DB] Migrated brands table constraint (v11 -> v12)");
            } catch (err) {
                try { db.exec('ROLLBACK'); } catch (e) { }
                console.warn("[DB] Migration warning (brands table):", err.message);
            } finally {
                // Re-enable foreign keys
                db.pragma('foreign_keys = ON');
            }
        }

        // initCore must run before seedData so the shops table exists when seeded
        // v15: add barcode column to lenses, contact_lenses, accessories
        if (dbVersion >= 14) {
            const lensCols = db.prepare("PRAGMA table_info(lenses)").all().map(c => c.name);
            if (!lensCols.includes('barcode')) db.exec("ALTER TABLE lenses ADD COLUMN barcode TEXT");

            const clCols = db.prepare("PRAGMA table_info(contact_lenses)").all().map(c => c.name);
            if (!clCols.includes('barcode')) db.exec("ALTER TABLE contact_lenses ADD COLUMN barcode TEXT");

            const accCols = db.prepare("PRAGMA table_info(accessories)").all().map(c => c.name);
            if (!accCols.includes('barcode')) db.exec("ALTER TABLE accessories ADD COLUMN barcode TEXT");
        }

        initCore(db, 1);
        const defaultShopId = seedData(db);
        initInventory(db, defaultShopId);
        initTransactions(db, defaultShopId);
        initItems(db);
        initSettings(db, defaultShopId);
        initIndexes(db);
        initFabrication(db);
        db.pragma(`user_version = ${CURRENT_VERSION}`);
    }

    global._sqliteInitialized = true;
    return db;
}
