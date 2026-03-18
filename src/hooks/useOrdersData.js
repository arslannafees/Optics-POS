"use client";

import { useState, useEffect, useMemo } from "react";

export function useOrdersData(currentBranch, branchLoading) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadOrders = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const query = currentBranch ? `?branchId=${currentBranch.id}` : "";
            const res = await fetch(`/api/orders${query}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                localStorage.setItem("orders", JSON.stringify(data));
            } else {
                const s = localStorage.getItem("orders");
                if (s) setOrders(JSON.parse(s));
            }
        } catch (e) {
            const s = localStorage.getItem("orders");
            if (s) setOrders(JSON.parse(s));
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!branchLoading) {
            loadOrders();
            const interval = setInterval(() => loadOrders(true), 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [currentBranch, branchLoading]);

    const stats = useMemo(() => ({
        totalRevenue: orders.reduce((s, o) => s + (o.total || 0), 0),
        completedOrders: orders.filter(o => o.status === "completed").length,
        pendingOrders: orders.filter(o => o.status === "pending").length,
        uniqueCustomers: new Set(orders.map(o => o.customer)).size
    }), [orders]);

    return { orders, setOrders, isLoading, loadOrders, stats };
}
