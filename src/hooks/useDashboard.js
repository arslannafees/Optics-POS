"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { toast } from "sonner";

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
    const prevTotalRef = useRef(null);

    const loadDashboardData = useCallback(async (silent = false) => {
        if (!currentShop) return;
        if (!silent) setIsLoading(true);
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

            let dashData = null;
            let fabData = [];

            if (dashRes.ok) {
                dashData = await dashRes.json();
                setStats({
                    totalOrders: dashData.counts?.orders || 0,
                    totalSales: dashData.sales?.monthItemsCount || 0,
                    totalCustomers: dashData.counts?.customers || 0,
                    totalRevenue: dashData.sales?.month || 0,
                });
                setChartData(dashData.chartData || []);
                setRecentOrders(dashData.recentOrders || []);
                setLowStockItems(dashData.lowStockItems || []);
                setPendingPayments(dashData.receivables?.list || []);
                setAlerts(dashData.alerts || []);
                setNewLogsCount(dashData.newLogsCount || 0);
            }

            if (fabRes.ok) {
                const data = await fabRes.json();
                fabData = Array.isArray(data) ? data : [];
                setFlaggedFabJobs(fabData);
            }

            // Notification Reminder Logic - Consolidate counts from both responses
            if (dashRes.ok || fabRes.ok) {
                const currentTotal = (dashData?.alerts?.length || 0) +
                    (dashData?.lowStockItems?.length || 0) +
                    (dashData?.receivables?.list?.length || 0) +
                    (fabData?.length || 0);

                if (prevTotalRef.current !== null && currentTotal > prevTotalRef.current) {
                    toast.info("You have new notifications", {
                        description: "Check the notification bell for details",
                        duration: 5000,
                    });
                }
                prevTotalRef.current = currentTotal;
            }
        } catch (error) { console.error(error); } finally { if (!silent) setIsLoading(false); }
    }, [currentShop, currentBranch]);

    useEffect(() => {
        if (!branchLoading && currentShop) {
            loadDashboardData();
            const interval = setInterval(() => loadDashboardData(true), 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [currentShop, currentBranch, branchLoading, loadDashboardData]);

    return {
        isLoading, stats, chartData, recentOrders, lowStockItems, pendingPayments, alerts,
        showEmailAlert, setShowEmailAlert, newLogsCount, setNewLogsCount, loadDashboardData,
        flaggedFabJobs, setFlaggedFabJobs,
    };
}
