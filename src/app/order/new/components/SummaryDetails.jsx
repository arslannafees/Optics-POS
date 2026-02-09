"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function SummaryDetails({ formData, settings, onChange }) {
    const cur = settings?.currency;
    const isAmt = settings?.discountType === "amount";
    const discPct = formData.subtotal > 0 ? ((parseFloat(formData.discountPercentage) || 0) / formData.subtotal * 100).toFixed(1) : 0;
    const discVal = isAmt ? `(${discPct}%)` : `${cur} ${formData.discount.toLocaleString()}`;

    return (
        <div className="space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{cur} {formData.subtotal.toLocaleString()}</span></div>
            <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground w-1/3">Discount {isAmt ? `(${cur})` : "%"}</span>
                <div className="flex items-center gap-2 w-2/3">
                    <Input type="number" className="w-24 text-right" value={formData.discountPercentage ?? ''} onChange={e => onChange('discountPercentage', e.target.value)} />
                    <span className="text-sm text-muted-foreground text-right flex-1">{discVal}</span>
                </div>
            </div>
            {formData.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Net</span><span>{cur} {(formData.subtotal - formData.discount).toLocaleString()}</span></div>}
            {formData.tax > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{cur} {formData.tax.toLocaleString()}</span></div>}
            <Separator />
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{cur} {formData.total.toLocaleString()}</span></div>
        </div>
    );
}
