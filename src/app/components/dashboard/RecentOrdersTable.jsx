"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/components/NoData";
import { formatDate } from "@/lib/utils";

export function RecentOrdersTable({ orders, isLoading, currency, dateFormat }) {
    return (
        <Card className="lg:col-span-2 border-0 shadow-none bg-muted/40 animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: '350ms' }}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" asChild>
                    <Link href="/order">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? <LoadingSkeleton /> : orders.length > 0 ? (
                    <div className="space-y-1">
                        {orders.map((o, i) => <OrderRow key={o.id || i} order={o} currency={currency} dateFormat={dateFormat} />)}
                    </div>
                ) : <EmptyState />}
            </CardContent>
        </Card>
    );
}

function OrderRow({ order, currency, dateFormat }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
            <div className="min-w-0">
                <p className="text-sm font-medium truncate">{order.customerName || order.customer || "Customer"}</p>
                <p className="text-xs text-muted-foreground">{order.createdAt ? formatDate(order.createdAt, dateFormat) : "—"}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium">{currency} {(order.total || 0).toLocaleString()}</p>
                <p className={`text-xs ${order.status === 'completed' ? 'text-emerald-600' : 'text-muted-foreground'}`}>{order.status || "pending"}</p>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return <div className="space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
}

function EmptyState() {
    return <div className="flex flex-col items-center justify-center py-6 text-center"><NoData message="No orders yet" /><Button variant="link" size="sm" asChild className="mt-1 h-auto p-0"><Link href="/order/new">Create order</Link></Button></div>;
}
