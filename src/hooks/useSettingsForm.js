"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useSettings as useSettingsCtx } from "@/contexts/SettingsContext";

export function useSettingsForm(currentShopId) {
    const { refreshSettings } = useSettingsCtx();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        businessName: "", businessAddress: "", businessPhone: "", businessEmail: "", gstNumber: "", businessLogo: "",
        invoicePrefix: "INV", invoiceStartNumber: "1", invoiceTerms: "", customerMessage: "", showLogo: true,
        lowStockAlert: true, lowStockThreshold: "5", emailNotifications: false, alertMuteDuration: "refresh",
        currency: "PKR", dateFormat: "DD/MM/YYYY", taxRate: "18", discountType: "percentage",
        taxApplication: "pre-tax", prescriptionInputType: "manual", printerType: "laserjet", eyeCheckupFee: "0",
        roundOffTotal: "false"
    });

    useEffect(() => {
        if (currentShopId) {
            setLoading(true);
            fetch(`/api/settings?shopId=${currentShopId}`)
                .then(r => r.ok ? r.json() : {})
                .then(d => setSettings(p => ({ ...p, ...d })))
                .finally(() => setLoading(false));
        }
    }, [currentShopId]);

    const update = useCallback((k, v) => setSettings(p => ({ ...p, [k]: v })), []);

    const save = async () => {
        if (!currentShopId) return toast.error("Shop ID missing");
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...settings, shopId: currentShopId }),
            });
            if (res.ok) { toast.success("Saved", { duration: 1500 }); refreshSettings(); }
        } catch (e) { toast.error("Error"); } finally { setSaving(false); }
    };

    return { settings, loading, saving, update, save };
}
