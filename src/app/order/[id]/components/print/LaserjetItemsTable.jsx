"use client";

import React from "react";

export function LaserjetItemsTable({ items, isLastPage, totals }) {
    if (!items) return null;
    return (
        <div className="overflow-hidden relative mb-4">
            <table className="w-full text-left table-auto">
                <thead>
                    <tr className="border-b-2 border-slate-200">
                        <th className="py-3 text-sm font-bold text-slate-700 w-[30%]">Product</th>
                        <th className="py-3 text-sm font-bold text-slate-700 w-[25%]">Description</th>
                        <th className="py-3 text-sm font-bold text-slate-700 w-[15%] text-center">Qty</th>
                        <th className="py-3 text-sm font-bold text-slate-700 w-[15%] text-right">Rate</th>
                        <th className="py-3 text-sm font-bold text-slate-700 w-[15%] text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="border-b border-slate-100 last:border-0">
                            <td className="py-4 text-sm font-medium text-slate-800">{item.itemName}</td>
                            <td className="py-4 text-sm text-slate-500 capitalize">{item.itemType?.replace(/_/g, " ")}</td>
                            <td className="py-4 text-sm text-slate-600 text-center">{item.quantity}</td>
                            <td className="py-4 text-sm text-slate-600 text-right">{Number(item.price).toLocaleString()}</td>
                            <td className="py-4 text-sm text-slate-800 font-medium text-right">{Number(item.total).toLocaleString()}</td>
                        </tr>
                    ))}
                    {isLastPage && totals && (
                        <tr className="border-t-2 border-slate-300 font-bold bg-slate-50/50">
                            <td colSpan={2} className="py-3 text-right pr-4 text-sm text-slate-800">Total</td>
                            <td className="py-3 text-center text-sm text-slate-800">{totals.qty}</td>
                            <td className="py-3 text-right text-sm text-slate-800">{totals.rate.toLocaleString()}</td>
                            <td className="py-3 text-right text-sm text-slate-800">{Number(totals.amount).toLocaleString()}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
