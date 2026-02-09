import { db } from './connection';
import { applyPragmas } from './config';
import { initCore } from './schema/core';
import { initInventory } from './schema/inventory';
import { initTransactions } from './schema/transactions';
import { initItems } from './schema/items';
import { initSettings } from './schema/settings';
import { initIndexes } from './schema/indexes';
import { seedData } from './schema/seed';

const CURRENT_VERSION = 11;

export function initialize() {
    if (global._sqliteInitialized) return db;

    applyPragmas();
    const dbVersion = db.pragma('user_version', { simple: true });

    if (dbVersion < CURRENT_VERSION) {
        console.log(`[DB] Initialize/Migrate (v${dbVersion} -> v${CURRENT_VERSION})...`);
        const defaultShopId = seedData(db);
        initCore(db, defaultShopId);
        initInventory(db, defaultShopId);
        initTransactions(db, defaultShopId);
        initItems(db);
        initSettings(db, defaultShopId);
        initIndexes(db);
        db.pragma(`user_version = ${CURRENT_VERSION}`);
    }

    global._sqliteInitialized = true;
    return db;
}
