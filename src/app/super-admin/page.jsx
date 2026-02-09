"use client";

import React, { useState, useEffect } from "react";
import { Users, Store, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        totalAccounts: 0,
        totalShops: 0,
        totalBranches: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/super-admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Accounts",
            value: stats.totalAccounts,
            description: "Registered users in system",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Total Shops",
            value: stats.totalShops,
            description: "Registered business entities",
            icon: Store,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Total Branches",
            value: stats.totalBranches,
            description: "Active physical locations",
            icon: MapPin,
            color: "text-red-600",
            bg: "bg-red-50"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Overview of the system status and accounts.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card, idx) => (
                    <Card key={idx} className="border-0 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                                    <div className="mt-2 flex items-baseline">
                                        {loading ? (
                                            <Skeleton className="h-10 w-16" />
                                        ) : (
                                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                                {card.value}
                                            </h2>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400 font-medium">{card.description}</p>
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl transition-all duration-300",
                                    "bg-gray-50 text-gray-400 group-hover:shadow-lg",
                                    card.bg && `group-hover:${card.bg}`,
                                    card.color && `group-hover:${card.color}`
                                )}>
                                    <card.icon className="size-6 transition-transform group-hover:scale-110" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
