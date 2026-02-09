"use client";

import { toast } from "sonner";

export function useFrameActions({ currentShop, currentBranch, isEditing, selectedFrame, form, loadFrames, setSheetOpen, setDeleteDialogOpen, setFrames, resetForm }) {
    const handleSubmit = async (e) => {
        e?.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        const payload = { ...form, cost: parseFloat(form.cost) || 0, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0, branchId: currentBranch?.id, shopId: currentShop?.id, user: { id: user.id, name: user.name, role: user.role } };
        try {
            const url = isEditing ? `/api/frames/${selectedFrame.id}` : "/api/frames";
            const res = await fetch(url, { method: isEditing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            if (res.ok) { toast.success(`Frame ${isEditing ? "updated" : "added"}`); loadFrames(); setSheetOpen(false); resetForm(); }
            else toast.error("Failed to save");
        } catch (e) { toast.error("Something went wrong"); }
    };

    const deleteFrame = async () => {
        if (!selectedFrame) return;
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`/api/frames/${selectedFrame.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user: { id: user.id, name: user.name, role: user.role } }) });
            if (res.ok) { setFrames(prev => prev.filter(f => f.id !== selectedFrame.id)); toast.success("Deleted"); setDeleteDialogOpen(false); }
        } catch (e) { toast.error("Failed to delete"); }
    };

    const toggleActive = async (f) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const payload = { ...f, active: !f.active, user: { id: user.id, name: user.name, role: user.role } };
        try {
            const res = await fetch(`/api/frames/${f.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            if (res.ok) setFrames(prev => prev.map(it => it.id === f.id ? { ...it, active: !f.active } : it));
        } catch (e) { toast.error("Update failed"); }
    };

    return { handleSubmit, deleteFrame, toggleActive };
}
