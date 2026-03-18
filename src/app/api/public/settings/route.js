import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(req) {
    try {
        const db = getDb();
        // Fetch only global settings (where shop_id is NULL)
        const settings = db.prepare("SELECT * FROM settings WHERE shop_id IS NULL").all();

        // Convert array to key-value object
        // Do not return sensitive information if any exists globally
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settingsObj);
    } catch (error) {
        console.error("Error fetching public settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}
