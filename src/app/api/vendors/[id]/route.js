import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET single vendor by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const vendor = db.prepare(`
      SELECT 
        id,
        name,
        company,
        email,
        phone,
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
      WHERE id = ?
    `).get(id);

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 });
  }
}

// PUT update vendor
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, company, email, phone, address, city, gstNumber, panNumber, balance, remarks, active, user } = body;

    const db = getDb();

    // Check if vendor exists
    const oldVendor = db.prepare("SELECT * FROM vendors WHERE id = ?").get(id);
    if (!oldVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    db.prepare(`
      UPDATE vendors 
      SET name = ?,
          company = ?,
          email = ?,
          phone = ?,
          address = ?,
          city = ?,
          gst_number = ?,
          pan_number = ?,
          balance = ?,
          remarks = ?,
          active = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name,
      company || null,
      email || null,
      phone || null,
      address || null,
      city || null,
      gstNumber || null,
      panNumber || null,
      parseFloat(balance) || 0,
      remarks || null,
      active !== undefined ? (active ? 1 : 0) : 1,
      id
    );

    const updatedVendor = db.prepare(`
      SELECT 
        id,
        name,
        company,
        email,
        phone,
        address,
        city,
        gst_number as gstNumber,
        pan_number as panNumber,
        balance,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt,
        shop_id as shopId,
        branch_id as branchId
      FROM vendors 
      WHERE id = ?
    `).get(id);

    // Log activity
    if (user && oldVendor) {
      logActivity(db, {
        shopId: updatedVendor.shopId,
        branchId: updatedVendor.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "vendor",
        entityId: updatedVendor.id,
        entityName: name,
        changes: {
          old: {
            name: oldVendor.name,
            company: oldVendor.company,
            email: oldVendor.email,
            phone: oldVendor.phone,
            address: oldVendor.address,
            city: oldVendor.city,
            gstNumber: oldVendor.gst_number,
            panNumber: oldVendor.pan_number,
            balance: oldVendor.balance,
            remarks: oldVendor.remarks,
            active: !!oldVendor.active
          },
          new: {
            name,
            company,
            email,
            phone,
            address,
            city,
            gstNumber,
            panNumber,
            balance,
            remarks,
            active: !!active
          }
        }
      });
    }

    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

// DELETE vendor
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    let user = null;
    try {
      const body = await req.json();
      user = body.user;
    } catch (e) { /* ignore */ }

    const db = getDb();

    // Check if vendor exists
    const vendor = db.prepare("SELECT * FROM vendors WHERE id = ?").get(id);
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Check for related purchases
    const purchaseCount = db.prepare("SELECT COUNT(*) as count FROM purchases WHERE vendor_id = ?").get(id);
    if (purchaseCount.count > 0) {
      return NextResponse.json(
        { error: "Cannot delete vendor with existing purchases" },
        { status: 400 }
      );
    }

    db.prepare("DELETE FROM vendors WHERE id = ?").run(id);

    // Log activity
    if (user && vendor) {
      logActivity(db, {
        shopId: vendor.shop_id,
        branchId: vendor.branch_id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "delete",
        entityType: "vendor",
        entityId: vendor.id,
        entityName: vendor.name,
        changes: {
          name: vendor.name,
          company: vendor.company,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          city: vendor.city,
          gstNumber: vendor.gst_number,
          panNumber: vendor.pan_number,
          balance: vendor.balance,
          remarks: vendor.remarks,
          active: !!vendor.active
        }
      });
    }

    return NextResponse.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
