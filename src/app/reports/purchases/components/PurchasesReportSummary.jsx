"use client";

import React from "react";

/**
 * PurchasesReportSummary: Aggregates totals for the filtered report results.
 */
export function PurchasesReportSummary({ data, currency }) {
    const total = data.reduce((s, i) => s + (i.total || 0), 0);

    return (
        <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-4 bg-muted/20 p-4 rounded-xl border">
                <span className="text-sm font-bold uppercase text-muted-foreground tracking-tighter">Net Total</span>
                <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-sm">
                    <span className="text-xl font-extrabold">{currency} {total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
