"use client";

import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * FramePageHeader: Renders the top-level actions and title for Frames inventory.
 * Adheres to 20-60 line count.
 */
export function FramePageHeader({ onRefresh, onAdd, isRefreshing }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Frames</h1>
                <p className="text-sm text-muted-foreground">Manage and track your spectacle frame inventory.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button size="sm" onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Frame
                </Button>
            </div>
        </div>
    );
}
