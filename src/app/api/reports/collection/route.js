import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");
        const orderType = searchParams.get("orderType");
        const branchId = searchParams.get("branchId");
        const shopId = searchParams.get("shopId");

        if (!shopId) {
            return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
        }

        const db = getDb();
        let query = `
      SELECT 
        o.id,
        o.customer_name as customer,
        o.order_date as date,
        o.delivery_date as deliveryDate,
        o.order_type as orderType,
        o.branch_id as branchId,
        COALESCE(b.name, 'Main Branch') as branch,
        o.total,
        o.advance as deposit,
        o.balance,
        o.status
      FROM orders o
      LEFT JOIN branches b ON o.branch_id = b.id
    `;

        const params = [];
        const conditions = [];

        // Add Shop Filter
        conditions.push("o.shop_id = ?");
        params.push(shopId);

        if (fromDate) {
            conditions.push("o.order_date >= ?");
            params.push(fromDate);
        }
        if (toDate) {
            conditions.push("o.order_date <= ?");
            params.push(toDate);
        }
        if (orderType && orderType !== "All") {
            conditions.push("o.order_type = ?");
            params.push(orderType);
        }
        if (branchId && branchId !== "All") {
            conditions.push("o.branch_id = ?");
            params.push(branchId);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY o.order_date DESC";

        const collections = db.prepare(query).all(...params);

        return NextResponse.json(collections);
    } catch (error) {
        console.error("Error fetching collection report:", error);
        return NextResponse.json({ error: "Failed to fetch collection report" }, { status: 500 });
    }
}
