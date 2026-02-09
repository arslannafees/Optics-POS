"use client";

import React from "react";

export function CollectionReportSummary({ sums, currency }) {
    const blocks = [
        { t: "Total", v: sums.total, c: "bg-primary text-primary-foreground" },
        { t: "Deposits", v: sums.deposit, c: "bg-green-100 text-green-700 border-green-200" },
        { t: "Balance", v: sums.balance, c: "bg-red-100 text-red-700 border-red-200" }
    ];

    return (
        <div className="flex justify-end items-center mt-6 space-x-4">
            {blocks.map(b => (
                <div key={b.t} className={`px-6 py-3 rounded-xl border shadow-sm ${b.c}`}>
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-70">{b.t}</div>
                    <div className="text-xl font-black">{currency} {b.v.toLocaleString()}</div>
                </div>
            ))}
        </div>
    );
}
