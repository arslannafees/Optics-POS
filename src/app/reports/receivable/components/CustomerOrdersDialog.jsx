"use client";

import React from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CustomerOrdersDialog({ open, onOpenChange, orders, customer, currency }) {
    const total = orders.data.reduce((s, o) => s + (o.balance || 0), 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6">
                <DialogHeader className="mb-4">
                    <div className="flex justify-between items-center"><DialogTitle className="text-xl font-extrabold uppercase tracking-tighter">Statement</DialogTitle><Badge variant="outline" className="text-[10px] font-bold border-red-200 text-red-500 bg-red-50">UNPAID</Badge></div>
                    <DialogDescription className="font-bold text-primary">{customer?.firstName} {customer?.lastName}</DialogDescription>
                    <div className="pt-2"><p className="text-3xl font-black">{currency} {total.toLocaleString()}</p><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Outstanding</p></div>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {orders.loading ? <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-muted-foreground" /><p className="text-xs font-bold uppercase mt-2">Loading...</p></div> :
                        orders.data.map(o => (
                            <div key={o.id} className="flex items-center justify-between p-3 border rounded-xl bg-muted/5 group">
                                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all">#</div>
                                    <div><p className="font-bold text-sm">{String(o.id).padStart(4, '0')}</p><p className="text-[10px] text-muted-foreground">{o.date}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-right"><div><p className="font-bold text-sm">{currency} {o.balance?.toLocaleString()}</p><p className="text-[10px] text-red-400 font-bold uppercase">Pending</p></div><Link href={`/order/${o.id}`}><Button variant="outline" size="icon" className="size-8 rounded-full"><ExternalLink className="size-3" /></Button></Link></div>
                            </div>
                        ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end"><Button onClick={() => onOpenChange(false)} variant="secondary" className="font-bold px-8">Close</Button></div>
            </DialogContent>
        </Dialog>
    );
}
