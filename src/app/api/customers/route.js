import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET all customers
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");
    const db = getDb();
    const customers = db.prepare(`
      SELECT 
        id,
        local_id as localId,
        first_name as firstName,
        last_name as lastName,
        phone,
        mobile,
        email,
        address,
        created_at as createdAt,
        updated_at as updatedAt
      FROM customers
      WHERE shop_id = ?
      ORDER BY created_at DESC
    `).all(shopId);

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST create new customer
export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, mobile, email, address, shopId, user } = body;

    if (!firstName || !mobile || !shopId) {
      return NextResponse.json(
        { error: "First name, mobile, and shop context are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const nextLocalIdResult = db.prepare("SELECT COALESCE(MAX(local_id), 0) + 1 as nextId FROM customers WHERE shop_id = ?").get(shopId);
    const localId = nextLocalIdResult.nextId;

    const result = db.prepare(`
      INSERT INTO customers (first_name, last_name, phone, mobile, email, address, shop_id, local_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(firstName, lastName || null, phone || null, mobile, email || null, address || null, shopId, localId);

    const customerId = result.lastInsertRowid;

    const newCustomer = db.prepare(`
      SELECT 
        id,
        local_id as localId,
        first_name as firstName,
        last_name as lastName,
        phone,
        mobile,
        email,
        address,
        created_at as createdAt
      FROM customers 
      WHERE id = ?
    `).get(customerId);

    // Log activity
    if (user) {
      logActivity(db, {
        shopId,
        branchId: body.branchId || (user ? user.branchId : null),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "create",
        entityType: "customer",
        entityId: newCustomer.id,
        entityName: `${firstName} ${lastName || ""}`.trim(),
        changes: newCustomer
      });
    }

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
