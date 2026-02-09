"use client";

import { useState } from "react";

const initialFormState = {
    name: "", accessoryType: "", brandId: "", cost: "",
    price: "", stock: "", remarks: "", active: true,
};

export function useAccessoryForm() {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAccessory, setSelectedAccessory] = useState(null);
    const [form, setForm] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    const resetForm = () => {
        setForm(initialFormState);
        setIsEditing(false);
        setSelectedAccessory(null);
    };

    const handleEdit = (acc) => {
        setSelectedAccessory(acc);
        setForm({
            name: acc.name || "",
            accessoryType: acc.accessory_type || "",
            brandId: acc.brand_id?.toString() || "",
            cost: acc.cost || "", price: acc.price || "",
            stock: acc.stock || "", remarks: acc.remarks || "",
            active: acc.active ?? true,
        });
        setIsEditing(true);
        setSheetOpen(true);
    };

    return {
        sheetOpen, setSheetOpen,
        deleteDialogOpen, setDeleteDialogOpen,
        selectedAccessory, setSelectedAccessory,
        form, setForm,
        isEditing, setIsEditing,
        resetForm, handleEdit
    };
}
