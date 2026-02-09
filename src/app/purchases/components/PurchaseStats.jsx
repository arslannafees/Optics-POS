"use client";

import React from "react";
import { ShoppingCart, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PurchaseStats({ stats, currency }) {
    const items = [
        { t: "Orders", v: stats.count, i: <ShoppingCart /> },
        { t: "Total", v: `${currency} ${stats.total.toLocaleString()}`, i: <DollarSign /> },
        { t: "Paid", v: `${currency} ${stats.paid.toLocaleString()}`, i: <DollarSign /> },
        { t: "Balance", v: `${currency} ${stats.balance.toLocaleString()}`, i: <Calendar /> },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((it, idx) => (
                <Card key={idx} className="border shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">{it.t}</CardTitle>
                        {React.cloneElement(it.i, { className: "size-4 text-muted-foreground" })}
                    </CardHeader>
                    <CardContent><div className="text-xl font-bold">{it.v}</div></CardContent>
                </Card>
            ))}
        </div>
    );
}
