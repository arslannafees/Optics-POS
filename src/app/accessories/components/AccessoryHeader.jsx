"use client";

import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessoryHeader({ onRefresh, onAdd }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Accessories</h1>
                <p className="text-sm text-muted-foreground">Manage your accessory inventory</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
                <Button size="sm" onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Accessory
                </Button>
            </div>
        </div>
    );
}
