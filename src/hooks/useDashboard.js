"use client";

import { useState, useEffect, useCallback } from "react";
import { useBranch } from "@/contexts/BranchContext";

export function useDashboard(settings) {
    const { currentShop, currentBranch, loading: branchLoading } = useBranch();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, totalCustomers: 0, totalRevenue: 0 });
    const [chartData, setChartData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [showEmailAlert, setShowEmailAlert] = useState(true);
    const [newLogsCount, setNewLogsCount] = useState(0);
    const [flaggedFabJobs, setFlaggedFabJobs] = useState([]);

    const loadDashboardData = useCallback(async () => {
        if (!currentShop) return;
        setIsLoading(true);
        try {
            const stored = localStorage.getItem('lastLogCheck');
            // Default to epoch (0) so all existing logs show as new on first visit
            const lastCheck = stored || '0';
            const q = new URLSearchParams({ shopId: currentShop.id });
            if (currentBranch) q.append('branchId', currentBranch.id);
            q.append('lastLogCheck', lastCheck);

            const [dashRes, fabRes] = await Promise.all([
                fetch(`/api/dashboard?${q.toString()}`),
                fetch(`/api/fabrication?shopId=${currentShop.id}&status=flagged&limit=50`),
            ]);

            if (dashRes.ok) {
                const data = await dashRes.json();
                setStats({
                    totalOrders: data.counts?.orders || 0,
                    totalSales: data.sales?.monthItemsCount || 0,
                    totalCustomers: data.counts?.customers || 0,
                    totalRevenue: data.sales?.month || 0,
                });
                setChartData(data.chartData || []);
                setRecentOrders(data.recentOrders || []);
                setLowStockItems(data.lowStockItems || []);
                setPendingPayments(data.receivables?.list || []);
                setAlerts(data.alerts || []);
                setNewLogsCount(data.newLogsCount || 0);
            }

            if (fabRes.ok) {
                const fabData = await fabRes.json();
                setFlaggedFabJobs(Array.isArray(fabData) ? fabData : []);
            }
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    }, [currentShop, currentBranch]);

    useEffect(() => {
        if (!branchLoading && currentShop) loadDashboardData();
    }, [currentShop, currentBranch, branchLoading, loadDashboardData]);

    return {
        isLoading, stats, chartData, recentOrders, lowStockItems, pendingPayments, alerts,
        showEmailAlert, setShowEmailAlert, newLogsCount, setNewLogsCount, loadDashboardData,
        flaggedFabJobs, setFlaggedFabJobs,
    };
}
