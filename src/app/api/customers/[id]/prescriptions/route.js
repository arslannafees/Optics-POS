import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError } from "@/lib/auth";

// GET all prescriptions for a specific customer
export async function GET(req, { params }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { id } = await params;
    const db = getDb();

    const prescriptions = db.prepare(`
      SELECT 
        p.id,
        p.order_id as orderId,
        p.customer_id as customerId,
        o.order_date as date,
        p.right_sph as rightSph, p.right_cyl as rightCyl, p.right_axis as rightAxis, p.right_add as rightAdd,
        p.right_prism as rightPrism, p.right_diameter as rightDiameter, p.right_base_curve as rightBaseCurve, 
        p.right_segment as rightSegment, p.right_pd as rightPupillaryDistance,
        p.left_sph as leftSph, p.left_cyl as leftCyl, p.left_axis as leftAxis, p.left_add as leftAdd,
        p.left_prism as leftPrism, p.left_diameter as leftDiameter, p.left_base_curve as leftBaseCurve, 
        p.left_segment as leftSegment, p.left_pd as leftPupillaryDistance,
        p.remarks, p.pd_type as pdType, p.total_pd as totalPd,
        p.created_at as createdAt
      FROM prescriptions p
      JOIN orders o ON p.order_id = o.id
      WHERE p.customer_id = ?
      ORDER BY o.order_date DESC, p.created_at DESC
    `).all(id);

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}
