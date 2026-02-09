/**
 * @file indexes.js
 * @description Performance optimization indexes.
 */

export function initIndexes(db) {
    const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_users_shop ON users(shop_id)',
        'CREATE INDEX IF NOT EXISTS idx_customers_shop ON customers(shop_id)',
        'CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile)',
        'CREATE INDEX IF NOT EXISTS idx_branches_shop ON branches(shop_id)',
        'CREATE INDEX IF NOT EXISTS idx_brands_shop ON brands(shop_id)',
        'CREATE INDEX IF NOT EXISTS idx_frames_shop_stock ON frames(shop_id, stock)',
        'CREATE INDEX IF NOT EXISTS idx_frames_brand ON frames(brand_id)',
        'CREATE INDEX IF NOT EXISTS idx_lenses_shop_stock ON lenses(shop_id, stock)',
        'CREATE INDEX IF NOT EXISTS idx_accessories_shop ON accessories(shop_id, branch_id)',
        'CREATE INDEX IF NOT EXISTS idx_orders_shop_branch ON orders(shop_id, branch_id)',
        'CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id)',
        'CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)',
        'CREATE INDEX IF NOT EXISTS idx_settings_shop ON settings(shop_id)',
        'CREATE INDEX IF NOT EXISTS idx_activity_logs_context ON activity_logs(shop_id, branch_id, created_at)'
    ];

    for (const sql of indexes) {
        db.exec(sql);
    }
}
