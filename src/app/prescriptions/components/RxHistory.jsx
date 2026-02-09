"use client";

import React from "react";
import { Activity, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RxCard } from "./RxCard";

export function RxHistory({ isLoading, prescriptions, settings }) {
    if (isLoading) return <LoadingState />;

    if (prescriptions.length === 0) return <EmptyState />;

    return (
        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-48px)] before:w-0.5 before:bg-gradient-to-b before:from-primary/30 before:to-transparent">
            {prescriptions.map((px, i) => (
                <RxCard key={px.id} px={px} index={i} settings={settings} />
            ))}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/5 rounded-3xl border border-dashed border-primary/20">
            <Activity className="h-10 w-10 text-primary animate-pulse mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Loading history...</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="bg-muted/[0.05] border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-primary/30 mb-6" />
            <h3 className="text-xl font-bold mb-2">No Records</h3>
            <Button className="mt-8 rounded-full" asChild><Link href="/order/new">New Record</Link></Button>
        </div>
    );
}
