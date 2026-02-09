"use client";

import { useState, useEffect } from "react";

export function useCollectionReport(currentShop) {
    const [filters, setFilters] = useState({ branch: "All", orderType: "All", fromDate: "", toDate: "" });
    const [branches, setBranches] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentShop) return;
        fetch(`/api/branches?shopId=${currentShop.id}`).then(r => r.ok && r.json().then(setBranches));
    }, [currentShop]);

    const search = async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams();
            if (currentShop?.id) q.append("shopId", currentShop.id);
            if (filters.orderType !== "All") q.append("orderType", filters.orderType);
            if (filters.branch !== "All") q.append("branchId", filters.branch);
            if (filters.fromDate) q.append("fromDate", filters.fromDate);
            if (filters.toDate) q.append("toDate", filters.toDate);
            const res = await fetch(`/api/reports/collection?${q}`);
            setData(res.ok ? await res.json() : []);
        } finally { setLoading(false); }
    };

    const sums = data.reduce((s, i) => ({
        total: s.total + (i.total || 0),
        deposit: s.deposit + (i.deposit || 0),
        balance: s.balance + (i.balance || 0)
    }), { total: 0, deposit: 0, balance: 0 });

    return { filters, setFilters, branches, data, loading, search, sums };
}
