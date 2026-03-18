import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyAuth, isAuthError, requireRole, forbiddenResponse } from "@/lib/auth";

export async function GET(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
  try {
    const db = getDb();

    // Check if validity_type column exists
    const columns = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
    const hasValidityType = columns.includes('validity_type');

    // Add column if it doesn't exist
    if (!hasValidityType) {
      db.exec("ALTER TABLE users ADD COLUMN validity_type TEXT DEFAULT 'permanent'");
    }

    const users = db.prepare(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role,
        CASE WHEN u.active = 1 THEN 'Active' ELSE 'Inactive' END as status,
        u.active,
        u.shop_id as shopId,
        s.name as shopName,
        u.branch_id as branchId,
        b.name as branchName,
        u.expires_at as expiresAt,
        u.validity_type as validityType,
        u.created_at as createdAt
      FROM users u
      LEFT JOIN shops s ON u.shop_id = s.id
      LEFT JOIN branches b ON u.branch_id = b.id
      ORDER BY u.created_at DESC
    `).all();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
  try {
    const { name, email, password, role, shopId, branchId, validity } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Enforce shopId for non-super-admins
    if (role !== 'super-admin' && !shopId) {
      return NextResponse.json({ error: "Shop selection is required for this role" }, { status: 400 });
    }

    // Calculate expiration date
    let expiresAt = null;
    if (validity && validity !== 'permanent') {
      const now = new Date();
      if (validity === '7days') {
        now.setDate(now.getDate() + 7);
      } else if (validity === '14days') {
        now.setDate(now.getDate() + 14);
      } else if (validity === '30days') {
        now.setDate(now.getDate() + 30);
      } else if (validity === '6months') {
        now.setMonth(now.getMonth() + 6);
      } else if (validity === '12months') {
        now.setFullYear(now.getFullYear() + 1);
      }
      expiresAt = now.toISOString();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role, shop_id, branch_id, expires_at, validity_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, hashedPassword, role, shopId || null, branchId || null, expiresAt, validity || 'permanent');

    return NextResponse.json({
      id: result.lastInsertRowid,
      name,
      email,
      role,
      shopId,
      branchId,
      status: 'Active',
      expiresAt,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed: users.email")) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
