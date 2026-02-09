"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderDetailHeader({ orderId, onPrint, dbId }) {
    return (
        <div className="flex items-center justify-between print:hidden">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/order"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Order Details</h1>
                    <p className="text-sm text-muted-foreground">Manage order #{String(orderId).padStart(4, "0")}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onPrint}><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
                <Button size="sm" asChild>
                    <Link href={`/order/new?edit=${dbId || orderId}`}><Edit className="mr-2 h-4 w-4" /> Edit Order</Link>
                </Button>
            </div>
        </div>
    );
}
