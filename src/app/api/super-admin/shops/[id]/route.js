import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError, requireRole, forbiddenResponse } from "@/lib/auth";

export async function DELETE(req, props) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
    const params = await props.params;
    try {
        const { id } = params;
        const db = getDb();

        // Check if shop exists
        const shop = db.prepare("SELECT * FROM shops WHERE id = ?").get(id);
        if (!shop) {
            return NextResponse.json({ error: "Shop not found" }, { status: 404 });
        }

        // Perform cascading delete in a transaction
        const deleteTransaction = db.transaction(() => {
            // 1. Delete transactional data (Orders, Purchases)
            // Note: Items and prescriptions cascade from these if configured, but let's be safe
            // However, our schema says ON DELETE CASCADE for items relying on orders/purchases
            // So deleting the parent records should suffice if FK names match.
            // But orders/purchases themselves don't cascade from shops in the schema (no ON DELETE CASCADE on shop_id).

            db.prepare("DELETE FROM orders WHERE shop_id = ?").run(id);
            db.prepare("DELETE FROM purchases WHERE shop_id = ?").run(id);

            // 2. Delete Inventory (Frames, Lenses, Accessories)
            // Safe to delete these directly by shop_id
            db.prepare("DELETE FROM frames WHERE shop_id = ?").run(id);
            db.prepare("DELETE FROM lenses WHERE shop_id = ?").run(id);
            db.prepare("DELETE FROM accessories WHERE shop_id = ?").run(id);

            // 3. Delete Brands (Parents of inventory, but we deleted inventory above to be safe/thorough)
            db.prepare("DELETE FROM brands WHERE shop_id = ?").run(id);

            // 4. Delete People/Entities
            db.prepare("DELETE FROM customers WHERE shop_id = ?").run(id);
            db.prepare("DELETE FROM vendors WHERE shop_id = ?").run(id);
            db.prepare("DELETE FROM users WHERE shop_id = ?").run(id);

            // 5. Delete Config/Settings
            db.prepare("DELETE FROM settings WHERE shop_id = ?").run(id);

            // 6. Delete Shop Structure
            db.prepare("DELETE FROM branches WHERE shop_id = ?").run(id);

            // 7. Finally, delete the shop
            db.prepare("DELETE FROM shops WHERE id = ?").run(id);
        });

        deleteTransaction();

        return NextResponse.json({ message: "Shop and all associated data deleted successfully" });
    } catch (error) {
        console.error("Error deleting shop:", error);
        return NextResponse.json({ error: "Failed to delete shop: " + error.message }, { status: 500 });
    }
}

export async function PUT(req, props) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
    const params = await props.params;
    try {
        const { id } = params;
        const { active, name } = await req.json();

        const db = getDb();

        if (active !== undefined) {
            db.prepare("UPDATE shops SET active = ? WHERE id = ?").run(active, id);
        } else if (name) {
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            db.prepare("UPDATE shops SET name = ?, slug = ? WHERE id = ?").run(name, slug, id);
        }

        return NextResponse.json({ message: "Shop updated successfully" });
    } catch (error) {
        console.error("Error updating shop:", error);
        return NextResponse.json({ error: "Failed to update shop" }, { status: 500 });
    }
}
