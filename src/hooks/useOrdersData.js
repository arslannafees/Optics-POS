"use client";

import { useState, useEffect, useMemo } from "react";

export function useOrdersData(currentBranch, branchLoading) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const query = currentBranch ? `?branchId=${currentBranch.id}` : "";
            const res = await fetch(`/api/orders${query}`);
            if (res.ok) setOrders(await res.json());
            else { const s = localStorage.getItem("orders"); if (s) setOrders(JSON.parse(s)); }
        } catch (e) { const s = localStorage.getItem("orders"); if (s) setOrders(JSON.parse(s)); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { if (!branchLoading) loadOrders() }, [currentBranch, branchLoading]);

    const stats = useMemo(() => ({
        totalRevenue: orders.reduce((s, o) => s + (o.total || 0), 0),
        completedOrders: orders.filter(o => o.status === "completed").length,
        pendingOrders: orders.filter(o => o.status === "pending").length,
        uniqueCustomers: new Set(orders.map(o => o.customer)).size
    }), [orders]);

    return { orders, setOrders, isLoading, loadOrders, stats };
}
