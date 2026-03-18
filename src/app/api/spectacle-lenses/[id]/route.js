import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError } from "@/lib/auth";

// GET single lens by ID
export async function GET(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;
    const db = getDb();

    const lens = db.prepare(`
      SELECT 
        id,
        brand_name as brand,
        name,
        type,
        material,
        coating,
        cost,
        price,
        stock,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt
      FROM lenses 
      WHERE id = ?
    `).get(id);

    if (!lens) {
      return NextResponse.json({ error: "Lens not found" }, { status: 404 });
    }

    return NextResponse.json(lens);
  } catch (error) {
    console.error("Error fetching lens:", error);
    return NextResponse.json({ error: "Failed to fetch lens" }, { status: 500 });
  }
}

// PUT update lens
export async function PUT(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;
    const body = await req.json();
    const { brand, name, type, material, coating, cost, price, stock, remarks, active, user } = body;

    const db = getDb();

    // Check if lens exists and get old data
    const oldLens = db.prepare("SELECT * FROM lenses WHERE id = ?").get(id);
    if (!oldLens) {
      return NextResponse.json({ error: "Lens not found" }, { status: 404 });
    }

    db.prepare(`
      UPDATE lenses 
      SET brand_name = ?,
          name = ?,
          type = ?,
          material = ?,
          coating = ?,
          cost = ?,
          price = ?,
          stock = ?,
          remarks = ?,
          active = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      brand || null,
      name,
      type || null,
      material || null,
      coating || null,
      parseFloat(cost) || 0,
      parseFloat(price) || 0,
      parseInt(stock) || 0,
      remarks || null,
      active ? 1 : 0,
      id
    );

    const updatedLens = db.prepare(`
      SELECT 
        id,
        brand_name as brand,
        name,
        type,
        material,
        coating,
        cost,
        price,
        stock,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt,
        shop_id as shopId,
        branch_id as branchId
      FROM lenses 
      WHERE id = ?
    `).get(id);

    // Log activity
    if (user && oldLens) {
      logActivity(db, {
        shopId: updatedLens.shopId,
        branchId: updatedLens.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "spectacle_lens",
        entityId: updatedLens.id,
        entityName: `${brand || ""} ${name}`.trim(),
        changes: {
          old: {
            brand: oldLens.brand_name,
            name: oldLens.name,
            type: oldLens.type,
            material: oldLens.material,
            coating: oldLens.coating,
            cost: oldLens.cost,
            price: oldLens.price,
            stock: oldLens.stock,
            remarks: oldLens.remarks,
            active: !!oldLens.active
          },
          new: {
            brand,
            name,
            type,
            material,
            coating,
            cost,
            price,
            stock,
            remarks,
            active: !!active
          }
        }
      });
    }

    return NextResponse.json(updatedLens);
  } catch (error) {
    console.error("Error updating lens:", error);
    return NextResponse.json({ error: "Failed to update lens" }, { status: 500 });
  }
}

// DELETE lens
export async function DELETE(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;

    let user = null;
    try {
      const body = await req.json();
      user = body.user;
    } catch (e) { /* ignore */ }

    const db = getDb();

    // Check if lens exists
    const lens = db.prepare("SELECT * FROM lenses WHERE id = ?").get(id);
    if (!lens) {
      return NextResponse.json({ error: "Lens not found" }, { status: 404 });
    }

    db.prepare("DELETE FROM lenses WHERE id = ?").run(id);

    // Log activity
    if (user && lens) {
      logActivity(db, {
        shopId: lens.shop_id,
        branchId: lens.branch_id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "delete",
        entityType: "spectacle_lens",
        entityId: lens.id,
        entityName: `${lens.brand_name || ""} ${lens.name}`.trim(),
        changes: {
          brand: lens.brand_name,
          name: lens.name,
          type: lens.type,
          material: lens.material,
          coating: lens.coating,
          cost: lens.cost,
          price: lens.price,
          stock: lens.stock,
          remarks: lens.remarks,
          active: !!lens.active
        }
      });
    }

    return NextResponse.json({ message: "Lens deleted successfully" });
  } catch (error) {
    console.error("Error deleting lens:", error);
    return NextResponse.json({ error: "Failed to delete lens" }, { status: 500 });
  }
}
