import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError, requireRole, forbiddenResponse } from "@/lib/auth";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
    try {
        const db = getDb();

        const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
        const totalBranches = db.prepare("SELECT COUNT(*) as count FROM branches").get().count;
        // For now, shops and branches are the same count since they use the same table
        // In a more complex multi-tenant setup, shops might be parent entities.
        const totalShops = totalBranches;

        return NextResponse.json({
            totalAccounts: totalUsers,
            totalShops: totalShops,
            totalBranches: totalBranches
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
