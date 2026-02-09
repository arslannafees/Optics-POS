"use client";

import { toast } from "sonner";

export async function submitOrder(formData, editId, currentShop, branchId, user) {
    const orderData = {
        ...formData,
        items: formData.items.map(i => ({ ...i, price: parseFloat(i.price) || 0, quantity: parseInt(i.quantity) || 0 })),
        branchId: branchId ? parseInt(branchId) : (parseInt(formData.branchId) || 1),
        shopId: currentShop?.id,
        user
    };
    const res = await fetch(editId ? `/api/orders/${editId}` : "/api/orders", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    });
    if (res.ok) {
        toast.success(editId ? "Order updated" : "Order created");
        return true;
    }
    const err = await res.json();
    toast.error(err.error || "Failed to save order");
    return false;
}

export async function fetchOrderForEdit(id, setFormData) {
    try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) return;
        const o = await res.json();
        setFormData({
            ...o,
            customerId: o.customerId?.toString() || "",
            branchId: o.branchId?.toString() || "",
            paid: o.paid ?? "",
            discountPercentage: o.discountPercentage ?? "",
            remarks: o.remarks ?? "",
            items: o.items.map(i => ({ id: i.id, type: i.itemType, itemId: i.itemId?.toString() || "", name: i.itemName, price: i.price ?? "", quantity: i.quantity ?? "" })),
            prescription: o.prescription || {}
        });
    } catch (e) { toast.error("Failed to load order"); }
}

export async function fetchLatestRx(customerId, setFormData) {
    try {
        const res = await fetch(`/api/customers/${customerId}/prescriptions`);
        if (!res.ok) return;
        const pxs = await res.json();
        if (pxs.length === 0) return toast.info("No prescriptions found");
        const latest = pxs[0];
        setFormData(prev => ({ ...prev, prescription: { ...latest, pdType: latest.pdType || "dual" } }));
        toast.success("Prescription loaded");
    } catch (e) { toast.error("Failed to load latest prescription"); }
}
