"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewOrderHeader({ onBack, editId, saving }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" type="button" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
                <div>
                    <h1 className="text-2xl font-semibold">{editId ? "Edit Order" : "New Order"}</h1>
                    <p className="text-sm text-muted-foreground">{editId ? `Updating order #${editId}` : "Create a new sales order"}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
            </div>
        </div>
    );
}
