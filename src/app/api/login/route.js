import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDb from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// Fail-fast: no hardcoded fallback
const JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("[SECURITY] JWT_SECRET is not set.");
    return secret;
})();

export async function POST(req) {
    // ── Rate Limiting ──
    const limiter = rateLimit(req, { windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "login" });
    if (!limiter.success) return limiter.response;

    try {
        const { email, password, rememberMe } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Try to get user from database
        let user;
        try {
            const db = getDb();
            user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        } catch (dbError) {
            console.error("Database error during login:", dbError);
            return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 });
        }

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check if account is active
        if (user.active !== 1) {
            return NextResponse.json({ error: "Your account is inactive. Please contact your administrator." }, { status: 403 });
        }

        // Check if account is expired
        if (user.expires_at) {
            const expiryDate = new Date(user.expires_at);
            if (expiryDate < new Date()) {
                return NextResponse.json({
                    error: "Your account has expired. Please contact your administrator to renew your access.",
                    expired: true,
                    expiresAt: user.expires_at
                }, { status: 403 });
            }
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role, shopId: user.shop_id, branchId: user.branch_id },
            JWT_SECRET,
            { expiresIn: "15m" } // Short-lived access token
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_SECRET, // Using same secret for simplicity, or could use a different one
            { expiresIn: rememberMe ? "7d" : "2h" } // Refresh token matches the intended session length
        );

        const response = NextResponse.json({
            token: accessToken, // Frontend still gets the access token
            user: { id: user.id, email: user.email, name: user.name, role: user.role, shopId: user.shop_id, branchId: user.branch_id },
        });

        // Set the refresh token in a secure HttpOnly cookie
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: rememberMe ? 7 * 24 * 60 * 60 : 2 * 60 * 60, // 7 days or 2 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
