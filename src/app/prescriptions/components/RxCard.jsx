"use client";

import React from "react";
import { CheckCircle2, Clock, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { RxGrid } from "./RxCardDetails";

export function RxCard({ px, index, settings }) {
    const isLatest = index === 0;
    return (
        <div className="relative pl-12 group animate-in slide-in-from-left duration-500">
            <TimelineIcon isLatest={isLatest} />
            <Card className={`overflow-hidden border shadow-sm ${isLatest ? 'ring-2 ring-primary/20 border-primary/30' : 'border-border/50'}`}>
                <div className={`h-1 w-full ${isLatest ? 'bg-primary' : 'bg-muted'}`} />
                <CardHeader className="flex flex-row items-start justify-between bg-muted/[0.03] py-5 px-6">
                    <HeaderTitle px={px} isLatest={isLatest} settings={settings} />
                    <Button variant="ghost" size="icon" asChild><Link href={`/order/${px.orderId}`}><Eye className="h-4 w-4" /></Link></Button>
                </CardHeader>
                <CardContent className="p-6">
                    <RxGrid px={px} />
                    {px.remarks && <div className="mt-8 pt-6 border-t border-dashed italic text-sm text-muted-foreground">&ldquo;{px.remarks}&rdquo;</div>}
                </CardContent>
                <FooterInfo px={px} />
            </Card>
        </div>
    );
}

function TimelineIcon({ isLatest }) {
    return (
        <div className={`absolute left-0 top-1 h-10 w-10 rounded-full border-4 border-background shadow-lg flex items-center justify-center z-10 ${isLatest ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {isLatest ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        </div>
    );
}

function HeaderTitle({ px, isLatest, settings }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground uppercase">Record #{String(px.id).padStart(5, '0')}</span>
                {isLatest && <Badge className="bg-primary/10 text-primary border-primary/20">Latest</Badge>}
            </div>
            <div className="flex items-center gap-2 text-xl font-bold"><Calendar className="h-5 w-5 text-primary/60" />{formatDate(px.date, settings?.dateFormat)}</div>
        </div>
    );
}

function FooterInfo({ px }) {
    return (
        <CardFooter className="bg-muted/[0.03] px-6 py-4 flex justify-between border-t border-muted/30">
            <p className="text-[10px] text-muted-foreground">Order <span className="font-bold text-primary">#{String(px.orderId).padStart(4, '0')}</span></p>
            <Badge variant="outline" className="text-[10px]">ID: {px.id}</Badge>
        </CardFooter>
    );
}
