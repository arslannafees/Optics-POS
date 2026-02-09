"use client";

import React from "react";
import { Glasses, Package, DollarSign } from "lucide-react";
import { StatCard } from "@/components/analytics/StatCard";

export function FrameStats({ stats, currency, lowStockCount }) {
    const items = [
        { title: "Total Frames", value: stats.totalFrames, icon: Glasses },
        { title: "Total Stock", value: stats.totalStock, icon: Package },
        { title: "Stock Value", value: stats.totalValue, icon: DollarSign, p: `${currency} ` },
        { title: "Low Stock", value: lowStockCount, icon: Package }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-4">
            {items.map((it, i) => (
                <StatCard key={i} title={it.title} value={it.value} icon={it.icon} prefix={it.p} />
            ))}
        </div>
    );
}
