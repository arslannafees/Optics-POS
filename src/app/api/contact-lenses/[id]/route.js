import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET single contact lens by ID
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const db = getDb();

        const contactLens = db.prepare(`
      SELECT 
        id,
        brand_name as brand,
        name,
        type,
        replacement_schedule as replacementSchedule,
        base_curve as baseCurve,
        diameter,
        water_content as waterContent,
        material,
        sph,
        cyl,
        axis,
        add_power as addPower,
        dominance,
        uv_protection as uvProtection,
        oxygen_permeability as oxygenPermeability,
        eye_side as eyeSide,
        expiry_date as expiryDate,
        color,
        cost,
        price,
        stock,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt,
        shop_id as shopId,
        branch_id as branchId
      FROM contact_lenses 
      WHERE id = ?
    `).get(id);

        if (!contactLens) {
            return NextResponse.json({ error: "Contact lens not found" }, { status: 404 });
        }

        return NextResponse.json(contactLens);
    } catch (error) {
        console.error("Error fetching contact lens:", error);
        return NextResponse.json({ error: "Failed to fetch contact lens" }, { status: 500 });
    }
}

// PUT update contact lens
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            brand, name, type, replacementSchedule, baseCurve,
            diameter, waterContent, material, sph, cyl, axis,
            addPower, dominance, uvProtection, oxygenPermeability,
            eyeSide, expiryDate, color, cost, price,
            stock, remarks, active, user
        } = body;

        const db = getDb();

        // Check if contact lens exists and get old data
        const oldLens = db.prepare("SELECT * FROM contact_lenses WHERE id = ?").get(id);
        if (!oldLens) {
            return NextResponse.json({ error: "Contact lens not found" }, { status: 404 });
        }

        db.prepare(`
      UPDATE contact_lenses 
      SET brand_name = ?,
          name = ?,
          type = ?,
          replacement_schedule = ?,
          base_curve = ?,
          diameter = ?,
          water_content = ?,
          material = ?,
          sph = ?,
          cyl = ?,
          axis = ?,
          add_power = ?,
          dominance = ?,
          uv_protection = ?,
          oxygen_permeability = ?,
          eye_side = ?,
          expiry_date = ?,
          color = ?,
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
            replacementSchedule || null,
            baseCurve || null,
            diameter || null,
            waterContent || null,
            material || null,
            sph || null,
            cyl || null,
            axis || null,
            addPower || null,
            dominance || null,
            uvProtection ? 1 : 0,
            oxygenPermeability || null,
            eyeSide || null,
            expiryDate || null,
            color || null,
            parseFloat(cost) || 0,
            parseFloat(price) || 0,
            parseInt(stock) || 0,
            remarks || null,
            active ? 1 : 0,
            id
        );

        const updatedContactLens = db.prepare(`
      SELECT 
        id,
        brand_name as brand,
        name,
        type,
        replacement_schedule as replacementSchedule,
        base_curve as baseCurve,
        diameter,
        water_content as waterContent,
        color,
        cost,
        price,
        stock,
        remarks,
        active,
        created_at as createdAt,
        updated_at as updatedAt,
        shop_id as shopId,
        branch_id as branchId
      FROM contact_lenses 
      WHERE id = ?
    `).get(id);

        // Log activity
        if (user && oldLens) {
            logActivity(db, {
                shopId: updatedContactLens.shopId,
                branchId: updatedContactLens.branchId,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: "update",
                entityType: "contact_lens",
                entityId: updatedContactLens.id,
                entityName: `${brand || ""} ${name}`.trim(),
                changes: {
                    old: {
                        brand: oldLens.brand_name,
                        name: oldLens.name,
                        type: oldLens.type,
                        replacementSchedule: oldLens.replacement_schedule,
                        baseCurve: oldLens.base_curve,
                        diameter: oldLens.diameter,
                        waterContent: oldLens.water_content,
                        material: oldLens.material,
                        color: oldLens.color,
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
                        replacementSchedule,
                        baseCurve,
                        diameter,
                        waterContent,
                        material,
                        color,
                        cost,
                        price,
                        stock,
                        remarks,
                        active: !!active
                    }
                }
            });
        }

        return NextResponse.json(updatedContactLens);
    } catch (error) {
        console.error("Error updating contact lens:", error);
        return NextResponse.json({ error: "Failed to update contact lens" }, { status: 500 });
    }
}

// DELETE contact lens
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        let user = null;
        try {
            const body = await req.json();
            user = body.user;
        } catch (e) { /* ignore */ }

        const db = getDb();

        // Check if contact lens exists
        const oldLens = db.prepare("SELECT * FROM contact_lenses WHERE id = ?").get(id);
        if (!oldLens) {
            return NextResponse.json({ error: "Contact lens not found" }, { status: 404 });
        }

        db.prepare("DELETE FROM contact_lenses WHERE id = ?").run(id);

        // Log activity
        if (user && oldLens) {
            logActivity(db, {
                shopId: oldLens.shop_id,
                branchId: oldLens.branch_id,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: "delete",
                entityType: "contact_lens",
                entityId: oldLens.id,
                entityName: `${oldLens.brand_name || ""} ${oldLens.name}`.trim(),
                changes: {
                    brand: oldLens.brand_name,
                    name: oldLens.name,
                    type: oldLens.type,
                    replacementSchedule: oldLens.replacement_schedule,
                    baseCurve: oldLens.base_curve,
                    diameter: oldLens.diameter,
                    waterContent: oldLens.water_content,
                    material: oldLens.material,
                    color: oldLens.color,
                    cost: oldLens.cost,
                    price: oldLens.price,
                    stock: oldLens.stock,
                    remarks: oldLens.remarks,
                    active: !!oldLens.active
                }
            });
        }

        return NextResponse.json({ message: "Contact lens deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact lens:", error);
        return NextResponse.json({ error: "Failed to delete contact lens" }, { status: 500 });
    }
}
