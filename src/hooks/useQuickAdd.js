"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useQuickAdd(currentShop, currentBranch, refreshMeta) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("frame");
    const [loading, setLoading] = useState(false);
    const [activeRowId, setActiveRowId] = useState(null);

    const add = async (formData) => {
        if (!currentShop) return;
        setLoading(true);
        try {
            const ep = { frame: "/api/frames", lens: "/api/spectacle-lenses", "contact-lens": "/api/contact-lenses", accessory: "/api/accessories" };
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(ep[type], {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, shopId: currentShop.id, branchId: currentBranch?.id || 1, user: { id: user.id, name: user.name, role: user.role } }),
            });
            if (res.ok) {
                const item = await res.json(); toast.success(`${type} added`);
                await refreshMeta(); setOpen(false); return item;
            }
            const err = await res.json(); toast.error(err.error || "Failed");
        } finally { setLoading(false); }
    };

    return { open, setOpen, type, setType, loading, activeRowId, setActiveRowId, add };
}
