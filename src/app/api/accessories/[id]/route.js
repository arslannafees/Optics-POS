import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET single accessory
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const db = getDb();

        const accessory = db.prepare(`
      SELECT 
        a.id,
        a.name,
        a.brand_id as brandId,
        b.name as brand,
        a.cost,
        a.price,
        a.stock,
        a.remarks,
        a.accessory_type as accessoryType,
        a.active,
        a.created_at as createdAt,
        a.updated_at as updatedAt
      FROM accessories a
      LEFT JOIN brands b ON a.brand_id = b.id
      WHERE a.id = ?
    `).get(id);

        if (!accessory) {
            return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
        }

        return NextResponse.json(accessory);
    } catch (error) {
        console.error("Error fetching accessory:", error);
        return NextResponse.json({ error: "Failed to fetch accessory" }, { status: 500 });
    }
}

// PUT update accessory
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, accessoryType, brandId, cost, price, stock, remarks, active, user } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Accessory name is required" },
                { status: 400 }
            );
        }

        const db = getDb();

        // Check if accessory exists and get old data
        const oldAccessory = db.prepare(`
            SELECT 
                a.id,
                a.name,
                a.brand_id as brandId,
                b.name as brand_name,
                a.cost,
                a.price,
                a.stock,
                a.remarks,
                a.accessory_type as accessoryType,
                a.active,
                a.created_at as createdAt,
                a.shop_id as shopId,
                a.branch_id as branchId
            FROM accessories a
            LEFT JOIN brands b ON a.brand_id = b.id
            WHERE a.id = ?
        `).get(id);

        if (!oldAccessory) {
            return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
        }

        db.prepare(`
      UPDATE accessories 
      SET name = ?, accessory_type = ?, brand_id = ?, cost = ?, price = ?, stock = ?, remarks = ?, active = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
            name,
            accessoryType || null,
            brandId || null,
            parseFloat(cost) || 0,
            parseFloat(price) || 0,
            parseInt(stock) || 0,
            remarks || null,
            active ? 1 : 0,
            id
        );

        const updated = db.prepare(`
      SELECT 
        a.id,
        a.name,
        a.brand_id as brandId,
        b.name as brand,
        a.cost,
        a.price,
        a.stock,
        a.remarks,
        a.accessory_type as accessoryType,
        a.active,
        a.created_at as createdAt,
        a.updated_at as updatedAt,
        a.shop_id as shopId,
        a.branch_id as branchId
      FROM accessories a
      LEFT JOIN brands b ON a.brand_id = b.id
      WHERE a.id = ?
    `).get(id);

        // Log activity
        if (user && oldAccessory) {
            logActivity(db, {
                shopId: updated.shopId,
                branchId: updated.branchId,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: "update",
                entityType: "accessory",
                entityId: updated.id,
                entityName: name,
                changes: {
                    old: {
                        name: oldAccessory.name,
                        type: oldAccessory.accessoryType,
                        brand: oldAccessory.brand_name,
                        cost: oldAccessory.cost,
                        price: oldAccessory.price,
                        stock: oldAccessory.stock,
                        remarks: oldAccessory.remarks,
                        active: !!oldAccessory.active
                    },
                    new: {
                        name,
                        type: accessoryType,
                        brandId,
                        cost,
                        price,
                        stock,
                        remarks,
                        active: !!active
                    }
                }
            });
        }

        if (!updated) {
            return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating accessory:", error);
        return NextResponse.json({ error: "Failed to update accessory" }, { status: 500 });
    }
}

// DELETE accessory
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        let user = null;
        try {
            const body = await req.json();
            user = body.user;
        } catch (e) { /* ignore */ }

        const db = getDb();

        const accessory = db.prepare("SELECT * FROM accessories WHERE id = ?").get(id);
        if (!accessory) {
            return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
        }

        const result = db.prepare("DELETE FROM accessories WHERE id = ?").run(id);

        if (result.changes === 0) {
            return NextResponse.json({ error: "Accessory not found" }, { status: 404 });
        }

        // Log activity
        if (user && accessory) {
            logActivity(db, {
                shopId: accessory.shop_id,
                branchId: accessory.branch_id,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: "delete",
                entityType: "accessory",
                entityId: accessory.id,
                entityName: accessory.name,
                changes: {
                    name: accessory.name,
                    type: accessory.accessory_type,
                    cost: accessory.cost,
                    price: accessory.price,
                    stock: accessory.stock,
                    remarks: accessory.remarks,
                    active: !!accessory.active
                }
            });
        }

        return NextResponse.json({ message: "Accessory deleted successfully" });
    } catch (error) {
        console.error("Error deleting accessory:", error);
        return NextResponse.json({ error: "Failed to delete accessory" }, { status: 500 });
    }
}
