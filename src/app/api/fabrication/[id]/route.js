import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError } from "@/lib/auth";

// GET single fabrication job with full order + prescription details
export async function GET(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;
    const db = getDb();

    const job = db.prepare(`
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
        o.notes as orderNotes,
        o.customer_name as customerName,
        COALESCE(b.name, 'Main Branch') as branchName
      FROM fabrication_jobs fj
      LEFT JOIN orders o ON fj.order_id = o.id
      LEFT JOIN branches b ON fj.branch_id = b.id
      WHERE fj.id = ?
    `).get(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Fetch order items with full inventory details joined in
    // Explicitly exclude non-prescription items like contact lenses and accessories
    const rawItems = db.prepare(`
      SELECT item_type as itemType, item_id as itemId, item_name as itemName, quantity, price, total, prescription_data as prescriptionData
      FROM order_items 
      WHERE order_id = ? 
      AND item_type IN ('frame', 'frame_only', 'lens', 'spectacle_lens', 'spectacle-lens', 'spectacle_lenses', 'spectacle-lenses')
    `).all(job.orderId);

    const items = rawItems.map(item => {
      let detail = null;
      if (item.itemType === 'frame' && item.itemId) {
        detail = db.prepare(`
          SELECT brand_name, model, color, material, shape, size, category, remarks
          FROM frames WHERE id = ?
        `).get(item.itemId);
      } else if ((item.itemType === 'lens' || item.itemType === 'spectacle_lens') && item.itemId) {
        detail = db.prepare(`
          SELECT brand_name, name, type, material, coating, remarks
          FROM lenses WHERE id = ?
        `).get(item.itemId);
      }
      return { ...item, detail: detail || null };
    });

    // Fetch prescription from prescriptions table as well
    const prescription = db.prepare(`
      SELECT * FROM prescriptions WHERE order_id = ? LIMIT 1
    `).get(job.orderId);

    // Fetch job history logs
    const logs = db.prepare(`
      SELECT id, status, note, updated_by_name as updatedByName, created_at as createdAt
      FROM fabrication_job_logs
      WHERE job_id = ?
      ORDER BY created_at ASC
    `).all(id);

    return NextResponse.json({
      ...job,
      frameInfo: job.frameInfo ? JSON.parse(job.frameInfo) : null,
      lensInfo: job.lensInfo ? JSON.parse(job.lensInfo) : null,
      prescriptionData: job.prescriptionData ? JSON.parse(job.prescriptionData) : null,
      items: items.map(i => ({ ...i, prescriptionData: i.prescriptionData ? JSON.parse(i.prescriptionData) : null })),
      prescription: prescription || null,
      logs,
    });
  } catch (error) {
    console.error("Error fetching fabrication job:", error);
    return NextResponse.json({ error: "Failed to fetch fabrication job" }, { status: 500 });
  }
}

// PATCH update job status, notes, or flag
export async function PATCH(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, fabricatorNotes, flagReason, priority, user } = body;

    const db = getDb();

    const job = db.prepare("SELECT id, status FROM fabrication_jobs WHERE id = ?").get(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updates = [];
    const values = [];

    if (status) {
      updates.push("status = ?");
      values.push(status);
      if (status === 'done') {
        updates.push("completed_at = CURRENT_TIMESTAMP");
      }
    }
    if (fabricatorNotes !== undefined) {
      updates.push("fabricator_notes = ?");
      values.push(fabricatorNotes);
    }
    if (flagReason !== undefined) {
      updates.push("flag_reason = ?");
      values.push(flagReason);
    }
    if (priority) {
      updates.push("priority = ?");
      values.push(priority);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    db.prepare(`UPDATE fabrication_jobs SET ${updates.join(", ")} WHERE id = ?`).run(...values);

    // Log status change
    if (status || fabricatorNotes !== undefined || flagReason !== undefined) {
      db.prepare(`
        INSERT INTO fabrication_job_logs (job_id, status, note, updated_by, updated_by_name)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        id,
        status || job.status,
        fabricatorNotes || flagReason || null,
        user?.id || null,
        user?.name || null
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating fabrication job:", error);
    return NextResponse.json({ error: "Failed to update fabrication job" }, { status: 500 });
  }
}
