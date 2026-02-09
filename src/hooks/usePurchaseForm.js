"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function usePurchaseForm(currentShop, currentBranch, settings, refresh) {
    const [formData, setFormData] = useState({
        vendorId: "", invoiceNumber: "", date: new Date().toISOString().split("T")[0],
        subtotal: "0", discount: "0", tax: "0", total: "0", paid: "", paymentMethod: "cash", remarks: "", items: [],
    });

    const reset = () => setFormData({
        vendorId: "", invoiceNumber: "", date: new Date().toISOString().split("T")[0],
        subtotal: "0", discount: "0", tax: "0", total: "0", paid: "", paymentMethod: "cash", remarks: "", items: [],
    });

    useEffect(() => {
        const sub = formData.items.length > 0
            ? formData.items.reduce((s, i) => s + (parseFloat(i.cost) || 0) * (parseFloat(i.quantity) || 0), 0)
            : (parseFloat(formData.subtotal) || 0);
        const dIn = parseFloat(formData.discount) || 0;
        const d = settings?.discountType === "percentage" ? (sub * dIn) / 100 : dIn;
        const t = parseFloat(formData.tax) || 0;
        setFormData(p => ({ ...p, subtotal: sub.toFixed(2), total: (sub - d + t).toFixed(2) }));
    }, [formData.items, formData.subtotal, formData.discount, formData.tax, settings?.discountType]);

    const submit = async (e) => {
        if (e) e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await fetch("/api/purchases", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, shopId: currentShop?.id, branchId: currentBranch?.id, user: { id: user.id, name: user.name, role: user.role } }),
        });
        if (res.ok) { toast.success("Purchase created"); refresh(); reset(); return true; }
        const err = await res.json(); toast.error(err.error || "Failed"); return false;
    };

    return { formData, setFormData, reset, submit };
}
