import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET single brand
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const brand = db.prepare(`
      SELECT 
        id,
        name as brand,
        type,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt
      FROM brands 
      WHERE id = ?
    `).get(id);

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json({ error: "Failed to fetch brand" }, { status: 500 });
  }
}

// PUT update brand
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { brand, type, remarks, active, user } = body;

    if (!brand || !type) {
      return NextResponse.json(
        { error: "Brand name and type are required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Get old data
    const oldBrand = db.prepare("SELECT * FROM brands WHERE id = ?").get(id);

    db.prepare(`
      UPDATE brands 
      SET name = ?, type = ?, remarks = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(brand, type, remarks || null, active ? 1 : 0, id);

    const updated = db.prepare(`
      SELECT 
        id,
        name as brand,
        type,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt,
        shop_id as shopId,
        branch_id as branchId
      FROM brands 
      WHERE id = ?
    `).get(id);

    if (!updated) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Log activity
    if (user && oldBrand) {
      logActivity(db, {
        shopId: updated.shopId,
        branchId: updated.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "brand",
        entityId: updated.id,
        entityName: brand,
        changes: {
          old: {
            brand: oldBrand.name,
            type: oldBrand.type,
            remarks: oldBrand.remarks,
            active: !!oldBrand.active
          },
          new: {
            brand,
            type,
            remarks,
            active: !!active
          }
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

// DELETE brand
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Try to get user from body if provided/supported
    let user = null;
    try {
      const body = await req.json();
      user = body.user;
    } catch (e) { /* ignore */ }

    const db = getDb();

    const brand = db.prepare("SELECT * FROM brands WHERE id = ?").get(id);

    const result = db.prepare("DELETE FROM brands WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Log activity
    if (user && brand) {
      logActivity(db, {
        shopId: brand.shop_id,
        branchId: brand.branch_id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "delete",
        entityType: "brand",
        entityId: brand.id,
        entityName: brand.name,
        changes: {
          brand: brand.name,
          type: brand.type,
          remarks: brand.remarks,
          active: !!brand.active
        }
      });
    }

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
