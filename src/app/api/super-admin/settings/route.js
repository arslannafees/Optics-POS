import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError, requireRole, forbiddenResponse } from "@/lib/auth";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
    try {
        const db = getDb();
        const settings = db.prepare("SELECT * FROM settings WHERE shop_id IS NULL").all();

        // Convert array to key-value object
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settingsObj);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
    try {
        const db = getDb();
        const updates = await req.json();

        const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value, shop_id, updated_at) VALUES (?, ?, NULL, CURRENT_TIMESTAMP)");

        const transaction = db.transaction((data) => {
            for (const [key, value] of Object.entries(data)) {
                stmt.run(key, String(value));
            }
        });

        transaction(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
