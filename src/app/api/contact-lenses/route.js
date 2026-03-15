import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET all contact lenses
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get("shopId");
        const branchId = searchParams.get("branchId");
        const db = getDb();

        // Base query
        let query = `
      SELECT 
        cl.id,
        brand_name as brand,
        cl.name,
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
        cl.color,
        cost,
        price,
        cl.barcode,
        stock,
        remarks,
        cl.active,
        cl.created_at as createdAt,
        cl.updated_at as updatedAt,
        cl.shop_id as shopId,
        cl.branch_id as branchId,
        branches.name as branchName
      FROM contact_lenses cl
      LEFT JOIN branches ON cl.branch_id = branches.id
    `;

        const params = [];
        const conditions = [];

        if (!shopId) {
            return NextResponse.json([]);
        }

        conditions.push("cl.shop_id = ?");
        params.push(shopId);

        if (branchId && branchId !== "All") {
            conditions.push("cl.branch_id = ?");
            params.push(branchId);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        query += ` ORDER BY cl.created_at DESC`;

        const contactLenses = db.prepare(query).all(...params);

        return NextResponse.json(contactLenses);
    } catch (error) {
        console.error("Error fetching contact lenses:", error);
        return NextResponse.json({ error: "Failed to fetch contact lenses" }, { status: 500 });
    }
}

// POST create new contact lens
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            brand, name, type, replacementSchedule, baseCurve,
            diameter, waterContent, material, sph, cyl, axis,
            addPower, dominance, uvProtection, oxygenPermeability,
            eyeSide, expiryDate, color, barcode, cost, price,
            stock, remarks, active = true, branchId, shopId, user
        } = body;

        if (!name || !shopId) {
            return NextResponse.json(
                { error: "Contact lens name and shop context are required" },
                { status: 400 }
            );
        }

        const db = getDb();
        const result = db.prepare(`
      INSERT INTO contact_lenses (
        brand_name, name, type, replacement_schedule, base_curve,
        diameter, water_content, material, sph, cyl, axis,
        add_power, dominance, uv_protection, oxygen_permeability,
        eye_side, expiry_date, color, barcode, cost, price,
        stock, remarks, active, branch_id, shop_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            barcode || null,
            parseFloat(cost) || 0,
            parseFloat(price) || 0,
            parseInt(stock) || 0,
            remarks || null,
            active ? 1 : 0,
            branchId || 1,
            shopId
        );

        const newContactLens = db.prepare(`
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
        barcode,
        cost,
        price,
        stock,
        remarks,
        active,
        created_at as createdAt,
        shop_id as shopId,
        branch_id as branchId
      FROM contact_lenses
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
                entityType: "contact_lens",
                entityId: newContactLens.id,
                entityName: `${brand || ""} ${name}`.trim(),
                changes: newContactLens
            });
        }

        return NextResponse.json(newContactLens, { status: 201 });
    } catch (error) {
        console.error("Error creating contact lens:", error);
        return NextResponse.json({ error: "Failed to create contact lens" }, { status: 500 });
    }
}
