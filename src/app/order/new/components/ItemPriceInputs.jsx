"use client";

import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const ItemPriceInputs = React.memo(function ItemPriceInputs({ item, currency, onChange }) {
    const [localQty, setLocalQty] = useState(item.quantity || "");
    const [localPrice, setLocalPrice] = useState(item.price || "");
    const isLocalChange = useRef(false);

    // Sync from parent (e.g. when item is selected and price auto-fills)
    useEffect(() => {
        if (!isLocalChange.current) {
            setLocalQty(item.quantity || "");
            setLocalPrice(item.price || "");
        }
        isLocalChange.current = false;
    }, [item.quantity, item.price]);

    // Debounced sync quantity to parent
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQty !== (item.quantity || "")) {
                isLocalChange.current = true;
                onChange(item.id, "quantity", localQty);
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [localQty]);

    // Debounced sync price to parent
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localPrice !== (item.price || "")) {
                isLocalChange.current = true;
                onChange(item.id, "price", localPrice);
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [localPrice]);

    const total = (parseFloat(localPrice) || 0) * (parseFloat(localQty) || 0);
    return (
        <>
            <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={localQty} onChange={(e) => setLocalQty(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Price ({currency})</Label>
                <Input type="number" value={localPrice} onChange={(e) => setLocalPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Total ({currency})</Label>
                <Input value={total.toLocaleString()} readOnly className="bg-muted/50 font-medium" />
            </div>
        </>
    );
});
