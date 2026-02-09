import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");
    const branchId = searchParams.get("branchId");
    const itemId = searchParams.get("itemId") || searchParams.get("frameId");
    const itemType = searchParams.get("itemType") || "frame";
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    if (!shopId) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const db = getDb();

    // Unified Type Condition (Standardized Values)
    const t = itemType.toLowerCase();
    const typeCondition = (t === "frame")
      ? "('frame', 'Frame', 'glass', 'Glass')"
      : (t === "spectacle")
        ? "('spectacle_lens', 'spectacle-lens', 'Lens', 'lens')"
        : (t === "contact")
          ? "('contact_lens', 'contact-lens')"
          : (t === "accessory")
            ? "('accessory', 'Accessory')"
            : (t === "all")
              ? "('frame', 'Frame', 'glass', 'Glass', 'spectacle_lens', 'spectacle-lens', 'contact_lens', 'contact-lens', 'lens', 'Lens', 'accessory', 'Accessory')"
              : `('${t}', '${t.charAt(0).toUpperCase() + t.slice(1)}')`;

    // Fetch purchase history for this item
    let purchaseQuery = `
      SELECT 
        'Purchase' as type,
        p.date,
        v.name as client,
        COALESCE(b.name, 'Main Branch') as branch,
        pi.quantity as 'in',
        0 as 'out',
        pi.item_name
      FROM purchase_items pi
      JOIN purchases p ON pi.purchase_id = p.id
      LEFT JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN branches b ON p.branch_id = b.id
      WHERE pi.item_type IN ${typeCondition}
    `;
    const purchaseParams = [];

    // Add Shop Filter
    purchaseQuery += " AND p.shop_id = ?";
    purchaseParams.push(shopId);

    if (itemId !== "All") {
      purchaseQuery += " AND pi.item_id = ?";
      purchaseParams.push(itemId);
    }
    if (branchId && branchId !== "All") {
      purchaseQuery += " AND p.branch_id = ?";
      purchaseParams.push(branchId);
    }
    if (fromDate) {
      purchaseQuery += " AND p.date >= ?";
      purchaseParams.push(fromDate);
    }
    if (toDate) {
      purchaseQuery += " AND p.date <= ?";
      purchaseParams.push(toDate);
    }
    const purchases = db.prepare(purchaseQuery).all(...purchaseParams);

    // Fetch sales history for this item
    let saleQuery = `
      SELECT 
        'Sale' as type,
        o.order_date as date,
        o.customer_name as client,
        COALESCE(b.name, 'Main Branch') as branch,
        0 as 'in',
        oi.quantity as 'out',
        oi.item_name
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      LEFT JOIN branches b ON o.branch_id = b.id
      WHERE oi.item_type IN ${typeCondition}
    `;
    const saleParams = [];

    // Add Shop Filter
    saleQuery += " AND o.shop_id = ?";
    saleParams.push(shopId);

    if (itemId !== "All") {
      saleQuery += " AND oi.item_id = ?";
      saleParams.push(itemId);
    }
    if (branchId && branchId !== "All") {
      saleQuery += " AND o.branch_id = ?";
      saleParams.push(branchId);
    }
    if (fromDate) {
      saleQuery += " AND o.order_date >= ?";
      saleParams.push(fromDate);
    }
    if (toDate) {
      saleQuery += " AND o.order_date <= ?";
      saleParams.push(toDate);
    }
    const sales = db.prepare(saleQuery).all(...saleParams);

    // Combine and sort by date
    const ledger = [...purchases, ...sales].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let balance = 0;
    const ledgerWithBalance = ledger.map(item => {
      balance += item.in - item.out;
      return { ...item, balance };
    });

    return NextResponse.json(ledgerWithBalance);
  } catch (error) {
    console.error("Error fetching item ledger:", error);
    return NextResponse.json({ error: "Failed to fetch item ledger" }, { status: 500 });
  }
}
