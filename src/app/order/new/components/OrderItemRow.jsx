"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemTypeLabel } from "./ItemTypeLabel";
import { ItemSelector } from "./ItemSelector";
import { ItemPriceInputs } from "./ItemPriceInputs";

export function OrderItemRow({ item, lists, settings, onRemove, onChange }) {
    const isEyeCheckup = item.type === "eye-checkup";

    return (
        <div className="flex items-start gap-4 rounded-xl border p-4 bg-muted/30">
            <div className="flex-1 grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
                <div className="space-y-2">
                    <ItemTypeLabel type={item.type} />
                    <ItemSelector item={item} lists={lists} onChange={onChange} />
                </div>
                <ItemPriceInputs item={item} currency={settings?.currency} onChange={onChange} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="mt-6 hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
