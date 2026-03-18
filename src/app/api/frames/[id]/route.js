import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError } from "@/lib/auth";

// GET single frame
export async function GET(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;
    const db = getDb();

    const frame = db.prepare(`
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
        stock,
        opening_balance as openingBalance,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt
      FROM frames 
      WHERE id = ?
    `).get(id);

    if (!frame) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }

    return NextResponse.json(frame);
  } catch (error) {
    console.error("Error fetching frame:", error);
    return NextResponse.json({ error: "Failed to fetch frame" }, { status: 500 });
  }
}

// PUT update frame
export async function PUT(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;
    const body = await req.json();
    const { brand, model, size, color, material, cost, price, barcode, stock, openingBalance, remarks, active, user } = body;

    if (!brand) {
      return NextResponse.json(
        { error: "Brand is required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Get old data
    const oldFrame = db.prepare("SELECT * FROM frames WHERE id = ?").get(id);

    db.prepare(`
      UPDATE frames 
      SET brand_name = ?, model = ?, size = ?, color = ?, material = ?, cost = ?, price = ?, 
          barcode = ?, stock = ?, opening_balance = ?, remarks = ?, active = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      brand,
      model || null,
      size || null,
      color || null,
      material || null,
      parseFloat(cost) || 0,
      parseFloat(price) || 0,
      barcode || null,
      parseInt(stock) || 0,
      parseInt(openingBalance) || 0,
      remarks || null,
      active ? 1 : 0,
      id
    );

    const updated = db.prepare(`
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
        stock,
        opening_balance as openingBalance,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt,
        shop_id as shopId,
        branch_id as branchId
      FROM frames 
      WHERE id = ?
    `).get(id);

    if (!updated) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }

    // Log activity
    if (user && oldFrame) {
      logActivity(db, {
        shopId: updated.shopId,
        branchId: updated.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "frame",
        entityId: updated.id,
        entityName: `${brand} ${model || ""}`.trim(),
        changes: {
          old: {
            brand: oldFrame.brand_name,
            model: oldFrame.model,
            size: oldFrame.size,
            color: oldFrame.color,
            material: oldFrame.material,
            cost: oldFrame.cost,
            price: oldFrame.price,
            stock: oldFrame.stock,
            barcode: oldFrame.barcode,
            remarks: oldFrame.remarks,
            active: !!oldFrame.active
          },
          new: {
            brand,
            model,
            size,
            color,
            material,
            cost,
            price,
            stock,
            barcode,
            remarks,
            active: !!active
          }
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating frame:", error);
    return NextResponse.json({ error: "Failed to update frame" }, { status: 500 });
  }
}

// DELETE frame
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

    const frame = db.prepare("SELECT * FROM frames WHERE id = ?").get(id);

    const result = db.prepare("DELETE FROM frames WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }

    // Log activity
    if (user && frame) {
      logActivity(db, {
        shopId: frame.shop_id,
        branchId: frame.branch_id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "delete",
        entityType: "frame",
        entityId: frame.id,
        entityName: `${frame.brand_name} ${frame.model || ""}`.trim(),
        changes: {
          brand: frame.brand_name,
          model: frame.model,
          size: frame.size,
          color: frame.color,
          material: frame.material,
          cost: frame.cost,
          price: frame.price,
          stock: frame.stock,
          barcode: frame.barcode,
          remarks: frame.remarks,
          active: !!frame.active
        }
      });
    }

    return NextResponse.json({ message: "Frame deleted successfully" });
  } catch (error) {
    console.error("Error deleting frame:", error);
    return NextResponse.json({ error: "Failed to delete frame" }, { status: 500 });
  }
}
