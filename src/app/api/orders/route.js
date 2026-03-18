import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

// GET all orders with optional filters
export async function GET(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");
    const branchId = searchParams.get("branchId");
    const customerId = searchParams.get("customerId");
    const orderType = searchParams.get("orderType");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const db = getDb();
    let query = `
      SELECT 
        o.id,
        o.local_id as localId,
        o.customer_name as customer,
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
        o.actual_total as actualTotal,
        o.notes,
        o.branch_id as branchId,
        o.shop_id as shopId,
        COALESCE(b.name, 'Main Branch') as branchName,
        o.created_at as createdAt,
        o.updated_at as updatedAt
      FROM orders o
      LEFT JOIN branches b ON o.branch_id = b.id
    `;

    const params = [];
    const conditions = [];

    if (shopId) {
      conditions.push("o.shop_id = ?");
      params.push(shopId);
    }
    if (branchId && branchId !== "All") {
      conditions.push("o.branch_id = ?");
      params.push(branchId);
    }
    if (customerId && customerId !== "All") {
      conditions.push("o.customer_id = ?");
      params.push(customerId);
    }
    if (orderType && orderType !== "All") {
      conditions.push("o.order_type = ?");
      params.push(orderType);
    }
    if (fromDate) {
      conditions.push("o.order_date >= ?");
      params.push(fromDate);
    }
    if (toDate) {
      conditions.push("o.order_date <= ?");
      params.push(toDate);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY o.created_at DESC";

    const orders = db.prepare(query).all(...params);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create new order
export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const body = await req.json();
    const {
      customer, customerId, orderType, date, deliveryDate,
      subtotal, discount, tax, total, actualTotal, advance, paid, paymentMethod, notes, remarks, items, prescription, branchId,
      user
    } = body;

    // SECURITY: Enforce tenant isolation — use JWT shopId, ignore body shopId
    const shopId = body.shopId || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

    // Get customer name if customerId is provided
    const db = getDb();
    let customerName = customer;

    if (customerId && !customer) {
      const customerRecord = db.prepare("SELECT first_name, last_name FROM customers WHERE id = ?").get(customerId);
      customerName = customerRecord ? `${customerRecord.first_name} ${customerRecord.last_name || ''}`.trim() : 'Unknown Customer';
    }

    if (!customerName && !customerId) {
      return NextResponse.json(
        { error: "Customer is required" },
        { status: 400 }
      );
    }

    const paidAmount = paid || advance || 0;
    const balance = (total || 0) - paidAmount;

    const nextLocalIdResult = db.prepare("SELECT COALESCE(MAX(local_id), 0) + 1 as nextId FROM orders WHERE shop_id = ?").get(shopId);
    const localId = nextLocalIdResult.nextId;

    const result = db.prepare(`
      INSERT INTO orders (customer_id, customer_name, order_type, order_date, delivery_date, 
                          subtotal, discount, tax, total, actual_total, advance, balance, notes, status, branch_id, shop_id, local_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      customerId || null,
      customerName,
      orderType || 'Standard',
      date || new Date().toISOString().split('T')[0],
      deliveryDate || null,
      parseFloat(subtotal) || 0,
      parseFloat(discount) || 0,
      parseFloat(tax) || 0,
      parseFloat(total) || 0,
      parseFloat(actualTotal) || parseFloat(total) || 0,
      paidAmount,
      balance,
      notes || remarks || null,
      'pending',
      branchId ? parseInt(branchId) : null,
      shopId ? parseInt(shopId) : null,
      localId,
      user?.id || null
    );

    const orderId = result.lastInsertRowid;

    // Insert prescription if provided
    if (prescription && customerId) {
      const {
        rightSph, rightCyl, rightAxis, rightAdd, rightPrism, rightDiameter, rightBaseCurve, rightSegment, rightPupillaryDistance,
        leftSph, leftCyl, leftAxis, leftAdd, leftPrism, leftDiameter, leftBaseCurve, leftSegment, leftPupillaryDistance,
        pdType, totalPd
      } = prescription;

      const hasPrescription = rightSph || rightCyl || leftSph || leftCyl;

      if (hasPrescription) {
        db.prepare(`
          INSERT INTO prescriptions (
            order_id, customer_id, 
            right_sph, right_cyl, right_axis, right_add, right_prism, right_diameter, right_base_curve, right_segment, right_pd,
            left_sph, left_cyl, left_axis, left_add, left_prism, left_diameter, left_base_curve, left_segment, left_pd,
            remarks, pd_type, total_pd
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          orderId,
          customerId,
          rightSph || null,
          rightCyl || null,
          rightAxis || null,
          rightAdd || null,
          rightPrism || null,
          rightDiameter || null,
          rightBaseCurve || null,
          rightSegment || null,
          rightPupillaryDistance || null,
          leftSph || null,
          leftCyl || null,
          leftAxis || null,
          leftAdd || null,
          leftPrism || null,
          leftDiameter || null,
          leftBaseCurve || null,
          leftSegment || null,
          leftPupillaryDistance || null,
          prescription.remarks || null,
          pdType || 'dual',
          totalPd || null
        );
      }
    }

    // Insert order items if provided
    if (items && Array.isArray(items)) {
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, item_type, item_id, item_name, quantity, price, total, prescription_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        insertItem.run(
          orderId,
          (item.type || item.itemType || 'accessory').replace('-', '_'),
          item.itemId || null,
          item.name || item.itemName,
          item.quantity || 1,
          parseFloat(item.price) || 0,
          parseFloat(item.total) || (item.quantity * item.price) || 0,
          item.prescription ? JSON.stringify(item.prescription) : null
        );

        // Update stock for frames or lenses
        if ((item.type === 'frame' || item.itemType === 'frame') && item.itemId) {
          db.prepare("UPDATE frames SET stock = stock - ? WHERE id = ? AND stock >= ?")
            .run(parseInt(item.quantity) || 1, item.itemId, parseInt(item.quantity) || 1);
        } else if ((item.type === 'lens' || item.itemType === 'lens') && item.itemId) {
          db.prepare("UPDATE lenses SET stock = stock - ? WHERE id = ? AND stock >= ?")
            .run(parseInt(item.quantity) || 1, item.itemId, parseInt(item.quantity) || 1);
        } else if ((item.type === 'accessory' || item.itemType === 'accessory') && item.itemId) {
          db.prepare("UPDATE accessories SET stock = stock - ? WHERE id = ? AND stock >= ?")
            .run(parseInt(item.quantity) || 1, item.itemId, parseInt(item.quantity) || 1);
        } else if ((item.type === 'contact-lens' || item.itemType === 'contact-lens' || item.type === 'contact_lens' || item.itemType === 'contact_lens') && item.itemId) {
          db.prepare("UPDATE contact_lenses SET stock = stock - ? WHERE id = ? AND stock >= ?")
            .run(parseInt(item.quantity) || 1, item.itemId, parseInt(item.quantity) || 1);
        }
      }
    }

    // Auto-create fabrication job if order contains both frame and lens items
    if (items && Array.isArray(items)) {
      const getNormType = (i) => (i.type || i.itemType || 'accessory').toLowerCase().trim();
      const frameTypes = ['frame', 'frame_only'];
      const lensTypes = ['lens', 'spectacle_lens', 'spectacle-lens', 'spectacle_lenses', 'spectacle-lenses'];
      
      const hasFrame = items.some(i => frameTypes.includes(getNormType(i)));
      const hasLens = items.some(i => lensTypes.includes(getNormType(i)));
      
      if (hasFrame || hasLens) {
        const frameItems = items.filter(i => frameTypes.includes(getNormType(i)));
        const lensItems = items.filter(i => lensTypes.includes(getNormType(i)));
        
        const frameInfo = frameItems.length > 0 ? JSON.stringify(frameItems.map(f => ({ name: f.name || f.itemName, id: f.itemId, qty: f.quantity }))) : null;
        const lensInfo = lensItems.length > 0 ? JSON.stringify(lensItems.map(l => ({ name: l.name || l.itemName, id: l.itemId, qty: l.quantity }))) : null;
        const rxData = prescription ? JSON.stringify(prescription) : null;
        const isPriority = (notes || '').toLowerCase().includes('urgent') || (notes || '').toLowerCase().includes('rush') || (notes || '').toLowerCase().includes('same-day') ? 'rush' : 'normal';
        
        db.prepare(`
          INSERT INTO fabrication_jobs (order_id, shop_id, branch_id, status, priority, patient_name, frame_info, lens_info, prescription_data, optician_notes)
          VALUES (?, ?, ?, 'queued', ?, ?, ?, ?, ?, ?)
        `).run(orderId, shopId ? parseInt(shopId) : null, branchId ? parseInt(branchId) : null, isPriority, customerName, frameInfo, lensInfo, rxData, notes || null);
      }
    }

    const newOrder = db.prepare(`
      SELECT
        id,
        customer_name as customer,
        order_type as orderType,
        order_date as date,
        delivery_date as deliveryDate,
        status,
        subtotal,
        discount,
        tax,
        total,
        actual_total as actualTotal,
        advance,
        balance,
        notes,
        created_at as createdAt,
        shop_id as shopId,
        branch_id as branchId,
        local_id as localId
      FROM orders
      WHERE id = ?
    `).get(orderId);

    // Log activity
    if (user) {
      logActivity(db, {
        shopId: newOrder.shopId,
        branchId: newOrder.branchId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "create",
        entityType: "order",
        entityId: newOrder.id,
        entityName: `Order #${newOrder.localId || newOrder.id} - ${newOrder.customer}`,
        changes: {
          ...newOrder,
          items: items
        }
      });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
