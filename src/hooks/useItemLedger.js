"use client";

import { useState, useEffect } from "react";

export function useItemLedger(currentShop) {
    const [filters, setFilters] = useState({ itemType: "All", brand: "All", itemId: "All", branch: "All", fromDate: "", toDate: "" });
    const [data, setData] = useState({ brands: [], items: [], branches: [], ledger: [] });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const fetchInitial = async () => {
        try {
            setInitialLoading(true);
            const [brR, bcR] = await Promise.all([fetch("/api/brands"), currentShop ? fetch(`/api/branches?shopId=${currentShop.id}`) : Promise.resolve({ ok: false })]);
            const [br, bc] = await Promise.all([brR.ok ? brR.json() : [], bcR.ok ? bcR.json() : []]);
            setData(p => ({ ...p, brands: br, branches: bc }));
            await fetchItems(filters.itemType);
        } finally { setInitialLoading(false); }
    };

    const fetchItems = async (type) => {
        try {
            const ep = type === "All"
                ? ["/api/frames", "/api/spectacle-lenses", "/api/contact-lenses", "/api/accessories"]
                : type === "Spectacle" ? ["/api/spectacle-lenses"]
                    : type === "Contact" ? ["/api/contact-lenses"]
                        : type === "Accessory" ? ["/api/accessories"]
                            : ["/api/frames"]; // Default to Frame if type is Frame or other
            const res = await Promise.all(ep.map(u => fetch(u)));
            const items = (await Promise.all(res.map(r => r.ok ? r.json() : []))).flat();
            setData(p => ({
                ...p,
                items: type === "Frame" ? items.filter(i => ["glass", "frame", "Glass", "Frame"].includes(i.category) || !i.category) : items
            }));
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchInitial(); }, [currentShop]);
    useEffect(() => { if (!initialLoading) { fetchItems(filters.itemType); setFilters(p => ({ ...p, brand: "All" })); } }, [filters.itemType]);

    const search = async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams({ itemId: filters.itemId, itemType: filters.itemType });
            if (currentShop?.id) q.append("shopId", currentShop.id);
            if (filters.branch !== "All") q.append("branchId", filters.branch);
            if (filters.fromDate) q.append("fromDate", filters.fromDate);
            if (filters.toDate) q.append("toDate", filters.toDate);
            const res = await fetch(`/api/reports/item-ledger?${q}`);
            if (res.ok) { const ld = await res.json(); setData(p => ({ ...p, ledger: ld })); }
        } finally { setLoading(false); }
    };

    return { filters, setFilters, data, loading, initialLoading, search };
}
