import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET all brands
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");
    const branchId = searchParams.get("branchId");
    const db = getDb();

    // Base query
    let query = `
      SELECT 
        id,
        name as brand,
        type,
        remarks,
        active,
        shop_id as shopId,
        branch_id as branchId,
        created_at as createdAt,
        updated_at as updatedAt
      FROM brands
    `;

    const params = [];
    const conditions = [];

    if (shopId) {
      conditions.push("shop_id = ?");
      params.push(shopId);
    }
    if (branchId && branchId !== "All") {
      conditions.push("branch_id = ?");
      params.push(branchId);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY created_at DESC`;

    const brands = db.prepare(query).all(...params);

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

// POST create new brand
export async function POST(req) {
  try {
    const body = await req.json();
    const { brand, type, remarks, active = true, branchId, shopId, user } = body;

    if (!brand || !type || !shopId) {
      return NextResponse.json(
        { error: "Brand name, type, and shop context are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO brands (name, type, remarks, active, branch_id, shop_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(brand, type, remarks || null, active ? 1 : 0, branchId || 1, shopId);

    const newBrand = db.prepare(`
      SELECT 
        id,
        name as brand,
        type,
        remarks,
        active,
        shop_id as shopId,
        branch_id as branchId,
        created_at as createdAt
      FROM brands 
      WHERE id = ?
    `).get(result.lastInsertRowid);

    // Log activity
    if (user) {
      logActivity(db, {
        shopId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "create",
        entityType: "brand",
        entityId: newBrand.id,
        entityName: brand,
        changes: newBrand
      });
    }

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
