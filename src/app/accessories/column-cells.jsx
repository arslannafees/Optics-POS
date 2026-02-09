"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function NameCell({ value }) {
    return (
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export function PriceCell({ currency, value }) {
    return (
        <span className="font-medium">
            {currency} {parseFloat(value || 0).toLocaleString()}
        </span>
    );
}

export function CostCell({ currency, value }) {
    return (
        <span className="text-muted-foreground">
            {currency} {parseFloat(value || 0).toLocaleString()}
        </span>
    );
}
