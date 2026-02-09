import { NextResponse } from "next/server";
import getDb from "@/lib/db";

// GET all branches for a specific shop
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get('shopId');

        if (!shopId) {
            return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
        }

        const db = getDb();
        const branches = db.prepare("SELECT * FROM branches WHERE shop_id = ? AND active = 1 ORDER BY id ASC").all(shopId);
        return NextResponse.json(branches);
    } catch (error) {
        console.error("Error fetching branches:", error);
        return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
    }
}

// POST create new branch
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, address, phone, shopId } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: "Branch name is required" }, { status: 400 });
        }
        if (!shopId) {
            return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
        }

        const db = getDb();

        // Check if branch name already exists for this shop
        const existing = db.prepare("SELECT * FROM branches WHERE shop_id = ? AND name = ?").get(shopId, name.trim());
        if (existing) {
            if (existing.active === 0) {
                // Reactivate inactive branch
                db.prepare(`
                    UPDATE branches 
                    SET active = 1, address = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                `).run(address || '', phone || '', existing.id);

                const reactivatedBranch = db.prepare("SELECT * FROM branches WHERE id = ?").get(existing.id);
                return NextResponse.json(reactivatedBranch, { status: 200 });
            }
            return NextResponse.json({ error: "Branch name already exists in this shop" }, { status: 400 });
        }

        const result = db.prepare(`
      INSERT INTO branches (shop_id, name, address, phone) VALUES (?, ?, ?, ?)
    `).run(shopId, name.trim(), address || '', phone || '');

        const branch = db.prepare("SELECT * FROM branches WHERE id = ?").get(result.lastInsertRowid);

        return NextResponse.json(branch, { status: 201 });
    } catch (error) {
        console.error("Error creating branch:", error);
        return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
    }
}
