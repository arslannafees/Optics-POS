"use client";

import React from "react";
import { Eye, Layers, Package, DollarSign } from "lucide-react";
import { StatCard } from "@/components/analytics/StatCard";

export function LensStats({ stats, currency }) {
    const items = [
        { title: "Total Lenses", value: stats.totalLenses, icon: Eye },
        { title: "Active", value: stats.activeLenses, icon: Layers },
        { title: "Total Stock", value: stats.totalStock, icon: Package },
        { title: "Stock Value", value: stats.totalValue, icon: DollarSign, p: `${currency} ` }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-4">
            {items.map((it, i) => (
                <StatCard key={i} title={it.title} value={it.value} icon={it.icon} prefix={it.p} />
            ))}
        </div>
    );
}
