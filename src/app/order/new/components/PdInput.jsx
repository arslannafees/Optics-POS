"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PD_EYE_OPTIONS, PD_TOTAL_OPTIONS } from "../constants/prescriptionOptions";

export function PdInput({ side, data, inputType, onChange }) {
    const s = side.toLowerCase();
    const isDual = data.pdType === 'dual';

    // Handle "Single" mode for Left eye - always show readonly "Combined" indicator
    if (!isDual && side === 'Left') {
        return <div className="space-y-1"><Label className="text-xs">PD</Label><div className="flex items-center h-9 px-3 rounded-md border bg-muted/50 text-muted-foreground text-sm">{data.totalPd || "Combined"}</div></div>;
    }

    const value = (isDual ? data[`${s}PupillaryDistance`] : data.totalPd) || "";
    const upd = (val) => {
        if (isDual) onChange(`${s}PupillaryDistance`, val);
        else {
            const half = val ? (parseFloat(val) / 2).toString() : "";
            onChange('totalPd', val); onChange('rightPupillaryDistance', half); onChange('leftPupillaryDistance', half);
        }
    };

    if (inputType !== "dropdown") {
        return (
            <div className="space-y-1">
                <Label className="text-xs">{!isDual ? "Total PD" : "PD"}</Label>
                <Input placeholder="0.00" value={value} onChange={e => upd(e.target.value)} />
            </div>
        );
    }

    const options = isDual ? PD_EYE_OPTIONS : PD_TOTAL_OPTIONS;
    return (
        <div className="space-y-1">
            <Label className="text-xs">PD</Label>
            <Select value={value} onValueChange={upd}>
                <SelectTrigger className="h-9"><SelectValue placeholder="0.00" /></SelectTrigger>
                <SelectContent position="popper">
                    {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
}
