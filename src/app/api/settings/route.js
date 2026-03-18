import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { logActivity } from "@/lib/log-activity";
import { verifyAuth, isAuthError, requireShop, forbiddenResponse } from "@/lib/auth";

// GET all settings for a specific shop
export async function GET(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId") || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

    const db = getDb();
    const settings = db.prepare("SELECT * FROM settings WHERE shop_id = ?").all(shopId);

    // Convert to key-value object
    const settingsObj = {};
    for (const setting of settings) {
      if (setting.key !== 'creator_pin') {
        settingsObj[setting.key] = setting.value;
      }
    }

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST/PUT update settings
export async function POST(req) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const body = await req.json();
    const { user, ...settingsData } = body;

    // SECURITY: Enforce tenant isolation — use JWT shopId, ignore body shopId
    const shopId = body.shopId || auth.shopId;
    if (!requireShop(auth, shopId)) return forbiddenResponse("Access denied to this shop");

    if (!shopId) {
      return NextResponse.json({ error: "Shop ID is required" }, { status: 400 });
    }

    const db = getDb();

    // Get old settings for logging
    const oldSettings = db.prepare("SELECT * FROM settings WHERE shop_id = ?").all(shopId);
    const oldSettingsObj = {};
    for (const setting of oldSettings) {
      if (setting.key !== 'creator_pin') {
        oldSettingsObj[setting.key] = setting.value;
      }
    }

    const upsert = db.prepare(`
      INSERT INTO settings (key, value, shop_id) VALUES (?, ?, ?)
      ON CONFLICT(shop_id, key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    const updateMany = db.transaction((settings) => {
      for (const [key, value] of Object.entries(settings)) {
        upsert.run(key, String(value), shopId);
      }
    });

    updateMany(settingsData);

    // Return updated settings
    const settings = db.prepare("SELECT * FROM settings WHERE shop_id = ?").all(shopId);
    const settingsObj = {};
    for (const setting of settings) {
      if (setting.key !== 'creator_pin') {
        settingsObj[setting.key] = setting.value;
      }
    }

    // Log activity
    if (user) {
      logActivity(db, {
        shopId,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "update",
        entityType: "settings",
        entityId: shopId,
        entityName: "Shop Settings",
        changes: {
          old: oldSettingsObj,
          new: settingsObj
        }
      });
    }

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
