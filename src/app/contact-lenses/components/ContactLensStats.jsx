"use client";

import React from "react";
import { Package, Layers, DollarSign } from "lucide-react";
import { StatCard } from "@/components/analytics/StatCard";

export function ContactLensStats({ stats, currency }) {
    const items = [
        { title: "Total Types", value: stats.total, icon: Package },
        { title: "Active Lenses", value: stats.active, icon: Layers },
        { title: "Total Stock", value: stats.stock, icon: Package },
        { title: "Stock Value", value: stats.value, icon: DollarSign, p: `${currency} ` }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((it, i) => (
                <StatCard key={i} title={it.title} value={it.value} icon={it.icon} prefix={it.p} />
            ))}
        </div>
    );
}
