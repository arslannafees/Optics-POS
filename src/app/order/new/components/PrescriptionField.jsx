"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const PrescriptionField = React.memo(function PrescriptionField({ label, value, options, disabled, placeholder = "0.00", inputType, onChange }) {
    const isDropdown = inputType === "dropdown";

    // Local state for text input mode
    const [localValue, setLocalValue] = useState(value ?? "");

    // Sync from parent (e.g. on Load Latest RX)
    useEffect(() => {
        setLocalValue(value ?? "");
    }, [value]);

    // Debounced sync to parent
    useEffect(() => {
        if (isDropdown) return;
        const timer = setTimeout(() => {
            if (localValue !== (value ?? "")) {
                onChange(localValue);
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [localValue]);

    return (
        <div className="space-y-1">
            <Label className="text-xs">{label}</Label>
            {isDropdown ? (
                <Select disabled={disabled} value={value ?? ""} onValueChange={onChange}>
                    <SelectTrigger className="h-9"><SelectValue placeholder={placeholder} /></SelectTrigger>
                    <SelectContent position="popper">
                        {label === "SPH" || label === "CYL" || label === "PRISM" ? <SelectItem value="0.00">0.00</SelectItem> : null}
                        {options.filter(o => o !== "0.00").map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                </Select>
            ) : (
                <Input disabled={disabled} placeholder={placeholder} value={localValue} onChange={(e) => setLocalValue(e.target.value)} />
            )}
        </div>
    );
});
