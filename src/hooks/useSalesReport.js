"use client";

import { useState, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";

export function useSalesReport() {
    const { currentShop } = useBranch();
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [filters, setFilters] = useState({
        branch: "All", orderType: "All", productType: "All",
        product: "All", customer: "All", fromDate: "", toDate: ""
    });
    const [meta, setMeta] = useState({
        customers: [], frames: [], lenses: [], accessories: [], branches: []
    });

    useEffect(() => {
        if (!currentShop) return;
        const load = async () => {
            const q = `shopId=${currentShop.id}`;
            const [cr, fr, lr, ar, br] = await Promise.all([
                fetch(`/api/customers?${q}`), fetch(`/api/frames?${q}`),
                fetch(`/api/spectacle-lenses?${q}`), fetch(`/api/accessories?${q}`),
                fetch(`/api/branches?shopId=${currentShop.id}`),
            ]);
            const [c, f, l, a, b] = await Promise.all([
                cr.ok ? cr.json() : [], fr.ok ? fr.json() : [],
                lr.ok ? lr.json() : [], ar.ok ? ar.json() : [],
                br.ok ? br.json() : []
            ]);
            setMeta({
                customers: c.map(x => ({ id: x.id.toString(), name: `${x.firstName} ${x.lastName || ""}`.trim() })),
                frames: f, lenses: l, accessories: a, branches: b
            });
        };
        load();
    }, [currentShop]);

    const search = async () => {
        setLoading(true);
        const p = new URLSearchParams();
        if (currentShop?.id) p.append("shopId", currentShop.id);
        if (filters.customer !== "All") p.append("customerId", filters.customer);
        if (filters.orderType !== "All") p.append("orderType", filters.orderType);
        if (filters.branch !== "All") p.append("branchId", filters.branch);
        if (filters.productType !== "All") p.append("itemType", filters.productType);
        if (filters.product !== "All") p.append("itemId", filters.product);
        if (filters.fromDate) p.append("fromDate", filters.fromDate);
        if (filters.toDate) p.append("toDate", filters.toDate);
        try {
            const res = await fetch(`/api/reports/sales?${p.toString()}`);
            if (res.ok) setReportData(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const totals = {
        amount: reportData.reduce((s, i) => s + (i.total || 0), 0),
        received: reportData.reduce((s, i) => s + (i.advance || 0), 0),
        balance: reportData.reduce((s, i) => s + (i.balance || 0), 0)
    };

    return { filters, setFilters, meta, reportData, loading, search, totals };
}
