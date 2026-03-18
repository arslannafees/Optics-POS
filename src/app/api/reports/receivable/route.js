import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    try {
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get("customerId");
        const searchQuery = searchParams.get("searchQuery");
        const shopId = searchParams.get("shopId") || auth.shopId;
        if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

        if (!shopId) {
            return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
        }

        const db = getDb();

        // Query to get customers with non-zero balances
        // We aggregate the total balance for each customer
        let query = `
            SELECT 
                c.id,
                c.first_name as firstName,
                c.last_name as lastName,
                c.mobile,
                c.phone,
                SUM(o.balance) as balance,
                SUM(o.total) as total,
                SUM(o.advance) as deposit,
                GROUP_CONCAT(o.id) as reference
            FROM customers c
            JOIN orders o ON c.id = o.customer_id
            WHERE o.balance > 0
        `;

        const params = [];

        // Add Shop Filter
        query += " AND o.shop_id = ?";
        params.push(shopId);

        if (customerId) {
            query += " AND c.id = ?";
            params.push(customerId);
        } else if (searchQuery) {
            query += " AND (c.first_name || ' ' || COALESCE(c.last_name, '') LIKE ? OR c.mobile LIKE ? OR c.phone LIKE ?)";
            const searchPattern = `%${searchQuery}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        query += " GROUP BY c.id ORDER BY balance DESC";

        const receivables = db.prepare(query).all(...params);

        return NextResponse.json(receivables);
    } catch (error) {
        console.error("Error fetching receivable report:", error);
        return NextResponse.json({ error: "Failed to fetch receivable report" }, { status: 500 });
    }
}
