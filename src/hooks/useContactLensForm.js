"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useContactLensForm(refresh, shopId, branchId) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedLens, setSelectedLens] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        brand: "", name: "", type: "", replacementSchedule: "", baseCurve: "",
        diameter: "", waterContent: "", material: "", sph: "", cyl: "",
        axis: "", addPower: "", dominance: "", uvProtection: false,
        oxygenPermeability: "", eyeSide: "", expiryDate: "", color: "",
        cost: "", price: "", stock: "", remarks: "", active: true,
    });

    const resetForm = useCallback(() => {
        setFormData({
            brand: "", name: "", type: "", replacementSchedule: "", baseCurve: "",
            diameter: "", waterContent: "", material: "", sph: "", cyl: "",
            axis: "", addPower: "", dominance: "", uvProtection: false,
            oxygenPermeability: "", eyeSide: "", expiryDate: "", color: "",
            cost: "", price: "", stock: "", remarks: "", active: true,
        });
        setIsEditing(false); setSelectedLens(null);
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/api/contact-lenses/${selectedLens.id}` : "/api/contact-lenses";
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const res = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, shopId, branchId, user: { id: user.id, name: user.name, role: user.role } }),
            });
            if (res.ok) {
                toast.success("Success"); refresh(); setSheetOpen(false); resetForm();
            } else toast.error("Error");
        } catch (s) { toast.error("Failed"); }
    };

    const handleDelete = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const res = await fetch(`/api/contact-lenses/${selectedLens.id}`, {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: { id: user.id, name: user.name, role: user.role } }),
            });
            if (res.ok) { toast.success("Deleted"); refresh(); setDeleteDialogOpen(false); }
        } catch (e) { toast.error("Failed"); }
    };

    return { sheetOpen, setSheetOpen, deleteDialogOpen, setDeleteDialogOpen, selectedLens, setSelectedLens, formData, setFormData, isEditing, setIsEditing, onSubmit, handleDelete, resetForm };
}
