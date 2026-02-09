"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BASE_OPTIONS } from "../constants/prescriptionOptions";

export function BaseSelector({ value, onChange }) {
    return (
        <div className="space-y-1">
            <Label className="text-xs">PRISM BASE</Label>
            <Select value={value ?? ""} onValueChange={onChange}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent position="popper">
                    <SelectItem value="none">None</SelectItem>
                    {BASE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
}
