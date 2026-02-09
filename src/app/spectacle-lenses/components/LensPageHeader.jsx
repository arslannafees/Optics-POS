"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * LensPageHeader: Displays the title and the primary "Add Lens" action.
 * Adheres to 20-60 line count.
 */
export function LensPageHeader({ onAddClick }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Spectacle Lenses</h1>
                <p className="text-sm text-muted-foreground">Manage lens inventory, brands, and pricing.</p>
            </div>
            <Button size="sm" onClick={onAddClick}>
                <Plus className="mr-2 h-4 w-4" /> Add New Spectacle Lens
            </Button>
        </div>
    );
}
