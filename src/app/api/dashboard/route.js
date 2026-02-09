import { NextResponse } from "next/server";
import getDb, { query } from "@/lib/db";

// GET dashboard statistics
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('shopId');
    const branchId = searchParams.get('branchId');

    if (!shopId) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    const db = getDb();

    // Filters
    const shopFilter = "shop_id = ?";
    const branchInFilter = branchId && branchId !== "All" ? "AND branch_id = ?" : "";
    const branchWhere = `WHERE shop_id = ? ${branchInFilter}`;
    const branchAndFilter = `AND shop_id = ? ${branchInFilter}`;

    const filterParams = [shopId];
    if (branchId && branchId !== "All") filterParams.push(branchId);

    // Consolidated counts in a single query to reduce overhead
    const counts = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM customers WHERE shop_id = ?) as customers,
        (SELECT COUNT(*) FROM orders WHERE shop_id = ? ${branchInFilter}) as orders,
        (SELECT COUNT(*) FROM frames WHERE shop_id = ?) as frames,
        (SELECT COUNT(*) FROM lenses WHERE shop_id = ?) as lenses,
        (SELECT COUNT(*) FROM contact_lenses WHERE shop_id = ?) as contactLenses,
        (SELECT COUNT(*) FROM accessories WHERE shop_id = ?) as accessories,
        (SELECT COUNT(*) FROM vendors WHERE shop_id = ?) as vendors,
        (SELECT COUNT(*) FROM brands WHERE shop_id = ? AND active = 1) as brands
    `).get(shopId, shopId, ...(branchId && branchId !== "All" ? [branchId] : []), shopId, shopId, shopId, shopId, shopId, shopId);

    const { customers: customerCount, orders: orderCount, frames: frameCount, lenses: lensCount, contactLenses: contactLensCount, accessories: accessoryCount, vendors: vendorCount, brands: brandCount } = counts;

    // Get today's date and calculate date ranges
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    // Calculate last month
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonth = lastMonthDate.toISOString().slice(0, 7);

    // Sales statistics
    const todaySales = query(`
      SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count 
      FROM orders 
      WHERE date(created_at) = date(?) ${branchAndFilter}
    `).get(today, ...filterParams);

    const monthSales = query(`
      SELECT 
        COALESCE(SUM(o.total), 0) as total, 
        COUNT(DISTINCT o.id) as count,
        COALESCE(SUM(oi.quantity), 0) as itemsCount
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE strftime('%Y-%m', o.created_at) = ? ${branchAndFilter}
    `).get(thisMonth, ...filterParams);

    const lastMonthSales = query(`
      SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count 
      FROM orders 
      WHERE strftime('%Y-%m', created_at) = ? ${branchAndFilter}
    `).get(lastMonth, ...filterParams);

    // Calculate growth percentage
    const salesGrowth = lastMonthSales.total > 0
      ? ((monthSales.total - lastMonthSales.total) / lastMonthSales.total * 100).toFixed(1)
      : 0;

    // Pending payments (receivables)
    const pendingPayments = query(`
      SELECT COALESCE(SUM(balance), 0) as total, COUNT(*) as count 
      FROM orders 
      WHERE balance > 0 ${branchAndFilter}
    `).get(...filterParams);

    // Get settings for low stock threshold and currency (Shop specific)
    const settings = query("SELECT key, value FROM settings WHERE shop_id = ? AND key IN ('lowStockThreshold', 'currency')").all(shopId);
    const settingsMap = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});

    const lowStockThreshold = parseInt(settingsMap.lowStockThreshold || "5");
    const currency = settingsMap.currency || "PKR";

    // Stock alerts (low stock items)
    const lowStockFrames = query("SELECT COUNT(*) as count FROM frames WHERE shop_id = ? AND stock <= ? AND stock > 0").get(shopId, lowStockThreshold).count;
    const outOfStockFrames = query("SELECT COUNT(*) as count FROM frames WHERE shop_id = ? AND stock = 0").get(shopId).count;
    const lowStockLenses = query("SELECT COUNT(*) as count FROM lenses WHERE shop_id = ? AND stock <= ? AND stock > 0").get(shopId, lowStockThreshold).count;
    const outOfStockLenses = query("SELECT COUNT(*) as count FROM lenses WHERE shop_id = ? AND stock = 0").get(shopId).count;
    const lowStockContactLenses = query("SELECT COUNT(*) as count FROM contact_lenses WHERE shop_id = ? AND stock <= ? AND stock > 0").get(shopId, lowStockThreshold).count;
    const outOfStockContactLenses = query("SELECT COUNT(*) as count FROM contact_lenses WHERE shop_id = ? AND stock = 0").get(shopId).count;
    const lowStockAccessories = query("SELECT COUNT(*) as count FROM accessories WHERE shop_id = ? AND stock <= ? AND stock > 0").get(shopId, lowStockThreshold).count;
    const outOfStockAccessories = query("SELECT COUNT(*) as count FROM accessories WHERE shop_id = ? AND stock = 0").get(shopId).count;

    // Fetch specific low stock items for detail alert
    const lowStockFramesList = query(`
      SELECT brand_name as brand, model, stock 
      FROM frames 
      WHERE shop_id = ? AND stock <= ? 
      ORDER BY stock ASC 
      LIMIT 10
    `).all(shopId, lowStockThreshold);

    const lowStockLensesList = query(`
      SELECT name, stock 
      FROM lenses 
      WHERE shop_id = ? AND stock <= ? 
      ORDER BY stock ASC 
      LIMIT 10
    `).all(shopId, lowStockThreshold);

    const lowStockContactLensesList = query(`
      SELECT name, stock 
      FROM contact_lenses 
      WHERE shop_id = ? AND stock <= ? 
      ORDER BY stock ASC 
      LIMIT 10
    `).all(shopId, lowStockThreshold);

    const lowStockAccessoriesList = query(`
      SELECT name, stock 
      FROM accessories 
      WHERE shop_id = ? AND stock <= ? 
      ORDER BY stock ASC 
      LIMIT 10
    `).all(shopId, lowStockThreshold);

    const detailedLowStockItems = [
      ...lowStockFramesList.map(f => ({
        type: 'Frame',
        name: `${f.brand} ${f.model}`,
        stock: f.stock
      })),
      ...lowStockLensesList.map(l => ({
        type: 'Spectacle Lens',
        name: l.name,
        stock: l.stock
      })),
      ...lowStockContactLensesList.map(cl => ({
        type: 'Contact Lens',
        name: cl.name,
        stock: cl.stock
      })),
      ...lowStockAccessoriesList.map(a => ({
        type: 'Accessory',
        name: a.name,
        stock: a.stock
      }))
    ].sort((a, b) => a.stock - b.stock).slice(0, 10);


    // Recent orders
    const recentOrders = query(`
      SELECT 
        o.id,
        o.customer_name as customerName,
        o.total,
        o.status,
        o.created_at as createdAt
      FROM orders o
      ${branchWhere}
      ORDER BY o.created_at DESC
      LIMIT 5
    `).all(...filterParams);

    // Check for new logs if lastLogCheck is provided
    const lastLogCheck = searchParams.get('lastLogCheck');
    let newLogsCount = 0;
    if (lastLogCheck) {
      try {
        const checkDate = new Date(parseInt(lastLogCheck)).toISOString().replace('T', ' ').split('.')[0];

        // Filter logs by shop/branch context
        let logsQuery = `SELECT COUNT(*) as count FROM activity_logs WHERE created_at > ? AND shop_id = ?`;
        const logParams = [checkDate, shopId];

        if (branchId && branchId !== "All") {
          logsQuery += ` AND (branch_id = ? OR branch_id IS NULL)`; // Include shop-wide logs for branch users too
          logParams.push(branchId);
        }

        newLogsCount = query(logsQuery).get(...logParams).count;
      } catch (e) {
        console.error("Error counting new logs:", e);
      }
    }

    // Prepare Alerts
    const alerts = [];
    if (outOfStockFrames > 0) alerts.push(`⚠️ ALERT: ${outOfStockFrames} Frames out of stock!`);
    if (outOfStockLenses > 0) alerts.push(`⚠️ ALERT: ${outOfStockLenses} Spectacle Lenses out of stock!`);
    if (outOfStockContactLenses > 0) alerts.push(`⚠️ ALERT: ${outOfStockContactLenses} Contact Lenses out of stock!`);
    if (outOfStockAccessories > 0) alerts.push(`⚠️ ALERT: ${outOfStockAccessories} Accessories out of stock!`);
    if (lowStockFrames > 0) alerts.push(`🔔 Low Stock: ${lowStockFrames} Frames running low!`);
    if (lowStockLenses > 0) alerts.push(`🔔 Low Stock: ${lowStockLenses} Spectacle Lenses running low!`);
    if (lowStockContactLenses > 0) alerts.push(`🔔 Low Stock: ${lowStockContactLenses} Contact Lenses running low!`);
    if (lowStockAccessories > 0) alerts.push(`🔔 Low Stock: ${lowStockAccessories} Accessories running low!`);
    if (pendingPayments.total > 0) alerts.push(`💰 Outstanding: ${currency} ${pendingPayments.total.toLocaleString()} pending from ${pendingPayments.count} orders.`);

    // Monthly sales chart data (last 12 months)
    const chartData = [];
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    const startDate = twelveMonthsAgo.toISOString().slice(0, 7) + '-01';

    // Get all sales for the last 12 months in one query
    const salesData = query(`
        SELECT 
            strftime('%Y-%m', created_at) as monthKey,
            COALESCE(SUM(total), 0) as revenue, 
            COUNT(*) as orders 
        FROM orders 
        WHERE created_at >= ? ${branchAndFilter}
        GROUP BY monthKey
        ORDER BY monthKey ASC
    `).all(startDate, ...filterParams);

    const salesMap = salesData.reduce((acc, curr) => ({ ...acc, [curr.monthKey]: curr }), {});

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      const sales = salesMap[monthKey] || { revenue: 0, orders: 0 };

      chartData.push({
        month: monthName,
        revenue: sales.revenue,
        orders: sales.orders
      });
    }

    return NextResponse.json({
      counts: {
        customers: customerCount,
        orders: orderCount,
        frames: frameCount,
        lenses: lensCount,
        contactLenses: contactLensCount,
        accessories: accessoryCount,
        vendors: vendorCount,
        brands: brandCount
      },
      sales: {
        today: todaySales.total,
        todayCount: todaySales.count,
        month: monthSales.total,
        monthCount: monthSales.count,
        monthItemsCount: monthSales.itemsCount,
        growth: parseFloat(salesGrowth)
      },
      receivables: {
        total: pendingPayments.total,
        count: pendingPayments.count,
        list: query(`
          SELECT id, customer_name as customerName, balance, created_at as createdAt
          FROM orders
          WHERE balance > 0 ${branchAndFilter}
          ORDER BY created_at DESC
          LIMIT 10
        `).all(...filterParams)
      },
      stockAlerts: {
        lowStockFrames,
        outOfStockFrames,
        lowStockLenses,
        outOfStockLenses,
        lowStockContactLenses,
        outOfStockContactLenses,
        lowStockAccessories,
        outOfStockAccessories,
        total: lowStockFrames + outOfStockFrames + lowStockLenses + outOfStockLenses + lowStockContactLenses + outOfStockContactLenses + lowStockAccessories + outOfStockAccessories
      },
      lowStockItems: detailedLowStockItems,
      alerts,
      recentOrders,
      chartData,
      newLogsCount
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
