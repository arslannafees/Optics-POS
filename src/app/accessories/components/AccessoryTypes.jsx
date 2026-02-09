"use client";

import React from "react";
import { SelectItem } from "@/components/ui/select";

export function EyeglassTypes() {
    return (
        <>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Eyeglass Accessories
            </div>
            <SelectItem value="Cases">Cases</SelectItem>
            <SelectItem value="Cleaning Supplies">Cleaning Supplies</SelectItem>
            <SelectItem value="Chains, Cords, Straps">Chains, Cords & Straps</SelectItem>
            <SelectItem value="Repair Kits">Repair Kits</SelectItem>
            <SelectItem value="Nose Pads & Temple Tips">Nose Pads & Temple Tips</SelectItem>
            <SelectItem value="Clip-on & Fit-over">Clip-on & Fit-over</SelectItem>
            <SelectItem value="Anti-Fog">Anti-Fog</SelectItem>
        </>
    );
}

export function ContactLensTypes() {
    return (
        <>
            <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t">
                Contact Lens Accessories
            </div>
            <SelectItem value="Contact Lens Solutions">Solutions</SelectItem>
            <SelectItem value="Contact Lens Cases">Contact Lens Cases</SelectItem>
            <SelectItem value="Applicators & Tweezers">Applicators & Tweezers</SelectItem>
            <SelectItem value="Eye Drops">Eye Drops</SelectItem>
        </>
    );
}
