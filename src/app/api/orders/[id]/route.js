import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";

// GET single order with items
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const order = db.prepare(`
      SELECT 
        o.id,
        o.local_id as localId,
        o.customer_id as customerId,
        c.local_id as customerLocalId,
        o.customer_name as customer,
        c.phone as customerPhone,
        c.mobile as customerMobile,
        c.email as customerEmail,
        o.order_type as orderType,
        o.order_date as date,
        o.delivery_date as deliveryDate,
        o.status,
        o.subtotal,
        o.discount,
        o.tax,
        o.total,
        o.advance,
        o.balance,
        o.notes,
        o.created_at as createdAt,
        o.updated_at as updatedAt,
        b.name as branchName,
        b.address as branchAddress,
        b.phone as branchPhone
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN branches b ON o.branch_id = b.id
      WHERE o.id = ?
    `).get(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get order items
    const items = db.prepare(`
      SELECT 
        oi.id,
        oi.item_type as itemType,
        oi.item_id as itemId,
        oi.item_name as itemName,
        oi.quantity,
        oi.price,
        oi.total,
        oi.prescription_data as prescriptionData,
        COALESCE(f.color, cl.color) as color
      FROM order_items oi
      LEFT JOIN frames f ON oi.item_type = 'frame' AND oi.item_id = f.id
      LEFT JOIN contact_lenses cl ON oi.item_type = 'contact_lens' AND oi.item_id = cl.id
      WHERE oi.order_id = ?
    `).all(id);

    // Get prescription
    const prescription = db.prepare(`
      SELECT 
        right_sph as rightSph, right_cyl as rightCyl, right_axis as rightAxis, right_add as rightAdd,
        right_prism as rightPrism, right_diameter as rightDiameter, right_base_curve as rightBaseCurve, 
        right_segment as rightSegment, right_pd as rightPupillaryDistance,
        left_sph as leftSph, left_cyl as leftCyl, left_axis as leftAxis, left_add as leftAdd,
        left_prism as leftPrism, left_diameter as leftDiameter, left_base_curve as leftBaseCurve, 
        left_segment as leftSegment, left_pd as leftPupillaryDistance,
        remarks, pd_type as pdType, total_pd as totalPd
      FROM prescriptions
      WHERE order_id = ?
    `).get(id);

    return NextResponse.json({ ...order, items, prescription });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PUT update order
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      customerId, customer, orderType, date, deliveryDate, status,
      subtotal, discount, tax, total, advance, paid, notes, remarks, items, prescription,
      user
    } = body;

    const db = getDb();
    const paidAmount = paid || advance || 0;
    const balance = (total || 0) - paidAmount;

    // Get existing order details for fallback and logging
    const existingOrder = db.prepare(`
        SELECT 
            *,
            customer_name as customer,
            order_date as date
        FROM orders 
        WHERE id = ?
    `).get(id);

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get existing items for logging
    const existingItems = db.prepare(`
      SELECT item_type as type, item_id as itemId, item_name as name, quantity, price, total
      FROM order_items
      WHERE order_id = ?
    `).all(id);

    // Start transaction for consistency
    const transaction = db.transaction(() => {
      // Lookup customer name if not provided but customerId is
      let finalCustomerName = customer;
      if (customerId && !finalCustomerName) {
        const customerRecord = db.prepare("SELECT first_name, last_name FROM customers WHERE id = ?").get(customerId);
        finalCustomerName = customerRecord ? `${customerRecord.first_name} ${customerRecord.last_name || ''}`.trim() : 'Unknown Customer';
      } else if (!finalCustomerName) {
        finalCustomerName = existingOrder?.customer_name || 'Unknown Customer';
      }

      // Fallback for date
      const finalDate = date || existingOrder?.order_date || new Date().toISOString().split('T')[0];

      // 1. Update main order record
      db.prepare(`
        UPDATE orders 
        SET customer_id = ?, customer_name = ?, order_type = ?, order_date = ?, 
            delivery_date = ?, status = ?, subtotal = ?, discount = ?, tax = ?, 
            total = ?, advance = ?, balance = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        customerId || null,
        finalCustomerName,
        orderType || 'Standard',
        finalDate,
        deliveryDate || null,
        status || 'pending',
        parseFloat(subtotal) || 0,
        parseFloat(discount) || 0,
        parseFloat(tax) || 0,
        parseFloat(total) || 0,
        paidAmount,
        balance,
        notes || remarks || null,
        id
      );

      // 2. Handle Prescription
      if (prescription) {
        // Delete existing prescription for this order
        db.prepare("DELETE FROM prescriptions WHERE order_id = ?").run(id);

        const {
          rightSph, rightCyl, rightAxis, rightAdd, rightPrism, rightDiameter, rightBaseCurve, rightSegment, rightPd, rightPupillaryDistance,
          leftSph, leftCyl, leftAxis, leftAdd, leftPrism, leftDiameter, leftBaseCurve, leftSegment, leftPd, leftPupillaryDistance,
          pdType, totalPd
        } = prescription;

        const hasPrescription = rightSph || rightCyl || leftSph || leftCyl;

        if (hasPrescription && customerId) {
          db.prepare(`
            INSERT INTO prescriptions (
              order_id, customer_id, 
              right_sph, right_cyl, right_axis, right_add, right_prism, right_diameter, right_base_curve, right_segment, right_pd,
              left_sph, left_cyl, left_axis, left_add, left_prism, left_diameter, left_base_curve, left_segment, left_pd,
              remarks, pd_type, total_pd
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            id,
            customerId,
            rightSph || null,
            rightCyl || null,
            rightAxis || null,
            rightAdd || null,
            rightPrism || null,
            rightDiameter || null,
            rightBaseCurve || null,
            rightSegment || null,
            rightPupillaryDistance || rightPd || null,
            leftSph || null,
            leftCyl || null,
            leftAxis || null,
            leftAdd || null,
            leftPrism || null,
            leftDiameter || null,
            leftBaseCurve || null,
            leftSegment || null,
            leftPupillaryDistance || leftPd || null,
            prescription.remarks || null,
            pdType || 'dual',
            totalPd || null
          );
        }
      }

      // 3. Handle Order Items
      if (items && Array.isArray(items)) {
        // 3a. Get old items to restore stock before deleting them
        const oldItems = db.prepare("SELECT item_type, item_id, quantity FROM order_items WHERE order_id = ?").all(id);
        for (const item of oldItems) {
          if (item.item_type === 'frame' && item.item_id) {
            db.prepare("UPDATE frames SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
          } else if (item.item_type === 'lens' && item.item_id) {
            db.prepare("UPDATE lenses SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
          } else if (item.item_type === 'accessory' && item.item_id) {
            db.prepare("UPDATE accessories SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
          } else if (item.item_type === 'contact-lens' && item.item_id) {
            db.prepare("UPDATE contact_lenses SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
          }
        }

        // 3b. Delete existing items
        db.prepare("DELETE FROM order_items WHERE order_id = ?").run(id);

        // 3c. Insert new items and update stock
        const insertItem = db.prepare(`
          INSERT INTO order_items (order_id, item_type, item_id, item_name, quantity, price, total, prescription_data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const item of items) {
          insertItem.run(
            id,
            (item.type || item.itemType || 'accessory').replace('-', '_'),
            item.itemId || null,
            item.name || item.itemName,
            item.quantity || 1,
            parseFloat(item.price) || 0,
            parseFloat(item.total) || (item.quantity * item.price) || 0,
            item.prescription ? JSON.stringify(item.prescription) : null
          );

          if ((item.type === 'frame' || item.itemType === 'frame') && item.itemId) {
            db.prepare("UPDATE frames SET stock = stock - ? WHERE id = ?").run(parseInt(item.quantity) || 1, item.itemId);
          } else if ((item.type === 'lens' || item.itemType === 'lens') && item.itemId) {
            db.prepare("UPDATE lenses SET stock = stock - ? WHERE id = ?").run(parseInt(item.quantity) || 1, item.itemId);
          } else if ((item.type === 'accessory' || item.itemType === 'accessory') && item.itemId) {
            db.prepare("UPDATE accessories SET stock = stock - ? WHERE id = ?").run(parseInt(item.quantity) || 1, item.itemId);
          } else if ((item.type === 'contact-lens' || item.itemType === 'contact-lens' || item.type === 'contact_lens' || item.itemType === 'contact_lens') && item.itemId) {
            db.prepare("UPDATE contact_lenses SET stock = stock - ? WHERE id = ?").run(parseInt(item.quantity) || 1, item.itemId);
          }
        }
      }
    });

    // Execute transaction
    transaction();

    const updated = db.prepare(`
      SELECT 
        id, customer_name as customer, order_type as orderType, order_date as date, 
        delivery_date as deliveryDate, status, subtotal, discount, tax, 
        total, advance, balance, notes, created_at as createdAt, updated_at as updatedAt,
        shop_id as shopId, branch_id as branchId
      FROM orders 
      WHERE id = ?
    `).get(id);

    // Log activity
    if (user && existingOrder) {
      logActivity(db, {
        shopId: updated.shopId,
        branchId: updated.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "order",
        entityId: updated.id,
        entityName: `Order #${updated.id} - ${updated.customer}`,
        changes: {
          old: {
            customer: existingOrder.customer,
            customerId: existingOrder.customer_id,
            status: existingOrder.status,
            orderType: existingOrder.order_type,
            date: existingOrder.order_date,
            deliveryDate: existingOrder.delivery_date,
            subtotal: existingOrder.subtotal,
            discount: existingOrder.discount,
            tax: existingOrder.tax,
            total: existingOrder.total,
            advance: existingOrder.advance,
            balance: existingOrder.balance,
            notes: existingOrder.notes,
            items: existingItems
          },
          new: {
            customer: updated.customer,
            customerId: customerId,
            status: updated.status,
            orderType: updated.orderType,
            date: updated.date,
            deliveryDate: updated.deliveryDate,
            subtotal: updated.subtotal,
            discount: updated.discount,
            tax: updated.tax,
            total: updated.total,
            advance: updated.advance,
            balance: updated.balance,
            notes: updated.notes,
            items: items
          }
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE order
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    let user = null;
    try {
      const body = await req.json();
      user = body.user;
    } catch (e) { /* ignore */ }

    const db = getDb();

    const existingOrder = db.prepare(`
      SELECT 
        *,
        customer_name as customer
      FROM orders 
      WHERE id = ?
    `).get(id);

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 1. Get order items to restore stock and for logging
    const items = db.prepare("SELECT item_type, item_id, item_name, quantity, price, total FROM order_items WHERE order_id = ?").all(id);

    // 2. Restore stock for each item
    for (const item of items) {
      if ((item.item_type === 'frame') && item.item_id) {
        db.prepare("UPDATE frames SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
      } else if ((item.item_type === 'lens') && item.item_id) {
        db.prepare("UPDATE lenses SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
      } else if ((item.item_type === 'accessory') && item.item_id) {
        db.prepare("UPDATE accessories SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
      } else if ((item.item_type === 'contact-lens' || item.item_type === 'contact_lens') && item.item_id) {
        db.prepare("UPDATE contact_lenses SET stock = stock + ? WHERE id = ?").run(item.quantity, item.item_id);
      }
    }

    // 3. Delete order items first
    db.prepare("DELETE FROM order_items WHERE order_id = ?").run(id);

    // 4. Delete prescription
    db.prepare("DELETE FROM prescriptions WHERE order_id = ?").run(id);

    // 5. Finally delete the order
    const result = db.prepare("DELETE FROM orders WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Log activity
    if (user && existingOrder) {
      logActivity(db, {
        shopId: existingOrder.shop_id,
        branchId: existingOrder.branch_id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "delete",
        entityType: "order",
        entityId: existingOrder.id,
        entityName: `Order #${existingOrder.id} - ${existingOrder.customer}`,
        changes: {
          customer: existingOrder.customer,
          customerId: existingOrder.customer_id,
          status: existingOrder.status,
          orderType: existingOrder.order_type,
          date: existingOrder.order_date,
          deliveryDate: existingOrder.delivery_date,
          subtotal: existingOrder.subtotal,
          discount: existingOrder.discount,
          tax: existingOrder.tax,
          total: existingOrder.total,
          advance: existingOrder.advance,
          balance: existingOrder.balance,
          notes: existingOrder.notes,
          items: items.map(it => ({
            type: it.item_type,
            itemId: it.item_id,
            name: it.item_name,
            quantity: it.quantity,
            price: it.price,
            total: it.total
          }))
        }
      });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}

// PATCH update order status
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, user } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const db = getDb();

    // Get existing order for logging
    const existingOrder = db.prepare(`
        SELECT 
            *,
            customer_name as customer
        FROM orders 
        WHERE id = ?
    `).get(id);

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const result = db.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Order update failed" }, { status: 500 });
    }

    const updated = db.prepare("SELECT id, status FROM orders WHERE id = ?").get(id);

    // Log activity
    if (user && existingOrder) {
      logActivity(db, {
        shopId: existingOrder.shop_id,
        branchId: existingOrder.branch_id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "order",
        entityId: existingOrder.id,
        entityName: `Order #${existingOrder.id} - ${existingOrder.customer}`,
        changes: {
          old: { status: existingOrder.status },
          new: { status: status }
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error patching order:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
