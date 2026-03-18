"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function OrderDetailPayment({ order, settings }) {
    const cur = settings?.currency;
    return (
        <Card className="border shadow-none bg-primary/[0.02] print:hidden">
            <CardHeader><CardTitle className="text-lg">Payment Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{cur} {Number(order.subtotal || 0).toLocaleString()}</span></div>
                    {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="text-destructive">- {cur} {Number(order.discount).toLocaleString()}</span></div>}
                    {order.tax > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span>{cur} {Number(order.tax).toLocaleString()}</span></div>}
                    <Separator />
                    <div className="flex flex-col items-end">
                        <div className="flex justify-between w-full font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">{cur} {Number(order.total || 0).toLocaleString()}</span>
                        </div>
                        {order.actualTotal && Number(order.actualTotal) !== Number(order.total) && (
                            <span className="text-[10px] text-muted-foreground mr-1">
                                Actual: {cur} {Number(order.actualTotal).toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
                <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm font-medium"><span className="text-muted-foreground">Advance Paid</span><span className="text-green-600">{cur} {Number(order.advance || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between text-base font-bold bg-primary/10 p-3 rounded-lg"><span>Balance Due</span><span className={order.balance > 0 ? "text-orange-600" : "text-green-600"}>{cur} {Number(order.balance || 0).toLocaleString()}</span></div>
                </div>
                <div className="pt-2 flex items-center gap-2 text-[10px] text-muted-foreground uppercase"><CreditCard className="h-3 w-3" /><span>Payment via Cash / Manual</span></div>
            </CardContent>
        </Card>
    );
}
