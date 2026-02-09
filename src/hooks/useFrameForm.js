"use client";

import { useState } from "react";

const initialForm = { brand: "", model: "", size: "", color: "", shape: "", material: "", cost: "", price: "", barcode: "", stock: "", openingBalance: "", remarks: "", active: true };

export function useFrameForm() {
    const [form, setForm] = useState(initialForm);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const resetForm = () => { setForm(initialForm); setIsEditing(false); setSelectedFrame(null); };

    const editFrame = (f) => {
        setSelectedFrame(f); setForm({ ...f });
        setIsEditing(true); setSheetOpen(true);
    };

    return { form, setForm, sheetOpen, setSheetOpen, selectedFrame, setSelectedFrame, isEditing, setIsEditing, resetForm, editFrame };
}
