import { NextResponse } from "next/server";
import getDb from "@/lib/db";

import bcrypt from "bcryptjs";

export async function DELETE(req, props) {
    try {
        const params = await props.params;
        const { id } = params;
        const db = getDb();

        // Check if user exists
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        // Countermeasure: Prevent leaving system without any Super Admin
        if (user.role === 'super-admin') {
            const superAdminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'super-admin'").get().count;
            if (superAdminCount <= 1) {
                return NextResponse.json({ error: "System must have at least one Super Admin account" }, { status: 403 });
            }
        }

        db.prepare("DELETE FROM users WHERE id = ?").run(id);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

export async function PUT(req, props) {
    try {
        const params = await props.params;
        const { id } = params;
        const { name, email, password, role, active, shopId, branchId, validity, validityMode, expiresAt: customExpiresAt } = await req.json();

        const db = getDb();
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate expires_at if validity is provided
        let expiresAt = customExpiresAt;
        if (validity) {
            if (validity === 'keep_current') {
                // Don't modify expires_at - keep the current value
                expiresAt = undefined;
            } else if (validity === 'permanent') {
                expiresAt = null;
            } else {
                let baseDate = new Date();

                // If extending, use the later of (current expiry, now) as the base
                if (validityMode === 'extend' && user.expires_at) {
                    const currentExpiry = new Date(user.expires_at);
                    if (currentExpiry > baseDate) {
                        baseDate = currentExpiry;
                    }
                }

                if (validity === '7days') {
                    baseDate.setDate(baseDate.getDate() + 7);
                } else if (validity === '14days') {
                    baseDate.setDate(baseDate.getDate() + 14);
                } else if (validity === '30days') {
                    baseDate.setDate(baseDate.getDate() + 30);
                } else if (validity === '6months') {
                    baseDate.setMonth(baseDate.getMonth() + 6);
                } else if (validity === '12months') {
                    baseDate.setFullYear(baseDate.getFullYear() + 1);
                }
                expiresAt = baseDate.toISOString();
            }
        }

        // Validate shopId for non-super-admins
        const newRole = role || user.role;
        if (newRole !== 'super-admin' && !shopId && (role || shopId !== undefined)) {
            // Only enforce if role or shopId is being changed/provided
            if (!user.shop_id && !shopId) {
                return NextResponse.json({ error: "Shop selection is required for this role" }, { status: 400 });
            }
        }

        // Countermeasure: Prevent deactivating or demoting the last active Super Admin
        if ((active === 0 || (role && role !== 'super-admin')) && user.role === 'super-admin') {
            const activeSuperAdminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'super-admin' AND active = 1").get().count;
            if (activeSuperAdminCount <= 1) {
                const action = active === 0 ? "deactivate" : "downgrade";
                return NextResponse.json({ error: `Cannot ${action} the last active Super Admin` }, { status: 403 });
            }
        }

        // Build query dynamically based on provided fields
        const updates = [];
        const values = [];

        if (name) {
            updates.push("name = ?");
            values.push(name);
        }
        if (email) {
            updates.push("email = ?");
            values.push(email);
        }
        if (role) {
            updates.push("role = ?");
            values.push(role);
        }
        if (shopId !== undefined) {
            updates.push("shop_id = ?");
            values.push(shopId);
        }
        if (branchId !== undefined) {
            updates.push("branch_id = ?");
            values.push(branchId);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push("password = ?");
            values.push(hashedPassword);
        }
        if (active !== undefined) {
            updates.push("active = ?");
            values.push(active);
        }
        if (expiresAt !== undefined) {
            updates.push("expires_at = ?");
            values.push(expiresAt);
        }
        if (validity && validity !== 'keep_current') {
            updates.push("validity_type = ?");
            values.push(validity);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        values.push(id);

        const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
        db.prepare(sql).run(...values);

        return NextResponse.json({ message: "User updated successfully" });
    } catch (error) {
        if (error.message?.includes("UNIQUE constraint failed: users.email")) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
