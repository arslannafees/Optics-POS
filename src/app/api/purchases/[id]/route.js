import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET single purchase by ID with items
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const purchase = db.prepare(`
      SELECT 
        p.id,
        p.vendor_id as vendorId,
        v.name as vendorName,
        v.company as vendorCompany,
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
        p.updated_at as updatedAt
      FROM purchases p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ?
    `).get(id);

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    // Get purchase items
    const items = db.prepare(`
      SELECT 
        id,
        item_type as type,
        item_id as itemId,
        item_name as name,
        quantity,
        cost,
        total
      FROM purchase_items
      WHERE purchase_id = ?
    `).all(id);

    return NextResponse.json({ ...purchase, items });
  } catch (error) {
    console.error("Error fetching purchase:", error);
    return NextResponse.json({ error: "Failed to fetch purchase" }, { status: 500 });
  }
}

// PUT update purchase (mainly for payments)
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { paid, paymentMethod, remarks, user } = body;

    const db = getDb();

    // Check if purchase exists
    const existing = db.prepare(`
        SELECT 
            p.*,
            p.shop_id as shopId,
            p.branch_id as branchId
        FROM purchases p
        WHERE p.id = ?
    `).get(id);

    if (!existing) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    // Calculate new balance
    const newPaid = parseFloat(paid) || existing.paid;
    const newBalance = parseFloat(existing.total) - newPaid;
    const status = newBalance <= 0 ? 'paid' : (newPaid > 0 ? 'partial' : 'pending');

    // Update vendor balance (adjust the difference)
    const paidDifference = newPaid - existing.paid;
    if (paidDifference !== 0) {
      db.prepare("UPDATE vendors SET balance = balance - ? WHERE id = ?")
        .run(paidDifference, existing.vendor_id);
    }

    db.prepare(`
      UPDATE purchases 
      SET paid = ?,
          balance = ?,
          payment_method = COALESCE(?, payment_method),
          status = ?,
          remarks = COALESCE(?, remarks),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      newPaid,
      newBalance,
      paymentMethod || null,
      status,
      remarks || null,
      id
    );

    const updatedPurchase = db.prepare(`
      SELECT 
        p.id,
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
        p.updated_at as updatedAt,
        p.shop_id as shopId,
        p.branch_id as branchId
      FROM purchases p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE p.id = ?
    `).get(id);

    // Log activity
    if (user && existing) {
      logActivity(db, {
        shopId: updatedPurchase.shopId,
        branchId: updatedPurchase.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "purchase",
        entityId: updatedPurchase.id,
        entityName: `Invoice #${updatedPurchase.invoiceNumber || updatedPurchase.id}`,
        changes: {
          old: {
            invoiceNumber: existing.invoice_number,
            vendorId: existing.vendor_id,
            date: existing.date,
            subtotal: existing.subtotal,
            discount: existing.discount,
            tax: existing.tax,
            total: existing.total,
            paid: existing.paid,
            balance: existing.balance,
            status: existing.status,
            paymentMethod: existing.payment_method,
            remarks: existing.remarks
          },
          new: {
            invoiceNumber: updatedPurchase.invoiceNumber,
            vendorId: updatedPurchase.vendorId,
            date: updatedPurchase.date,
            subtotal: updatedPurchase.subtotal,
            discount: updatedPurchase.discount,
            tax: updatedPurchase.tax,
            total: updatedPurchase.total,
            paid: newPaid,
            balance: newBalance,
            status,
            paymentMethod: paymentMethod || existing.payment_method,
            remarks: remarks || existing.remarks
          }
        }
      });
    }

    return NextResponse.json(updatedPurchase);
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json({ error: "Failed to update purchase" }, { status: 500 });
  }
}

// DELETE purchase
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    let user = null;
    try {
      const body = await req.json();
      user = body.user;
    } catch (e) { /* ignore */ }

    const db = getDb();

    // Check if purchase exists
    const existing = db.prepare(`
        SELECT 
            p.*,
            p.shop_id as shopId,
            p.branch_id as branchId,
            p.invoice_number as invoiceNumber
        FROM purchases p
        WHERE p.id = ?
    `).get(id);

    if (!existing) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    // Get purchase items to reverse stock
    const items = db.prepare("SELECT * FROM purchase_items WHERE purchase_id = ?").all(id);

    // Reverse stock changes
    for (const item of items) {
      if (item.item_type === 'frame' && item.item_id) {
        db.prepare("UPDATE frames SET stock = stock - ? WHERE id = ?")
          .run(item.quantity, item.item_id);
      } else if (item.item_type === 'lens' && item.item_id) {
        db.prepare("UPDATE lenses SET stock = stock - ? WHERE id = ?")
          .run(item.quantity, item.item_id);
      } else if (item.item_type === 'contact_lens' && item.item_id) {
        db.prepare("UPDATE contact_lenses SET stock = stock - ? WHERE id = ?")
          .run(item.quantity, item.item_id);
      } else if (item.item_type === 'accessory' && item.item_id) {
        db.prepare("UPDATE accessories SET stock = stock - ? WHERE id = ?")
          .run(item.quantity, item.item_id);
      }
    }

    // Reverse vendor balance
    if (existing.balance > 0) {
      db.prepare("UPDATE vendors SET balance = balance - ? WHERE id = ?")
        .run(existing.balance, existing.vendor_id);
    }

    // Delete purchase items first
    db.prepare("DELETE FROM purchase_items WHERE purchase_id = ?").run(id);

    // Delete purchase
    db.prepare("DELETE FROM purchases WHERE id = ?").run(id);

    // Log activity
    if (user && existing) {
      logActivity(db, {
        shopId: existing.shopId, // using alias from query
        branchId: existing.branchId, // using alias from query
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "delete",
        entityType: "purchase",
        entityId: existing.id,
        entityName: `Invoice #${existing.invoiceNumber || existing.id}`,
        changes: {
          invoiceNumber: existing.invoiceNumber,
          vendorId: existing.vendor_id,
          date: existing.date,
          subtotal: existing.subtotal,
          discount: existing.discount,
          tax: existing.tax,
          total: existing.total,
          paid: existing.paid,
          balance: existing.balance,
          status: existing.status,
          paymentMethod: existing.payment_method,
          remarks: existing.remarks
        }
      });
    }

    return NextResponse.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return NextResponse.json({ error: "Failed to delete purchase" }, { status: 500 });
  }
}
