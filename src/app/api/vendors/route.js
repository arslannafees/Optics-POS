import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

// GET all vendors
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
        id,
        local_id as localId,
        name,
        company,
        contact_person as contactPerson,
        phone,
        email,
        address,
        city,
        gst_number as gstNumber,
        pan_number as panNumber,
        balance,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt
      FROM vendors
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

    const vendors = db.prepare(query).all(...params);

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

// POST create new vendor
export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const body = await req.json();
    const {
      name, company, contactPerson, phone, email,
      address, city, gstNumber, panNumber, balance = 0,
      remarks, active = true, branchId, user
    } = body;

    // SECURITY: Enforce tenant isolation — use JWT shopId, ignore body shopId
    const shopId = body.shopId || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

    if (!name || !shopId) {
      return NextResponse.json(
        { error: "Vendor name and shop context are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const nextLocalIdResult = db.prepare("SELECT COALESCE(MAX(local_id), 0) + 1 as nextId FROM vendors WHERE shop_id = ?").get(shopId);
    const localId = nextLocalIdResult.nextId;

    const result = db.prepare(`
      INSERT INTO vendors (
        name, company, contact_person, phone, email, 
        address, city, gst_number, pan_number, balance, 
        remarks, active, branch_id, shop_id, local_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      company || null,
      contactPerson || null,
      phone || null,
      email || null,
      address || null,
      city || null,
      gstNumber || null,
      panNumber || null,
      parseFloat(balance) || 0,
      remarks || null,
      active ? 1 : 0,
      branchId || 1,
      shopId,
      localId
    );

    const newVendor = db.prepare(`
      SELECT 
        id,
        local_id as localId,
        name,
        company,
        contact_person as contactPerson,
        phone,
        email,
        address,
        city,
        gst_number as gstNumber,
        pan_number as panNumber,
        balance,
        remarks,
        active,
        created_at as createdAt,
        shop_id as shopId,
        branch_id as branchId
      FROM vendors 
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
        entityType: "vendor",
        entityId: newVendor.id,
        entityName: name,
        changes: newVendor
      });
    }

    return NextResponse.json(newVendor, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
