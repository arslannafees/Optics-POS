"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderDetailItems({ items, currency }) {
    const totalQty = items?.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0) || 0;
    const totalAmount = items?.reduce((acc, item) => acc + (Number(item.total) || 0), 0) || 0;

    return (
        <Card className="border shadow-none overflow-hidden print:hidden">
            <CardHeader><CardTitle className="text-lg">Order Items</CardTitle></CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50 text-left border-y">
                                <th className="px-6 py-3">Item</th>
                                <th className="px-6 py-3">Color</th>
                                <th className="px-6 py-3 text-center">Qty</th>
                                <th className="px-6 py-3 text-right">Price</th>
                                <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{item.itemName}</div>
                                        <div className="text-xs text-muted-foreground capitalize">{item.itemType?.replace(/_/g, " ")}</div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{item.color || "-"}</td>
                                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                                    <td className="px-6 py-4 text-right">{currency} {Number(item.price).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-medium">{currency} {Number(item.total).toLocaleString()}</td>
                                </tr>
                            )) || <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No items found.</td></tr>}
                        </tbody>
                        <tfoot className="bg-muted/50 font-bold border-t">
                            <tr>
                                <td className="px-6 py-3 text-right" colSpan={2}>Total</td>
                                <td className="px-6 py-3 text-center">{totalQty}</td>
                                <td className="px-6 py-3 text-right" colSpan={2}>{currency} {Number(totalAmount).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
