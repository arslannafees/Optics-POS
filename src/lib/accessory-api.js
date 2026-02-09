"use client";

import { toast } from "sonner";

export async function saveAccessory(form, isEditing, selectedId, currentShop, currentBranch) {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
        ...form,
        brandId: form.brandId ? parseInt(form.brandId) : null,
        cost: parseFloat(form.cost) || 0,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        branchId: currentBranch?.id,
        shopId: currentShop?.id,
        user: { id: user.id, name: user.name, role: user.role }
    };

    const url = isEditing ? `/api/accessories/${selectedId}` : "/api/accessories";
    const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        toast.success(`Accessory ${isEditing ? "updated" : "added"} successfully`);
        return true;
    }
    const errorData = await response.json();
    toast.error(errorData.error || "Failed to save accessory");
    return false;
}

export async function deleteAccessory(id) {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch(`/api/accessories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { id: user.id, name: user.name, role: user.role } }),
    });

    if (res.ok) {
        toast.success("Accessory deleted successfully");
        return true;
    }
    const data = await res.json();
    toast.error(data.error || "Failed to delete accessory");
    return false;
}
