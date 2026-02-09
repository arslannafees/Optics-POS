"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useReceivableReport(currentShop) {
    const [data, setData] = useState({ receivables: [], customers: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const fetchCustomers = async () => {
        if (!currentShop) return;
        try {
            const res = await fetch(`/api/customers?shopId=${currentShop.id}`);
            if (res.ok) {
                const d = await res.json();
                setData(p => ({
                    ...p, customers: d.map(c => ({
                        ...c, name: `${c.firstName} ${c.lastName || ""}`.trim(),
                        searchValue: `${c.firstName} ${c.lastName || ""} ${c.mobile || ""} ${c.phone || ""}`.toLowerCase()
                    }))
                }));
            }
        } catch (e) { console.error(e); }
    };

    const fetchReceivables = async (p = {}) => {
        try {
            setLoading(true);
            if (currentShop?.id) p.shopId = currentShop.id;
            const res = await fetch(`/api/reports/receivable?${new URLSearchParams(p)}`);
            if (res.ok) {
                const d = await res.json();
                setData(prev => ({ ...prev, receivables: d }));
            } else toast.error("Failed to fetch data");
        } finally { setLoading(false); }
    };

    useEffect(() => { if (currentShop) { fetchReceivables(); fetchCustomers(); } }, [currentShop]);

    return { data, loading, fetchReceivables, searchQuery, setSearchQuery, selectedId, setSelectedId };
}
