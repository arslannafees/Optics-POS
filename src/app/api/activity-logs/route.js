import { NextResponse } from "next/server";
import getDb from "@/lib/db";

// GET activity logs with filtering and pagination
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get("shopId");
        const branchId = searchParams.get("branchId");
        const entityType = searchParams.get("entityType");
        const action = searchParams.get("action");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const userId = searchParams.get("userId");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 50;
        const offset = (page - 1) * limit;

        if (!shopId) {
            return NextResponse.json({ logs: [], total: 0, page, limit, users: [] });
        }

        const db = getDb();

        // Get unique users for this shop/branch context
        let users = [];
        try {
            let usersQuery = `SELECT DISTINCT name FROM users WHERE shop_id = ? AND active = 1`;
            const userParams = [shopId];
            if (branchId && branchId !== "All" && branchId !== "undefined" && branchId !== "null") {
                usersQuery += ` AND branch_id = ?`;
                userParams.push(branchId);
            }
            users = db.prepare(usersQuery).all(...userParams);
        } catch (uErr) {
            console.error("Error fetching users for filter:", uErr);
        }

        let query = `
      SELECT 
        al.id,
        al.shop_id as shopId,
        al.branch_id as branchId,
        b.name as branchName,
        s.name as shopName,
        al.user_id as userId,
        al.user_name as userName,
        al.user_role as userRole,
        al.action,
        al.entity_type as entityType,
        al.entity_id as entityId,
        al.entity_name as entityName,
        al.changes,
        al.created_at as createdAt
      FROM activity_logs al
      LEFT JOIN branches b ON al.branch_id = b.id
      LEFT JOIN shops s ON al.shop_id = s.id
    `;

        const params = [];
        const conditions = ["al.shop_id = ?"];
        params.push(shopId);

        if (branchId && branchId !== "All" && branchId !== "undefined" && branchId !== "null") {
            // Include branch-specific logs OR shop-wide logs (where branch_id is null)
            conditions.push("(al.branch_id = ? OR al.branch_id IS NULL)");
            params.push(branchId);
        }

        if (userId && userId !== "all") {
            conditions.push("al.user_name = ?");
            params.push(userId);
        }

        if (entityType && entityType !== "all") {
            conditions.push("al.entity_type = ?");
            params.push(entityType);
        }

        if (action && action !== "all") {
            conditions.push("al.action = ?");
            params.push(action);
        }

        if (startDate) {
            conditions.push("date(al.created_at) >= date(?)");
            params.push(startDate);
        }

        if (endDate) {
            conditions.push("date(al.created_at) <= date(?)");
            params.push(endDate);
        }

        if (search) {
            conditions.push("(al.user_name LIKE ? OR al.entity_name LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        // Get total count
        const countQuery = query.replace(
            /SELECT[\s\S]*?FROM activity_logs al/,
            "SELECT COUNT(*) as total FROM activity_logs al"
        );
        const totalResult = db.prepare(countQuery).get(...params);
        const total = totalResult?.total || 0;

        // Add ordering and pagination
        query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const logs = db.prepare(query).all(...params);

        // Parse changes JSON and format date for each log
        const parsedLogs = logs.map(log => {
            let changes = null;
            try {
                changes = log.changes ? JSON.parse(log.changes) : null;
            } catch (pErr) {
                console.error("Failed to parse log changes:", pErr);
            }

            let createdAt = log.createdAt;
            if (createdAt && typeof createdAt === 'string') {
                if (!createdAt.includes('T')) {
                    createdAt = createdAt.replace(' ', 'T');
                }
                if (!createdAt.includes('Z')) {
                    createdAt = createdAt + 'Z';
                }
            }

            return {
                ...log,
                changes,
                createdAt
            };
        });

        return NextResponse.json({
            logs: parsedLogs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            users: users.map(u => u.name)
        });
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
    }
}

// DELETE - Clear all activity logs for a shop
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get("shopId");

        if (!shopId) {
            return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
        }

        const db = getDb();

        const result = db.prepare("DELETE FROM activity_logs WHERE shop_id = ?").run(shopId);

        return NextResponse.json({
            message: "Activity logs cleared successfully",
            deleted: result.changes
        });
    } catch (error) {
        console.error("Error clearing activity logs:", error);
        return NextResponse.json({ error: "Failed to clear activity logs" }, { status: 500 });
    }
}
