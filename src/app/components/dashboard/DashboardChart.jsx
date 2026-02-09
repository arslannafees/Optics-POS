"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardChart({ data, currency, isLoading }) {
    return (
        <Card className="lg:col-span-3 border-0 shadow-none bg-muted/40 animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue</CardTitle></CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-[280px] w-full" /> : (
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ left: 20, right: 10, top: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${currency} ${v}`} width={80} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '12px' }} formatter={(v) => [`${currency} ${v}`, 'Revenue']} />
                                <Area type="monotone" dataKey="revenue" stroke="currentColor" strokeWidth={1.5} fill="url(#revenue)" className="text-foreground" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
