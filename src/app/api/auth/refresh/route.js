import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import getDb from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
        }

        let payload;
        try {
            payload = jwt.verify(refreshToken, JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
        }

        const db = getDb();
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(payload.id);

        if (!user || user.active !== 1) {
            return NextResponse.json({ error: "User not found or inactive" }, { status: 403 });
        }

        // Check expiry if needed (already verified by jwt.verify)
        
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role, shopId: user.shop_id, branchId: user.branch_id },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        return NextResponse.json({ token: accessToken });
    } catch (error) {
        console.error("Token refresh error:", error);
        return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
    }
}
