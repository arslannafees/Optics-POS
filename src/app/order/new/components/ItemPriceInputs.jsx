"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ItemPriceInputs({ item, currency, onChange }) {
    const total = (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0);
    return (
        <>
            <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={item.quantity || ""} onChange={(e) => onChange(item.id, "quantity", e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Price ({currency})</Label>
                <Input type="number" value={item.price || ""} onChange={(e) => onChange(item.id, "price", e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Total ({currency})</Label>
                <Input value={total.toLocaleString()} readOnly className="bg-muted/50 font-medium" />
            </div>
        </>
    );
}
