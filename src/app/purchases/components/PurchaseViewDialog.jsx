"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function PurchaseViewDialog({ open, onOpenChange, data, loading, currency, dateFormat }) {
    if (loading) return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><div className="py-10 text-center animate-pulse">Loading...</div></DialogContent></Dialog>;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader><DialogTitle>Purchase Details</DialogTitle>
                    <DialogDescription>Invoice #{data?.invoiceNumber || String(data?.localId || data?.id).padStart(4, "0")} from {data?.vendorName}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-muted-foreground">Date</p><p className="font-semibold">{formatDate(data?.date, dateFormat)}</p></div>
                        <div><p className="text-muted-foreground">Payment Method</p><p className="font-semibold capitalize">{data?.paymentMethod || "-"}</p></div>
                    </div>
                    <table className="w-full text-sm border-t">
                        <thead className="text-left py-2 border-b"><tr><th>Item</th><th className="text-center">Qty</th><th className="text-right">Cost</th><th className="text-right">Total</th></tr></thead>
                        <tbody>
                            {data?.items?.map((it, idx) => (
                                <tr key={idx} className="border-b last:border-0"><td className="py-2"><p className="font-medium">{it.name}</p><p className="text-[10px] uppercase text-muted-foreground">{it.type}</p></td><td className="text-center">{it.quantity}</td><td className="text-right">{currency} {Number(it.cost).toLocaleString()}</td><td className="text-right font-bold">{currency} {Number(it.total).toLocaleString()}</td></tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t font-bold">
                            <tr><td colSpan="3" className="text-right py-2">Total</td><td className="text-right py-2">{currency} {Number(data?.total).toLocaleString()}</td></tr>
                        </tfoot>
                    </table>
                    {data?.remarks && <div className="text-sm pt-2"><p className="text-muted-foreground mb-1">Remarks</p><p className="bg-muted/30 p-2 rounded">{data.remarks}</p></div>}
                </div>
                <DialogFooter><Button onClick={() => onOpenChange(false)}>Close</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
