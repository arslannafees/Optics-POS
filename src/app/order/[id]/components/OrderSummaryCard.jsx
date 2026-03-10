"use client";

import React from "react";
import { ShoppingBag, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { FabricationStatusBadge } from "./FabricationStatusBadge";

export function OrderSummaryCard({ order, dateFormat }) {
    return (
        <Card className="border shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg">Order #{String(order.localId || order.id).padStart(4, "0")}</CardTitle>
                    <CardDescription>Placed on {formatDate(order.date, dateFormat)}</CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <FabricationStatusBadge orderId={order.id} />
                    <OrderStatusBadge status={order.status} />
                </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ShoppingBag className="h-3 w-3" /> Order Type</p>
                    <p className="text-sm">{order.orderType || "Standard"}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Calendar className="h-3 w-3" /> Delivery Date</p>
                    <p className="text-sm font-medium text-primary">{order.deliveryDate ? formatDate(order.deliveryDate, dateFormat) : "Not Set"}</p>
                </div>
            </CardContent>
        </Card>
    );
}
