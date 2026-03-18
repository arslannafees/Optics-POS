import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth, isAuthError, requireRole, forbiddenResponse } from "@/lib/auth";

export async function GET(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
  try {
    const db = getDb();
    const shops = db.prepare(`
      SELECT 
        id, 
        name, 
        slug,
        CASE WHEN active = 1 THEN 'Active' ELSE 'Inactive' END as status,
        created_at as createdAt
      FROM shops
      ORDER BY created_at DESC
    `).all();

    return NextResponse.json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
  }
}

export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  if (!requireRole(auth, 'super-admin')) return forbiddenResponse("Super-admin access required");
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Shop name is required" }, { status: 400 });
    }

    const db = getDb();
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    // Use a transaction to ensure both shop and its default settings are created
    const createShopWithSettings = db.transaction((shopName, shopSlug) => {
      const result = db.prepare(`
        INSERT INTO shops (name, slug, active)
        VALUES (?, ?, 1)
      `).run(shopName, shopSlug);

      const shopId = result.lastInsertRowid;

      // Default settings to initialize
      const defaultSettings = {
        currency: "PKR",
        taxRate: "18",
        dateFormat: "DD/MM/YYYY",
        invoicePrefix: "INV",
        invoiceStartNumber: "1",
        lowStockThreshold: "5",
        lowStockAlert: "true",
        printerType: "laserjet",
        businessName: shopName
      };

      const insertSetting = db.prepare(`
        INSERT INTO settings (shop_id, key, value) VALUES (?, ?, ?)
      `);

      for (const [key, value] of Object.entries(defaultSettings)) {
        insertSetting.run(shopId, key, value);
      }

      return shopId;
    });

    const shopId = createShopWithSettings(name, slug);

    return NextResponse.json({
      id: shopId,
      name,
      slug,
      status: 'Active',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed: shops.name")) {
      return NextResponse.json({ error: "A shop with this name already exists" }, { status: 400 });
    }
    console.error("Error creating shop:", error);
    return NextResponse.json({ error: "Failed to create shop" }, { status: 500 });
  }
}
