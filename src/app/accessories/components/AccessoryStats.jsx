"use client";

import React from "react";
import { Sparkles, DollarSign, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccessoryStats({ accessories, currency, threshold }) {
    const stockValue = accessories.reduce((sum, a) =>
        sum + ((parseFloat(a.cost) || 0) * (parseInt(a.stock) || 0)), 0
    );
    const lowStockCount = accessories.filter((a) =>
        (parseInt(a.stock) || 0) <= threshold
    ).length;

    const stats = [
        { title: "Total Items", value: accessories.length, icon: Sparkles },
        { title: "Stock Value", value: `${currency} ${stockValue.toLocaleString()}`, icon: DollarSign },
        { title: "Low Stock", value: lowStockCount, icon: Tag },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.title} className="border shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
