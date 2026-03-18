import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

// GET all frames
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
        frames.id,
        brand_name || ' ' || COALESCE(model, '') as name,
        brand_name as brand,
        model,
        size,
        color,
        material,
        cost,
        price,
        barcode,
        shape,
        stock,
        opening_balance as openingBalance,
        remarks,
        frames.active,
        frames.created_at as createdAt,
        frames.updated_at as updatedAt,
        frames.shop_id as shopId,
        frames.branch_id as branchId,
        branches.name as branchName
      FROM frames
      LEFT JOIN branches ON frames.branch_id = branches.id
    `;

    const params = [];
    const conditions = [];

    if (!shopId) {
      return NextResponse.json([]);
    }

    conditions.push("frames.shop_id = ?");
    params.push(shopId);

    if (branchId && branchId !== "All") {
      conditions.push("frames.branch_id = ?");
      params.push(branchId);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY frames.created_at DESC`;

    const frames = db.prepare(query).all(...params);

    return NextResponse.json(frames);
  } catch (error) {
    console.error("Error fetching frames:", error);
    return NextResponse.json({ error: "Failed to fetch frames" }, { status: 500 });
  }
}

// POST create new frame
export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const body = await req.json();
    const { brand, model, size, color, material, cost, price, barcode, shape, stock, openingBalance, remarks, active = true, branchId, user } = body;

    // SECURITY: Enforce tenant isolation — use JWT shopId, ignore body shopId
    const shopId = body.shopId || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

    if (!brand || !shopId) {
      return NextResponse.json(
        { error: "Brand and shop context are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO frames (brand_name, model, size, color, material, cost, price, barcode, shape, stock, opening_balance, remarks, active, branch_id, shop_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      brand,
      model || null,
      size || null,
      color || null,
      material || null,
      parseFloat(cost) || 0,
      parseFloat(price) || 0,
      barcode || null,
      shape || null,
      parseInt(stock) || 0,
      parseInt(openingBalance) || 0,
      remarks || null,
      active ? 1 : 0,
      branchId || 1,
      shopId
    );

    const newFrame = db.prepare(`
      SELECT 
        id,
        brand_name as brand,
        model,
        size,
        color,
        material,
        cost,
        price,
        barcode,
        shape,
        stock,
        opening_balance as openingBalance,
        remarks,
        active,
        created_at as createdAt,
        shop_id as shopId,
        branch_id as branchId
      FROM frames 
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
        entityType: "frame",
        entityId: newFrame.id,
        entityName: `${brand} ${model || ""}`.trim(),
        changes: newFrame
      });
    }

    return NextResponse.json(newFrame, { status: 201 });
  } catch (error) {
    console.error("Error creating frame:", error);
    return NextResponse.json({ error: "Failed to create frame" }, { status: 500 });
  }
}
