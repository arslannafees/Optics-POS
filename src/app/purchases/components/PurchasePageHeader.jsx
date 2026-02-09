"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PurchasePageHeader: Title and primary action button for Purchases.
 */
export function PurchasePageHeader({ onNew }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Purchases</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your purchase orders and supplier payments.
                </p>
            </div>
            <Button size="sm" onClick={onNew}>
                <Plus className="mr-2 h-4 w-4" />
                New Purchase
            </Button>
        </div>
    );
}
