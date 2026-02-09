import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "year";
        const selectedYearParam = searchParams.get("year");
        const db = getDb();

        let startDate, endDate;
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Use selected year if provided, otherwise current year
        const currentYear = now.getFullYear();
        const year = selectedYearParam ? parseInt(selectedYearParam) : currentYear;
        const branchId = searchParams.get("branchId");

        const branchFilter = branchId ? "AND branch_id = ?" : "";
        const branchWhere = branchId ? "WHERE branch_id = ?" : "";
        const branchWhereAnd = branchId ? "AND o.branch_id = ?" : "";
        const branchArgs = branchId ? [branchId] : [];

        if (period === "week") {
            // If historical year, default to first week of that year if not today's year
            const referenceDate = (year === currentYear) ? now : new Date(year, 0, 7);
            const first = referenceDate.getDate() - referenceDate.getDay();
            startDate = new Date(referenceDate.setDate(first)).toISOString().split('T')[0];
            endDate = (year === currentYear) ? today : new Date(year, 0, first + 6).toISOString().split('T')[0];
        } else if (period === "month") {
            // Default to current month if this year, else Jan of historical year
            const month = (year === currentYear) ? now.getMonth() : 0;
            startDate = new Date(year, month, 1).toISOString().split('T')[0];
            endDate = (year === currentYear && month === now.getMonth()) ? today : new Date(year, month + 1, 0).toISOString().split('T')[0];
        } else if (period === "quarter") {
            const quarter = (year === currentYear) ? Math.floor(now.getMonth() / 3) : 0;
            startDate = new Date(year, quarter * 3, 1).toISOString().split('T')[0];
            endDate = (year === currentYear) ? today : new Date(year, (quarter + 1) * 3, 0).toISOString().split('T')[0];
        } else if (period === "year" || /^\d{4}$/.test(period)) {
            startDate = `${year}-01-01`;
            endDate = (year === currentYear) ? today : `${year}-12-31`;
        } else {
            startDate = new Date(year, 0, 1).toISOString().split('T')[0];
            endDate = (year === currentYear) ? today : `${year}-12-31`;
        }

        const baseArgs = [startDate, endDate, ...branchArgs];

        // 1. Basic Stats
        const query = `
            SELECT 
                COALESCE(SUM("total"), 0) as totalRevenue,
                COUNT("id") as totalOrders,
                COUNT(DISTINCT "customer_id") as totalCustomers,
                CASE WHEN COUNT("id") > 0 THEN COALESCE(SUM("total"), 0) / COUNT("id") ELSE 0 END as avgOrderValue
            FROM "orders"
            WHERE "order_date" BETWEEN ? AND ? ${branchFilter}
        `;
        const stats = db.prepare(query).get(...baseArgs);

        // 2. Sales Data
        let salesData = [];
        if (period === "week" || period === "month") {
            const days = period === "week" ? 7 : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let i = 0; i < days; i++) {
                const d = new Date(startDate);
                d.setDate(d.getDate() + i);
                const dayStr = d.toISOString().split('T')[0];
                if (dayStr > today && (period === "week" || period === "month")) break;

                const daySales = db.prepare(`
                    SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
                    FROM orders
                    WHERE order_date = ? ${branchFilter}
                `).get(dayStr, ...branchArgs);

                salesData.push({
                    label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                    revenue: daySales.revenue,
                    orders: daySales.orders
                });
            }
        } else {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            for (let i = 0; i < 12; i++) {
                const monthStr = `${year}-${String(i + 1).padStart(2, '0')}`;
                const monthSales = db.prepare(`
                    SELECT COALESCE(SUM(total), 0) as revenue, COUNT(*) as orders
                    FROM orders
                    WHERE strftime('%Y-%m', order_date) = ? ${branchFilter}
                `).get(monthStr, ...branchArgs);

                salesData.push({
                    month: months[i],
                    revenue: monthSales.revenue,
                    orders: monthSales.orders
                });
            }
        }

        // 3. Top Products
        const topProducts = db.prepare(`
            SELECT 
                oi.item_name as name,
                SUM(oi.quantity) as sales,
                SUM(oi.total) as revenue
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.order_date BETWEEN ? AND ? ${branchWhereAnd}
            GROUP BY oi.item_name
            ORDER BY sales DESC
            LIMIT 5
        `).all(...baseArgs);

        // 4. Category Data
        const categoryDataResult = db.prepare(`
            SELECT 
                oi.item_type as name,
                COUNT(*) as count,
                SUM(oi.total) as revenue
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.order_date BETWEEN ? AND ? ${branchWhereAnd}
            GROUP BY oi.item_type
        `).all(...baseArgs);

        const totalCategoryRevenue = categoryDataResult.reduce((sum, c) => sum + c.revenue, 0);
        const categoryData = categoryDataResult.map(c => ({
            name: c.name ? c.name.charAt(0).toUpperCase() + c.name.slice(1) + (c.name.endsWith('s') ? '' : 's') : 'Unknown',
            value: totalCategoryRevenue > 0 ? Math.round((c.revenue / totalCategoryRevenue) * 100) : 0,
            count: c.count
        }));

        // 5. Get available years range
        const yearRange = db.prepare(`
            SELECT 
                MIN(strftime('%Y', order_date)) as minYear,
                MAX(strftime('%Y', order_date)) as maxYear
            FROM orders
            ${branchWhere}
        `).get(...branchArgs);

        return NextResponse.json({
            stats,
            salesData,
            topProducts,
            categoryData,
            periodInfo: { startDate, endDate },
            availableYears: {
                min: yearRange.minYear || currentYear.toString(),
                max: yearRange.maxYear || currentYear.toString()
            }
        });

    } catch (error) {
        console.error("FULL ANALYTICS ERROR:", error);
        return NextResponse.json({
            error: "Failed to fetch analytics data",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
