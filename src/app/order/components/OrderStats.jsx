"use client";

import React from "react";
import { ShoppingCart, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "@/components/analytics/StatCard";

export function OrderStats({ ordersCount, stats, currency }) {
    const items = [
        { title: "Total Orders", value: ordersCount, icon: ShoppingCart },
        { title: "Total Revenue", value: stats.totalRevenue, icon: DollarSign, p: `${currency} ` },
        { title: "Completed", value: stats.completedOrders, icon: CheckCircle2 },
        { title: "Pending", value: stats.pendingOrders, icon: Clock }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-4">
            {items.map((it, i) => (
                <StatCard key={i} title={it.title} value={it.value} icon={it.icon} prefix={it.p} />
            ))}
        </div>
    );
}
