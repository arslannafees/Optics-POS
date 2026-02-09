import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET() {
    try {
        const db = getDb();
        const settings = db.prepare("SELECT * FROM settings").all();

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
    try {
        const db = getDb();
        const updates = await req.json();

        const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");

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
