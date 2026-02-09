"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LowStockAlert({ items, show, onDismiss, settings }) {
    if (!show || items.length === 0 || !settings?.emailNotifications) return null;

    return (
        <div className="fixed top-6 right-6 z-50 w-80 bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-xl overflow-hidden animate-slide-in-right ring-1 ring-black/5 dark:ring-white/10">
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                    <span className="font-medium text-sm">Low Stock Alert</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted" onClick={onDismiss}>
                    <X className="h-4 w-4" /><span className="sr-only">Dismiss</span>
                </Button>
            </div>
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-border/50">
                    {items.slice(0, 10).map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors">
                            <div className="min-w-0 pr-3"><p className="text-sm font-medium truncate">{item.name}</p><p className="text-xs text-muted-foreground">{item.type}</p></div>
                            <span className="flex items-center h-6 px-2 rounded-md bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 text-xs font-medium whitespace-nowrap">{item.stock} left</span>
                        </div>
                    ))}
                </div>
                {items.length >= 10 && <div className="p-3 text-xs text-center text-muted-foreground border-t bg-muted/10">Displaying top 10 low stock items</div>}
            </div>
        </div>
    );
}
