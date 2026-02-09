"use client";

import React from "react";

export const RxField = ({ label, value }) => (
    <div className={`p-3 rounded-lg border transition-all ${!value ? 'bg-muted/10 opacity-70' : 'bg-background shadow-sm border-primary/10 hover:border-primary/30'}`}>
        <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">{label}</p>
        <p className="text-sm font-black">{value || '0.00'}</p>
    </div>
);

export function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-muted/20">{icon}</div>
                <span className="text-muted-foreground font-medium">{label}</span>
            </div>
            <span className="font-bold">{value}</span>
        </div>
    );
}
