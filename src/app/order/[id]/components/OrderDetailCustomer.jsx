"use client";

import React from "react";
import { User, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function OrderDetailCustomer({ order }) {
    return (
        <Card className="border shadow-none print:hidden">
            <CardHeader><CardTitle className="text-lg">Customer Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>
                    <div><p className="font-semibold">{order.customer || "Walking Customer"}</p><p className="text-xs text-muted-foreground">ID: #{order.customerLocalId || order.customerId || 'N/A'}</p></div>
                </div>
                <Separator />
                <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 mt-0.5" /><span>{order.customerMobile || order.customerPhone || "Not Provided"}</span></div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 mt-0.5" /><span>{order.customerEmail || "Not Provided"}</span></div>
                </div>
            </CardContent>
        </Card>
    );
}
