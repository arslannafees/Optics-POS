import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET all purchases with optional filters
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");
    const branchId = searchParams.get("branchId");
    const shopId = searchParams.get("shopId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const db = getDb();
    let query = `
      SELECT 
        p.id,
        p.local_id as localId,
        p.shop_id as shopId,
        p.vendor_id as vendorId,
        v.name as vendorName,
        p.invoice_number as invoiceNumber,
        p.date,
        p.subtotal,
        p.discount,
        p.tax,
        p.total,
        p.paid,
        p.balance,
        p.payment_method as paymentMethod,
        p.status,
        p.remarks,
        p.branch_id as branchId,
        COALESCE(br.name, 'Main Branch') as branchName,
        p.created_at as createdAt,
        p.updated_at as updatedAt
      FROM purchases p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN branches br ON p.branch_id = br.id
    `;

    const params = [];
    const conditions = [];

    if (shopId) {
      conditions.push("p.shop_id = ?");
      params.push(shopId);
    }

    if (vendorId && vendorId !== "All") {
      conditions.push("p.vendor_id = ?");
      params.push(vendorId);
    }
    if (branchId && branchId !== "All") {
      conditions.push("p.branch_id = ?");
      params.push(branchId);
    }
    if (fromDate) {
      conditions.push("p.date >= ?");
      params.push(fromDate);
    }
    if (toDate) {
      conditions.push("p.date <= ?");
      params.push(toDate);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.created_at DESC";

    const purchases = db.prepare(query).all(...params);

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

// POST create new purchase
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      vendorId,
      invoiceNumber,
      date,
      items,
      subtotal,
      discount = 0,
      tax = 0,
      total,
      paid = 0,
      paymentMethod,
      remarks,
      branchId,
      shopId,
      user
    } = body;

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor is required" },
        { status: 400 }
      );
    }

    if (!shopId) {
      return NextResponse.json(
        { error: "Shop context is required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Calculate balance
    const balance = parseFloat(total) - parseFloat(paid);
    const status = balance <= 0 ? 'paid' : (paid > 0 ? 'partial' : 'pending');

    // Generate local_id
    const nextLocalIdResult = db.prepare("SELECT COALESCE(MAX(local_id), 0) + 1 as nextId FROM purchases WHERE shop_id = ?").get(shopId);
    const localId = nextLocalIdResult.nextId;

    // Insert purchase
    const result = db.prepare(`
      INSERT INTO purchases (shop_id, branch_id, vendor_id, invoice_number, date, subtotal, discount, tax, total, paid, balance, payment_method, status, remarks, local_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      shopId,
      branchId || 1,
      vendorId,
      invoiceNumber || null,
      date || new Date().toISOString().split('T')[0],
      parseFloat(subtotal) || 0,
      parseFloat(discount) || 0,
      parseFloat(tax) || 0,
      parseFloat(total) || 0,
      parseFloat(paid) || 0,
      balance,
      paymentMethod || null,
      status,
      remarks || null,
      localId
    );

    const purchaseId = result.lastInsertRowid;

    // Insert purchase items if provided
    if (items && Array.isArray(items) && items.length > 0) {
      const insertItem = db.prepare(`
        INSERT INTO purchase_items (purchase_id, item_type, item_id, item_name, quantity, cost, total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        const normalizedType = (item.type || 'frame').replace('-', '_');
        insertItem.run(
          purchaseId,
          normalizedType,
          item.itemId || null,
          item.name,
          parseInt(item.quantity) || 1,
          parseFloat(item.cost) || 0,
          parseFloat(item.total) || (parseFloat(item.cost) * parseInt(item.quantity))
        );

        // Update stock for frames or lenses
        if (normalizedType === 'frame' && item.itemId) {
          db.prepare("UPDATE frames SET stock = stock + ? WHERE id = ?")
            .run(parseInt(item.quantity) || 1, item.itemId);
        } else if (normalizedType === 'lens' && item.itemId) {
          db.prepare("UPDATE lenses SET stock = stock + ? WHERE id = ?")
            .run(parseInt(item.quantity) || 1, item.itemId);
        } else if (normalizedType === 'contact_lens' && item.itemId) {
          db.prepare("UPDATE contact_lenses SET stock = stock + ? WHERE id = ?")
            .run(parseInt(item.quantity) || 1, item.itemId);
        } else if (normalizedType === 'accessory' && item.itemId) {
          db.prepare("UPDATE accessories SET stock = stock + ? WHERE id = ?")
            .run(parseInt(item.quantity) || 1, item.itemId);
        }
      }
    }

    // Update vendor balance
    if (balance > 0) {
      db.prepare("UPDATE vendors SET balance = balance + ? WHERE id = ?")
        .run(balance, vendorId);
    }

    const newPurchase = db.prepare(`
      SELECT 
        p.id,
        p.local_id as localId,
        p.vendor_id as vendorId,
        v.name as vendorName,
        p.invoice_number as invoiceNumber,
        p.date,
        p.subtotal,
        p.discount,
        p.tax,
        p.total,
        p.paid,
        p.balance,
        p.payment_method as paymentMethod,
        p.status,
        p.remarks,
        p.created_at as createdAt,
        p.shop_id as shopId,
        p.branch_id as branchId
      FROM purchases p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ?
    `).get(purchaseId);

    // Log activity
    if (user) {
      logActivity(db, {
        shopId: newPurchase.shopId,
        branchId: newPurchase.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "create",
        entityType: "purchase",
        entityId: newPurchase.id,
        entityName: `Invoice #${newPurchase.invoiceNumber || newPurchase.id}`,
        changes: {
          ...newPurchase,
          items: items
        }
      });
    }

    return NextResponse.json(newPurchase, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 });
  }
}
