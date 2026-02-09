/**
 * Log an activity to the activity_logs table
 * @param {Object} db - Database instance
 * @param {Object} params - Activity parameters
 * @param {number} params.shopId - Shop ID
 * @param {number} [params.branchId] - Branch ID (optional)
 * @param {number} [params.userId] - User ID
 * @param {string} [params.userName] - User name
 * @param {string} [params.userRole] - User role
 * @param {string} params.action - Action type: 'create', 'update', 'delete'
 * @param {string} params.entityType - Entity type: 'customer', 'order', 'prescription', 'frame', 'lens', 'contact_lens', 'accessory', 'brand', 'vendor', 'purchase'
 * @param {number} [params.entityId] - Entity ID
 * @param {string} [params.entityName] - Entity name/display name
 * @param {Object} [params.changes] - Object containing old and new values for update actions
 */
export function logActivity(db, {
    shopId,
    branchId = null,
    userId = null,
    userName = null,
    userRole = null,
    action,
    entityType,
    entityId = null,
    entityName = null,
    changes = null
}) {
    try {
        const changesJson = changes ? JSON.stringify(changes) : null;

        // Perform basic validation to prevent foreign key constraint failures
        let validShopId = shopId || null;
        let validBranchId = branchId || null;
        let validUserId = userId || null;

        if (validShopId) {
            const exists = db.prepare("SELECT id FROM shops WHERE id = ?").get(validShopId);
            if (!exists) validShopId = null;
        }

        if (validBranchId) {
            const exists = db.prepare("SELECT id FROM branches WHERE id = ?").get(validBranchId);
            if (!exists) validBranchId = null;
        }

        if (validUserId) {
            const exists = db.prepare("SELECT id FROM users WHERE id = ?").get(validUserId);
            if (!exists) validUserId = null;
        }

        db.prepare(`
      INSERT INTO activity_logs (shop_id, branch_id, user_id, user_name, user_role, action, entity_type, entity_id, entity_name, changes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            validShopId,
            validBranchId,
            validUserId,
            userName || null,
            userRole || null,
            action,
            entityType,
            entityId || null,
            entityName || null,
            changesJson
        );
    } catch (error) {
        // Log error but don't fail the main operation
        console.error('Failed to log activity:', error);
    }
}

export default logActivity;
