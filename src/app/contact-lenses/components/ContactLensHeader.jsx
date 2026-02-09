"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ContactLensHeader: Displays title and Add action for Contact Lenses module.
 */
export function ContactLensHeader({ onAddClick }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Contact Lenses</h1>
                <p className="text-sm text-muted-foreground">Manage and track your contact lens inventory.</p>
            </div>
            <Button size="sm" onClick={onAddClick}>
                <Plus className="mr-2 h-4 w-4" /> Add Contact Lens
            </Button>
        </div>
    );
}
