import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req) {
    const limiter = rateLimit(req, { windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "verify-creator" });
    if (!limiter.success) return limiter.response;

    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;

    try {
        const { pin } = await req.json();

        if (!pin) {
            return NextResponse.json({ error: "PIN is required" }, { status: 400 });
        }

        const db = getDb();
        const creatorPinRecord = db.prepare("SELECT value FROM settings WHERE key = ?").get('creator_pin');

        if (!creatorPinRecord) {
            // This should theoretically not happen if db init worked, but good to handle
            return NextResponse.json({ error: "Creator PIN not configured" }, { status: 500 });
        }

        const isValid = (pin === creatorPinRecord.value);

        return NextResponse.json({ valid: isValid });
    } catch (error) {
        console.error("Error verifying creator PIN:", error);
        return NextResponse.json({ error: "Failed to verify PIN" }, { status: 500 });
    }
}
