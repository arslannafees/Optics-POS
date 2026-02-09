import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDb from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "opticofy-secret-key-2024";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

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

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, shopId: user.shop_id, branchId: user.branch_id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, shopId: user.shop_id, branchId: user.branch_id },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
