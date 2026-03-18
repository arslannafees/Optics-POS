import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError } from "@/lib/auth";

// GET daily stats for fabrication dashboard
export async function GET(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");

    const db = getDb();
    const today = new Date().toISOString().split('T')[0];

    const shopCondition = shopId ? "AND shop_id = ?" : "";
    const shopParam = shopId ? [parseInt(shopId)] : [];

    const totalByStatus = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM fabrication_jobs
      WHERE 1=1 ${shopCondition}
      GROUP BY status
    `).all(...shopParam);

    const completedToday = db.prepare(`
      SELECT COUNT(*) as count
      FROM fabrication_jobs
      WHERE DATE(completed_at) = ? ${shopCondition}
    `).get(today, ...shopParam);

    const pendingToday = db.prepare(`
      SELECT COUNT(*) as count
      FROM fabrication_jobs
      WHERE DATE(created_at) = ? AND status NOT IN ('done', 'flagged') ${shopCondition}
    `).get(today, ...shopParam);

    const rushJobs = db.prepare(`
      SELECT COUNT(*) as count
      FROM fabrication_jobs
      WHERE priority = 'rush' AND status NOT IN ('done', 'flagged') ${shopCondition}
    `).get(...shopParam);

    const flaggedJobs = db.prepare(`
      SELECT COUNT(*) as count
      FROM fabrication_jobs
      WHERE status = 'flagged' ${shopCondition}
    `).get(...shopParam);

    const statusMap = {};
    totalByStatus.forEach(row => { statusMap[row.status] = row.count; });

    return NextResponse.json({
      today: today,
      completedToday: completedToday?.count || 0,
      pendingToday: pendingToday?.count || 0,
      rushActive: rushJobs?.count || 0,
      flagged: flaggedJobs?.count || 0,
      byStatus: {
        queued: statusMap['queued'] || 0,
        cutting: statusMap['cutting'] || 0,
        mounting: statusMap['mounting'] || 0,
        qc: statusMap['qc'] || 0,
        done: statusMap['done'] || 0,
        flagged: statusMap['flagged'] || 0,
      },
      totalActive: (statusMap['queued'] || 0) + (statusMap['cutting'] || 0) + (statusMap['mounting'] || 0) + (statusMap['qc'] || 0),
    });
  } catch (error) {
    console.error("Error fetching fabrication stats:", error);
    return NextResponse.json({ error: "Failed to fetch fabrication stats" }, { status: 500 });
  }
}
