import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

// GET all lenses
export async function GET(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");
    const branchId = searchParams.get("branchId");
    const db = getDb();

    // Base query
    let query = `
      SELECT 
        lenses.id,
        brand_name as brand,
        lenses.name,
        type,
        material,
        coating,
        cost,
        price,
        barcode,
        stock,
        remarks,
        lenses.active,
        lenses.created_at as createdAt,
        lenses.updated_at as updatedAt,
        lenses.shop_id as shopId,
        lenses.branch_id as branchId,
        branches.name as branchName
      FROM lenses
      LEFT JOIN branches ON lenses.branch_id = branches.id
    `;

    const params = [];
    const conditions = [];

    if (!shopId) {
      return NextResponse.json([]);
    }

    conditions.push("lenses.shop_id = ?");
    params.push(shopId);

    if (branchId && branchId !== "All") {
      conditions.push("lenses.branch_id = ?");
      params.push(branchId);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY lenses.created_at DESC`;

    const lenses = db.prepare(query).all(...params);

    return NextResponse.json(lenses);
  } catch (error) {
    console.error("Error fetching lenses:", error);
    return NextResponse.json({ error: "Failed to fetch spectacle lenses" }, { status: 500 });
  }
}

// POST create new lens
export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const body = await req.json();
    const { brand, name, type, material, coating, cost, price, barcode, stock, remarks, active = true, branchId, user } = body;

    // SECURITY: Enforce tenant isolation — use JWT shopId, ignore body shopId
    const shopId = body.shopId || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

    if (!name || !shopId) {
      return NextResponse.json(
        { error: "Spectacle lens name and shop context are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO lenses (brand_name, name, type, material, coating, cost, price, barcode, stock, remarks, active, branch_id, shop_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      brand || null,
      name,
      type || null,
      material || null,
      coating || null,
      parseFloat(cost) || 0,
      parseFloat(price) || 0,
      barcode || null,
      parseInt(stock) || 0,
      remarks || null,
      active ? 1 : 0,
      branchId || 1,
      shopId
    );

    const newLens = db.prepare(`
      SELECT 
        id,
        brand_name as brand,
        name,
        type,
        material,
        coating,
        cost,
        price,
        barcode,
        stock,
        remarks,
        active,
        created_at as createdAt,
        shop_id as shopId,
        branch_id as branchId
      FROM lenses
      WHERE id = ?
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
        entityType: "spectacle_lens",
        entityId: newLens.id,
        entityName: `${brand || ""} ${name}`.trim(),
        changes: newLens
      });
    }

    return NextResponse.json(newLens, { status: 201 });
  } catch (error) {
    console.error("Error creating lens:", error);
    return NextResponse.json({ error: "Failed to create spectacle lens" }, { status: 500 });
  }
}
