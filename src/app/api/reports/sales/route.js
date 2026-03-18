import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (isAuthError(auth)) return auth;
    try {
        const { searchParams } = new URL(req.url);
        const branchId = searchParams.get("branchId");
        const orderType = searchParams.get("orderType");
        const customerId = searchParams.get("customerId");
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");
        const itemType = searchParams.get("itemType");
        const itemId = searchParams.get("itemId");
        const shopId = searchParams.get("shopId") || auth.shopId;
        if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

        if (!shopId) {
            return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
        }

        const db = getDb();
        let query = `
      SELECT 
        oi.id as itemId,
        oi.order_id as orderId,
        o.customer_name as customer,
        o.order_date as date,
        o.order_type as orderType,
        COALESCE(b.name, 'Main Branch') as branchName,
        oi.item_type as type,
        oi.item_name as name,
        oi.quantity,
        oi.price,
        oi.total
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN branches b ON o.branch_id = b.id
    `;

        const params = [];
        const conditions = [];

        // Add Shop Filter
        conditions.push("o.shop_id = ?");
        params.push(shopId);

        if (branchId && branchId !== "All") {
            conditions.push("o.branch_id = ?");
            params.push(branchId);
        }
        if (orderType && orderType !== "All") {
            conditions.push("o.order_type = ?");
            params.push(orderType);
        }
        if (customerId && customerId !== "All") {
            conditions.push("o.customer_id = ?");
            params.push(customerId);
        }
        if (fromDate) {
            conditions.push("o.order_date >= ?");
            params.push(fromDate);
        }
        if (toDate) {
            conditions.push("o.order_date <= ?");
            params.push(toDate);
        }
        if (itemType && itemType !== "All") {
            conditions.push("oi.item_type = ?");
            params.push(itemType.toLowerCase());
        }
        if (itemId && itemId !== "All") {
            // Handle potential prefixes from frontend (f-ID, l-ID, a-ID)
            const cleanId = itemId.includes('-') ? itemId.split('-')[1] : itemId;
            conditions.push("oi.item_id = ?");
            params.push(cleanId);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY o.order_date DESC, o.id DESC";

        const data = db.prepare(query).all(...params);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching sales report:", error);
        return NextResponse.json({ error: "Failed to fetch sales report" }, { status: 500 });
    }
}
