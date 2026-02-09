import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import getDb, { query } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "opticofy-secret-key-2024";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const db = getDb();
        const user = db.prepare("SELECT id, name, email, role, shop_id as shopId, branch_id as branchId, expires_at as expiresAt, validity_type as validityType, created_at as createdAt FROM users WHERE id = ?").get(decoded.id);

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
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const { name, email, currentPassword, newPassword } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        const db = getDb();

        // Check if email is already taken by another user
        const existingUser = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, decoded.id);
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // Handle password update if provided
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: "Current password is required to set a new one" }, { status: 400 });
            }

            const user = db.prepare("SELECT password FROM users WHERE id = ?").get(decoded.id);

            const validPassword = await bcrypt.compare(currentPassword, user.password);

            if (!validPassword) {
                return NextResponse.json({ error: "Invalid current password" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashedPassword, decoded.id);
        }

        db.prepare("UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
            .run(name, email, decoded.id);

        const updatedUser = db.prepare("SELECT id, name, email, role, shop_id as shopId, branch_id as branchId, expires_at as expiresAt, validity_type as validityType FROM users WHERE id = ?").get(decoded.id);

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile PATCH error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
