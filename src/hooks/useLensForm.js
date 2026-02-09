"use client";

import { useState } from "react";

export function useLensForm() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedLens, setSelectedLens] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        brand: "", name: "", type: "", material: "", coating: "",
        cost: "", price: "", stock: "", remarks: "", active: true,
    });

    const resetForm = () => {
        setFormData({ brand: "", name: "", type: "", material: "", coating: "", cost: "", price: "", stock: "", remarks: "", active: true });
        setSelectedLens(null); setIsEditing(false);
    };

    const startEdit = (lens) => {
        setSelectedLens(lens);
        setFormData({
            brand: lens.brand || "", name: lens.name || "", type: lens.type || "", material: lens.material || "",
            coating: lens.coating || "", cost: lens.cost?.toString() || "", price: lens.price?.toString() || "",
            stock: lens.stock?.toString() || "", remarks: lens.remarks || "", active: lens.active === 1 || lens.active === true,
        });
        setIsEditing(true); setSheetOpen(true);
    };

    return { sheetOpen, setSheetOpen, selectedLens, setSelectedLens, isEditing, setIsEditing, formData, setFormData, resetForm, startEdit };
}
