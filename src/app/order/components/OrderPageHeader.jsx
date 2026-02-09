"use client";

import React from "react";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderPageHeader({ onRefresh, isRefreshing }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
                <p className="text-sm text-muted-foreground">Manage and track customer orders</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button size="sm" asChild>
                    <Link href="/order/new"><Plus className="mr-2 h-4 w-4" /> New Order</Link>
                </Button>
            </div>
        </div>
    );
}
