"use client";

import { useState } from "react";
import { toast } from "sonner";

export function usePurchaseActions(refresh) {
    const [selected, setSelected] = useState(null);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const view = async (p) => {
        setSelected(p); setLoading(true);
        try {
            const res = await fetch(`/api/purchases/${p.id}`);
            if (res.ok) setDetails(await res.json());
        } finally { setLoading(false); }
    };

    const pay = async (amount) => {
        if (!selected) return;
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await fetch(`/api/purchases/${selected.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paid: parseFloat(selected.paid) + parseFloat(amount), user: { id: user.id, name: user.name, role: user.role } }),
        });
        if (res.ok) { toast.success("Payment recorded"); refresh(); return true; }
        return false;
    };

    const remove = async () => {
        if (!selected) return;
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await fetch(`/api/purchases/${selected.id}`, {
            method: "DELETE", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: { id: user.id, name: user.name, role: user.role } }),
        });
        if (res.ok) { toast.success("Deleted"); refresh(); return true; }
        return false;
    };

    return { selected, setSelected, details, loading, view, pay, remove };
}
