import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * @file auth.js
 * @description Centralized authentication & authorization utilities.
 * 
 * Fail-fast: throws on startup if JWT_SECRET is missing.
 * Every protected API route should call verifyAuth(req) first.
 */

// ── JWT Secret (fail-fast, no fallback) ──────────────────────────
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            "[SECURITY] JWT_SECRET environment variable is not set. " +
            "The application cannot start without it. " +
            "Set it in your .env or .env.local file."
        );
    }
    return secret;
}

const JWT_SECRET = getJwtSecret();

// ── Token Verification ───────────────────────────────────────────

/**
 * Verify the Authorization header and return the decoded JWT payload.
 * @param {Request} req - The incoming Next.js request
 * @returns {{ id, email, name, role, shopId, branchId } | NextResponse}
 *   Returns decoded payload on success, or a NextResponse (401) on failure.
 */
export function verifyAuth(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 }
        );
    }
}

/**
 * Check if verifyAuth returned an error response (NextResponse) or valid data.
 * @param {object} authResult - The return value of verifyAuth
 * @returns {boolean} true if authResult is an error response
 */
export function isAuthError(authResult) {
    return authResult instanceof NextResponse;
}

// ── Role-Based Access Control ────────────────────────────────────

/**
 * Check if the decoded user has one of the allowed roles.
 * @param {object} decoded - Decoded JWT payload
 * @param {...string} roles - Allowed roles (e.g. 'super-admin', 'admin')
 * @returns {boolean}
 */
export function requireRole(decoded, ...roles) {
    return roles.includes(decoded.role);
}

/**
 * IDOR Protection: Check if the user is allowed to access the requested shop.
 * Super-admins bypass this check (they can access any shop).
 * @param {object} decoded - Decoded JWT payload
 * @param {string|number} requestedShopId - The shopId from the request
 * @returns {boolean}
 */
export function requireShop(decoded, requestedShopId) {
    if (decoded.role === "super-admin") return true;
    if (!requestedShopId) return true; // no shop filter requested
    return String(decoded.shopId) === String(requestedShopId);
}

/**
 * Helper: create a 403 Forbidden response.
 */
export function forbiddenResponse(message = "Access denied") {
    return NextResponse.json({ error: message }, { status: 403 });
}
