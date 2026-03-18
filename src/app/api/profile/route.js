import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import getDb, { query } from "@/lib/db";
import { verifyAuth, isAuthError } from "@/lib/auth";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;

    try {
        const db = getDb();
        const user = db.prepare("SELECT id, name, email, role, shop_id as shopId, branch_id as branchId, expires_at as expiresAt, validity_type as validityType, created_at as createdAt FROM users WHERE id = ?").get(auth.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile GET error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PATCH(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;

    try {
        const { name, email, currentPassword, newPassword } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        const db = getDb();

        // Check if email is already taken by another user
        const existingUser = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, auth.id);
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // Handle password update if provided
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: "Current password is required to set a new one" }, { status: 400 });
            }

            const user = db.prepare("SELECT password FROM users WHERE id = ?").get(auth.id);

            const validPassword = await bcrypt.compare(currentPassword, user.password);

            if (!validPassword) {
                return NextResponse.json({ error: "Invalid current password" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashedPassword, auth.id);
        }

        db.prepare("UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
            .run(name, email, auth.id);

        const updatedUser = db.prepare("SELECT id, name, email, role, shop_id as shopId, branch_id as branchId, expires_at as expiresAt, validity_type as validityType FROM users WHERE id = ?").get(auth.id);

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile PATCH error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
