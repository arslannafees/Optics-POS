"use client";

import React from "react";
import { ShoppingCart, DollarSign, Users, Package } from "lucide-react";
import { StatsCard, StatsCardSkeleton } from "@/components/ui/stats-card";

export function DashboardStats({ stats, currency, isLoading }) {
    if (isLoading) return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCardSkeleton /><StatsCardSkeleton /><StatsCardSkeleton /><StatsCardSkeleton />
        </div>
    );

    const config = [
        { title: "Orders", value: stats.totalOrders, icon: ShoppingCart, delay: 100 },
        { title: "Customers", value: stats.totalCustomers, icon: Users, delay: 150 },
        { title: "Revenue", value: `${currency} ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, delay: 200 },
        { title: "Products", value: stats.totalSales.toLocaleString(), icon: Package, delay: 250 },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.map((s) => (
                <StatsCard key={s.title} title={s.title} value={s.value} icon={s.icon} animationDelay={s.delay} />
            ))}
        </div>
    );
}
