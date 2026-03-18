import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

// GET all fabrication jobs with optional filters
export async function GET(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const limit = parseInt(searchParams.get("limit") || "200");

    const db = getDb();

    let query = `
      SELECT
        fj.id,
        fj.order_id as orderId,
        fj.shop_id as shopId,
        fj.branch_id as branchId,
        fj.status,
        fj.priority,
        fj.patient_name as patientName,
        fj.frame_info as frameInfo,
        fj.lens_info as lensInfo,
        fj.prescription_data as prescriptionData,
        fj.optician_notes as opticianNotes,
        fj.fabricator_notes as fabricatorNotes,
        fj.flag_reason as flagReason,
        fj.completed_at as completedAt,
        fj.created_at as createdAt,
        fj.updated_at as updatedAt,
        o.local_id as orderLocalId,
        o.order_type as orderType,
        o.delivery_date as deliveryDate,
        COALESCE(b.name, 'Main Branch') as branchName
      FROM fabrication_jobs fj
      LEFT JOIN orders o ON fj.order_id = o.id
      LEFT JOIN branches b ON fj.branch_id = b.id
    `;

    const params = [];
    const conditions = [];

    if (orderId) {
      conditions.push("fj.order_id = ?");
      params.push(parseInt(orderId));
    }
    if (shopId) {
      conditions.push("fj.shop_id = ?");
      params.push(parseInt(shopId));
    }
    if (status && status !== "all") {
      if (status === "active") {
        conditions.push("fj.status NOT IN ('done', 'flagged')");
      } else {
        conditions.push("fj.status = ?");
        params.push(status);
      }
    }
    if (priority) {
      conditions.push("fj.priority = ?");
      params.push(priority);
    }
    if (fromDate) {
      conditions.push("DATE(fj.created_at) >= ?");
      params.push(fromDate);
    }
    if (toDate) {
      conditions.push("DATE(fj.created_at) <= ?");
      params.push(toDate);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY fj.priority DESC, fj.created_at DESC LIMIT ?";
    params.push(limit);

    const jobs = db.prepare(query).all(...params);

    // Parse JSON fields and provide fallbacks
    const parsed = jobs.map(j => {
      const lensInfo = j.lensInfo ? JSON.parse(j.lensInfo) : null;
      const frameInfo = j.frameInfo ? JSON.parse(j.frameInfo) : null;
      
      // If lensInfo is missing but this is an order that might have items, 
      // the detail page will fetch them anyway. For the list view, we just ensure
      // the structure is consistent for the frontend mapping.
      
      return {
        ...j,
        frameInfo,
        lensInfo,
        prescriptionData: j.prescriptionData ? JSON.parse(j.prescriptionData) : null,
      };
    });

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching fabrication jobs:", error);
    return NextResponse.json({ error: "Failed to fetch fabrication jobs" }, { status: 500 });
  }
}

// POST manually create a fabrication job
export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const body = await req.json();
    const { orderId, branchId, priority, patientName, frameInfo, lensInfo, prescriptionData, opticianNotes } = body;

    // SECURITY: Enforce tenant isolation — use JWT shopId, ignore body shopId
    const shopId = body.shopId || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const db = getDb();

    // Check if a job already exists for this order
    const existing = db.prepare("SELECT id FROM fabrication_jobs WHERE order_id = ?").get(orderId);
    if (existing) {
      return NextResponse.json({ error: "A fabrication job already exists for this order", existingId: existing.id }, { status: 409 });
    }

    const result = db.prepare(`
      INSERT INTO fabrication_jobs (order_id, shop_id, branch_id, status, priority, patient_name, frame_info, lens_info, prescription_data, optician_notes)
      VALUES (?, ?, ?, 'queued', ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      shopId ? parseInt(shopId) : null,
      branchId ? parseInt(branchId) : null,
      priority || 'normal',
      patientName || null,
      frameInfo ? JSON.stringify(frameInfo) : null,
      lensInfo ? JSON.stringify(lensInfo) : null,
      prescriptionData ? JSON.stringify(prescriptionData) : null,
      opticianNotes || null
    );

    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error("Error creating fabrication job:", error);
    return NextResponse.json({ error: "Failed to create fabrication job" }, { status: 500 });
  }
}
