"use client";

import { useState, useEffect } from "react";

export function usePurchasesReport(currentShop) {
    const [filters, setFilters] = useState({ branch: "All", productType: "All", product: "All", vendor: "All", fromDate: "", toDate: "" });
    const [meta, setMeta] = useState({ vendors: [], frames: [], lenses: [], branches: [] });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentShop) return;
        const fetchMeta = async () => {
            const q = `shopId=${currentShop.id}`;
            const [vr, fr, lr, br] = await Promise.all([
                fetch(`/api/vendors?${q}`), fetch(`/api/frames?${q}`),
                fetch(`/api/spectacle-lenses?${q}`), fetch(`/api/branches?shopId=${currentShop.id}`)
            ]);
            setMeta({
                vendors: vr.ok ? await vr.json() : [], frames: fr.ok ? await fr.json() : [],
                lenses: lr.ok ? await lr.json() : [], branches: br.ok ? await br.json() : []
            });
        };
        fetchMeta();
    }, [currentShop]);

    const search = async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams();
            if (currentShop?.id) q.append("shopId", currentShop.id);
            if (filters.vendor !== "All") q.append("vendorId", filters.vendor);
            if (filters.branch !== "All") q.append("branchId", filters.branch);
            if (filters.fromDate) q.append("fromDate", filters.fromDate);
            if (filters.toDate) q.append("toDate", filters.toDate);
            const res = await fetch(`/api/purchases?${q}`);
            setData(res.ok ? await res.json() : []);
        } finally { setLoading(false); }
    };

    return { filters, setFilters, meta, data, loading, search };
}
