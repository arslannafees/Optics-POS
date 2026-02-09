import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET single customer
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const customer = db.prepare(`
      SELECT 
        id,
        first_name as firstName,
        last_name as lastName,
        phone,
        mobile,
        email,
        address,
        created_at as createdAt,
        updated_at as updatedAt
      FROM customers 
      WHERE id = ?
    `).get(id);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

// PUT update customer
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { firstName, lastName, phone, mobile, email, address, user } = body;

    if (!firstName || !mobile) {
      return NextResponse.json(
        { error: "First name and mobile are required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Get old data for logging
    const oldCustomer = db.prepare(`
      SELECT * FROM customers WHERE id = ?
    `).get(id);

    db.prepare(`
      UPDATE customers 
      SET first_name = ?, last_name = ?, phone = ?, mobile = ?, email = ?, address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(firstName, lastName || null, phone || null, mobile, email || null, address || null, id);

    const updated = db.prepare(`
      SELECT 
        id,
        first_name as firstName,
        last_name as lastName,
        phone,
        mobile,
        email,
        address,
        created_at as createdAt,
        updated_at as updatedAt,
        shop_id as shopId
      FROM customers 
      WHERE id = ?
    `).get(id);

    if (!updated) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Log activity
    if (user && oldCustomer) {
      logActivity(db, {
        shopId: updated.shopId,
        branchId: body.branchId || (user ? user.branchId : null),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "customer",
        entityId: updated.id,
        entityName: `${firstName} ${lastName || ""}`.trim(),
        changes: {
          old: {
            firstName: oldCustomer.first_name,
            lastName: oldCustomer.last_name,
            phone: oldCustomer.phone,
            mobile: oldCustomer.mobile,
            email: oldCustomer.email,
            address: oldCustomer.address
          },
          new: {
            firstName,
            lastName,
            phone,
            mobile,
            email,
            address
          }
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

// DELETE customer
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Try to get user from body if provided (optional for delete)
    let user = null;
    try {
      const body = await req.json();
      user = body.user;
    } catch (e) {
      // Body parsing failed or empty, check query params
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const userName = searchParams.get("userName");
      const userRole = searchParams.get("userRole");
      const branchId = searchParams.get("branchId");
      if (userId) {
        user = { id: userId, name: userName, role: userRole, branchId: branchId };
      }
    }

    const db = getDb();

    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);

    const result = db.prepare("DELETE FROM customers WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Log activity
    if (user && customer) {
      logActivity(db, {
        shopId: customer.shop_id,
        branchId: user.branchId || null,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "delete",
        entityType: "customer",
        entityId: customer.id,
        entityName: `${customer.first_name} ${customer.last_name || ""}`.trim(),
        changes: {
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          mobile: customer.mobile,
          email: customer.email,
          address: customer.address
        }
      });
    }

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
