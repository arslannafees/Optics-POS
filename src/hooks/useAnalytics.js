"use client";

import { useState, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";

export function useAnalytics() {
    const { currentBranch, loading: branchLoading } = useBranch();
    const [period, setPeriod] = useState("year");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableYears, setAvailableYears] = useState([new Date().getFullYear().toString()]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
    });

    useEffect(() => {
        if (!branchLoading) loadAnalyticsData();
    }, [period, selectedYear, currentBranch, branchLoading]);

    const loadAnalyticsData = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({ period, year: selectedYear });
            if (currentBranch) queryParams.append('branchId', currentBranch.id);

            const response = await fetch(`/api/analytics?${queryParams.toString()}`);
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setStats(data.stats);
            setSalesData(data.salesData.map(item => ({ ...item, name: item.month || item.label })));
            setCategoryData(data.categoryData);
            setTopProducts(data.topProducts);

            if (data.availableYears) {
                const startYear = Math.min(parseInt(data.availableYears.min), new Date().getFullYear() - 4);
                setAvailableYears(Array.from({ length: new Date().getFullYear() - startYear + 1 }, (_, i) => (new Date().getFullYear() - i).toString()));
            }
        } catch (error) {
            console.error("Failed to load analytics data:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        period, setPeriod,
        selectedYear, setSelectedYear,
        salesData, categoryData, topProducts,
        loading, availableYears, stats
    };
}
