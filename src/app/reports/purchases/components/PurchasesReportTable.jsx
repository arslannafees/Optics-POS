"use client";

import React from "react";
import NoData from "@/components/NoData";

export function PurchasesReportTable({ data, loading, currency }) {
    const cols = ["No", "Invoice No", "Name", "Date", "Branch", "Total"];

    return (
        <div className="bg-background border rounded-lg overflow-hidden">
            <div className="bg-muted/50 border-b">
                <div className="grid grid-cols-6 gap-4 px-6 py-3 text-xs font-bold uppercase">
                    {cols.map(c => <div key={c} className="text-left">{c}</div>)}
                </div>
            </div>
            <div className="divide-y">
                {loading ? <div className="p-12 text-center animate-pulse">Searching ledger...</div> :
                    data.length > 0 ? data.map((it, idx) => (
                        <div key={it.id} className="grid grid-cols-6 gap-4 px-6 py-4 text-sm items-center hover:bg-muted/10">
                            <div>{idx + 1}</div>
                            <div className="font-bold text-primary">{it.invoiceNumber || it.id}</div>
                            <div>{it.vendorName}</div><div>{it.date}</div>
                            <div>{it.branchName || 'Main'}</div>
                            <div className="font-extrabold">{currency} {it.total?.toLocaleString()}</div>
                        </div>
                    )) : <div className="p-12 text-center"><NoData message="No purchases found." /></div>}
            </div>
        </div>
    );
}
