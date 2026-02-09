"use client";

import React from "react";

export function ThermalItemsTable({ items }) {
    if (!items) return null;

    const totalQty = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

    return (
        <div className="space-y-2 mb-4">
            <table className="w-full text-[11px]">
                <thead className="border-t-2 border-black border-dashed">
                    <tr className="text-left font-black uppercase">
                        <th className="py-2 w-[55%]">DESCRIPTION</th>
                        <th className="py-2 text-center w-[15%]">QTY</th>
                        <th className="py-2 text-right w-[30%]">AMOUNT</th>
                    </tr>
                </thead>
                <tbody className="border-t border-black border-dashed">
                    {items.map((item, idx) => (
                        <tr key={idx} className="border-black/5">
                            <td className="py-2">
                                <div className="font-bold text-slate-800 leading-tight">{item.itemName}</div>
                            </td>
                            <td className="py-2 text-center align-middle font-bold">{item.quantity}</td>
                            <td className="py-2 text-right align-middle font-bold">{Number(item.total || 0).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="border-t-2 border-black">
                    <tr className="font-black uppercase">
                        <td className="py-2">TOTAL ITEMS</td>
                        <td className="py-2 text-center">{totalQty}</td>
                        <td className="py-2 text-right">{subtotal.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
