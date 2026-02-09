"use client";

import React from "react";

export function OrderPrescriptionEye({ side, px }) {
    const s = side === 'Right' ? 'right' : 'left';
    const color = side === 'Right' ? 'text-blue-600' : 'text-emerald-600';
    const dot = side === 'Right' ? 'bg-blue-600' : 'bg-emerald-600';
    const pd = px.pdType === 'single' ? px.totalPd : (px[`${s}PupillaryDistance`] || px[`${s}Pd`]);

    return (
        <div className="space-y-4">
            <h3 className={`text-xs font-bold flex items-center gap-2 ${color} tracking-wider uppercase`}>
                <div className={`h-2 w-2 rounded-full ${dot}`} /> {side} Eye ({side === 'Right' ? 'O.D.' : 'O.S.'})
            </h3>
            <div className="grid grid-cols-3 gap-3">
                <ViewRxField label="SPH" value={px[`${s}Sph`]} />
                <ViewRxField label="CYL" value={px[`${s}Cyl`]} />
                <ViewRxField label="AXIS" value={px[`${s}Axis`]} />
                <ViewRxField label="ADD" value={px[`${s}Add`]} isSub />
                <ViewRxField label="P.D." value={pd} isSub />
                <ViewRxField label="PRISM" value={px[`${s}Prism`]} isSub />
                <ViewRxField label="BASE" value={px[`${s}BaseCurve`]} isSub />
                <ViewRxField label="DIA" value={px[`${s}Diameter`]} isSub />
                <ViewRxField label="SEG" value={px[`${s}Segment`]} isSub />
            </div>
        </div>
    );
}

function ViewRxField({ label, value, isSub }) {
    return (
        <div className={`p-2 rounded-lg border bg-background/50 ${isSub ? 'border-primary/5' : 'border-primary/10'}`}>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{label}</p>
            <p className={`text-xs font-black ${!value || value === "0.00" ? 'text-muted-foreground/50' : ''}`}>{value || "0.00"}</p>
        </div>
    );
}
