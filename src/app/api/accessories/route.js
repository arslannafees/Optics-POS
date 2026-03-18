import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

// GET all accessories
export async function GET(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get("shopId") || auth.shopId;
        if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");
        const branchId = searchParams.get("branchId");
        const db = getDb();

        let query = `
            SELECT 
                a.id,
                a.name,
                a.brand_id,
                b.name as brand,
                a.cost,
                a.price,
                a.barcode,
                a.stock,
                a.remarks,
                a.accessory_type,
                a.active,
                a.created_at as createdAt,
                a.branch_id
            FROM accessories a
            LEFT JOIN brands b ON a.brand_id = b.id
        `;

        let args = [];
        let conditions = [];

        if (!shopId) {
            return NextResponse.json([]);
        }

        conditions.push("a.shop_id = ?");
        args.push(shopId);

        if (branchId && branchId !== "All") {
            conditions.push("a.branch_id = ?");
            args.push(branchId);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        query += ` ORDER BY a.created_at DESC `;
        const accessories = db.prepare(query).all(...args);

        return NextResponse.json(accessories);
    } catch (error) {
        console.error("Error fetching accessories:", error);
        return NextResponse.json({ error: "Failed to fetch accessories" }, { status: 500 });
    }
}

// POST create new accessory
export async function POST(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    try {
        const body = await req.json();
        const {
            name,
            accessoryType,
            brandId,
            barcode,
            cost,
            price,
            stock,
            remarks,
            branchId,
            active = true,
            user
        } = body;

        // SECURITY: Enforce tenant isolation — use JWT shopId, ignore body shopId
        const shopId = body.shopId || auth.shopId;
        if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

        if (!name || !shopId) {
            return NextResponse.json(
                { error: "Accessory name and shop context are required" },
                { status: 400 }
            );
        }

        const db = getDb();
        const result = db
            .prepare(
                `
      INSERT INTO accessories (name, accessory_type, brand_id, barcode, cost, price, stock, remarks, branch_id, shop_id, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
            )
            .run(
                name,
                accessoryType || null,
                brandId || null,
                barcode || null,
                parseFloat(cost) || 0,
                parseFloat(price) || 0,
                parseInt(stock) || 0,
                remarks || null,
                branchId || 1,
                shopId,
                active ? 1 : 0
            );

        const newAccessory = db.prepare(`
            SELECT 
                a.id,
                a.name,
                a.brand_id,
                b.name as brand_name,
                a.cost,
                a.price,
                a.stock,
                a.remarks,
                a.accessory_type,
                a.active,
                a.created_at as createdAt,
                a.branch_id as branchId,
                a.shop_id as shopId
            FROM accessories a
            LEFT JOIN brands b ON a.brand_id = b.id
            WHERE a.id = ?
        `).get(result.lastInsertRowid);

        // Log activity
        if (user) {
            logActivity(db, {
                shopId,
                branchId: branchId || 1,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: "create",
                entityType: "accessory",
                entityId: newAccessory.id,
                entityName: name,
                changes: newAccessory
            });
        }

        return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
    } catch (error) {
        console.error("Error creating accessory:", error);
        return NextResponse.json(
            { error: "Failed to create accessory" },
            { status: 500 }
        );
    }
}
