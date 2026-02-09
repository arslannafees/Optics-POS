"use client";

import { toast } from "sonner";

export function useLensActions({ currentShop, currentBranch, isEditing, selectedLens, formData, fetchLenses, setSheetOpen, setDeleteDialogOpen, resetForm }) {
    const handleSubmit = async (e) => {
        e?.preventDefault();
        try {
            const url = isEditing ? `/api/spectacle-lenses/${selectedLens.id}` : "/api/spectacle-lenses";
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, branchId: currentBranch?.id, shopId: currentShop?.id, user: { id: user.id, name: user.name, role: user.role } }),
            });

            if (res.ok) {
                toast.success(isEditing ? "Lens updated" : "Lens added");
                fetchLenses(); setSheetOpen(false); resetForm();
            } else toast.error((await res.json()).error || "Operation failed");
        } catch (error) { toast.error("Failed to save lens"); }
    };

    const handleDelete = async () => {
        if (!selectedLens) return;
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`/api/spectacle-lenses/${selectedLens.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: { id: user.id, name: user.name, role: user.role } }),
            });
            if (res.ok) { toast.success("Lens deleted"); fetchLenses(); setDeleteDialogOpen(false); }
            else toast.error((await res.json()).error || "Failed to delete");
        } catch (error) { toast.error("Failed to delete lens"); }
    };

    return { handleSubmit, handleDelete };
}
