import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError } from "@/lib/auth";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    
    try {
        const db = getDb();
        
        let shops;
        if (auth.role === 'super-admin') {
            shops = db.prepare(`
                SELECT 
                    id, 
                    name, 
                    slug,
                    CASE WHEN active = 1 THEN 'Active' ELSE 'Inactive' END as status,
                    created_at as createdAt
                FROM shops
                ORDER BY created_at DESC
            `).all();
        } else if (auth.shopId) {
            shops = db.prepare(`
                SELECT 
                    id, 
                    name, 
                    slug,
                    CASE WHEN active = 1 THEN 'Active' ELSE 'Inactive' END as status,
                    created_at as createdAt
                FROM shops
                WHERE id = ?
                ORDER BY created_at DESC
            `).all(auth.shopId);
        } else {
            shops = [];
        }

        return NextResponse.json(shops);
    } catch (error) {
        console.error("Error fetching shops for user:", error);
        return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
    }
}
