"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { RxField } from "./RxFields";

export function RxGrid({ px }) {
    const getPd = (side) => px.pdType === 'single' ? px.totalPd : px[side === 'right' ? 'rightPupillaryDistance' : 'leftPupillaryDistance'];
    return (
        <>
            <div className="grid md:grid-cols-2 gap-10">
                <EyeBlock title="RIGHT EYE (O.D.)" color="text-blue-600" dot="bg-blue-600">
                    <RxField label="SPH" value={px.rightSph} /><RxField label="CYL" value={px.rightCyl} /><RxField label="AXIS" value={px.rightAxis} />
                    <RxField label="ADD" value={px.rightAdd} /><RxField label="P.D." value={getPd('right')} /><RxField label="PRISM" value={px.rightPrism} />
                </EyeBlock>
                <EyeBlock title="LEFT EYE (O.S.)" color="text-emerald-600" dot="bg-emerald-600">
                    <RxField label="SPH" value={px.leftSph} /><RxField label="CYL" value={px.leftCyl} /><RxField label="AXIS" value={px.leftAxis} />
                    <RxField label="ADD" value={px.leftAdd} /><RxField label="P.D." value={getPd('left')} /><RxField label="PRISM" value={px.leftPrism} />
                </EyeBlock>
            </div>
            <PdFooter px={px} />
        </>
    );
}

function EyeBlock({ title, color, dot, children }) {
    return (
        <div className="space-y-4">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${color}`}><div className={`h-2.5 w-2.5 rounded-full ${dot}`} />{title}</h3>
            <div className="grid grid-cols-3 gap-3">{children}</div>
        </div>
    );
}

function PdFooter({ px }) {
    return (
        <div className="mt-8 pt-6 border-t border-dashed border-primary/10 flex gap-4">
            <div className="p-3 rounded-xl border bg-background shadow-sm border-primary/10">
                <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">PD TYPE</p>
                <Badge variant="secondary" className="uppercase">{px.pdType === 'dual' ? "Dual" : (px.pdType || "-")}</Badge>
            </div>
            {px.totalPd && <div className="p-3 rounded-xl border bg-background shadow-sm border-primary/10"><p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">TOTAL P.D.</p><p className="text-sm font-black">{px.totalPd}</p></div>}
        </div>
    );
}
