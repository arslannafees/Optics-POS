import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError } from "@/lib/auth";

// GET single branch by ID
export async function GET(req, { params }) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    try {
        const { id } = await params;
        const db = getDb();

        const branch = db.prepare("SELECT * FROM branches WHERE id = ?").get(id);

        if (!branch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }

        return NextResponse.json(branch);
    } catch (error) {
        console.error("Error fetching branch:", error);
        return NextResponse.json({ error: "Failed to fetch branch" }, { status: 500 });
    }
}

// PUT update branch
export async function PUT(req, { params }) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, address, phone, user } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: "Branch name is required" }, { status: 400 });
        }

        const db = getDb();

        // Check if branch exists and get old data
        const oldBranch = db.prepare("SELECT * FROM branches WHERE id = ?").get(id);
        if (!oldBranch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }

        // Check if name is already taken by another branch
        const nameConflict = db.prepare("SELECT id FROM branches WHERE name = ? AND id != ?").get(name.trim(), id);
        if (nameConflict) {
            return NextResponse.json({ error: "Branch name already exists" }, { status: 400 });
        }

        db.prepare(`
      UPDATE branches 
      SET name = ?, address = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(name.trim(), address || '', phone || '', id);

        const branch = db.prepare("SELECT * FROM branches WHERE id = ?").get(id);

        // Log activity
        if (user && oldBranch) {
            logActivity(db, {
                shopId: branch.shop_id,
                branchId: branch.id,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: "update",
                entityType: "branch",
                entityId: branch.id,
                entityName: branch.name,
                changes: {
                    old: {
                        name: oldBranch.name,
                        address: oldBranch.address,
                        phone: oldBranch.phone,
                        active: !!oldBranch.active
                    },
                    new: {
                        name: branch.name,
                        address: branch.address,
                        phone: branch.phone,
                        active: !!branch.active
                    }
                }
            });
        }

        return NextResponse.json(branch);
    } catch (error) {
        console.error("Error updating branch:", error);
        return NextResponse.json({ error: "Failed to update branch" }, { status: 500 });
    }
}

// DELETE branch
export async function DELETE(req, { params }) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    try {
        const { id } = await params;

        let user = null;
        try {
            const body = await req.json();
            user = body.user;
        } catch (e) { /* ignore */ }

        const db = getDb();

        // Check if branch exists
        const branch = db.prepare("SELECT * FROM branches WHERE id = ?").get(id);
        if (!branch) {
            return NextResponse.json({ error: "Branch not found" }, { status: 404 });
        }

        // Check if branch has associated orders
        const ordersCount = db.prepare("SELECT COUNT(*) as count FROM orders WHERE branch_id = ?").get(id);
        if (ordersCount.count > 0) {
            return NextResponse.json({
                error: `Cannot delete branch. It has ${ordersCount.count} order(s) associated with it.`
            }, { status: 400 });
        }

        // Check if branch has associated purchases
        const purchasesCount = db.prepare("SELECT COUNT(*) as count FROM purchases WHERE branch_id = ?").get(id);
        if (purchasesCount.count > 0) {
            return NextResponse.json({
                error: `Cannot delete branch. It has ${purchasesCount.count} purchase(s) associated with it.`
            }, { status: 400 });
        }

        // Soft delete - just mark as inactive
        db.prepare("UPDATE branches SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);

        // Log activity
        if (user && branch) {
            logActivity(db, {
                shopId: branch.shop_id,
                branchId: branch.id,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: "delete",
                entityType: "branch",
                entityId: branch.id,
                entityName: branch.name,
                changes: {
                    name: branch.name,
                    address: branch.address,
                    phone: branch.phone,
                    active: !!branch.active
                }
            });
        }

        return NextResponse.json({ success: true, message: "Branch deleted successfully" });
    } catch (error) {
        console.error("Error deleting branch:", error);
        return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 });
    }
}
