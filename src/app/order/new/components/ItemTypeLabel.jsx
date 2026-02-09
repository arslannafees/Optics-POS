"use client";

import React from "react";
import { Glasses, Eye, Sparkles, Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import ContactLensIcon from "@/components/ContactLensIcon";

export function ItemTypeLabel({ type }) {
    const icons = {
        frame: <Glasses className="h-4 w-4" />,
        lens: <Eye className="h-4 w-4" />,
        "contact-lens": <ContactLensIcon className="h-4 w-4" />,
        accessory: <Sparkles className="h-4 w-4" />,
        "eye-checkup": <Stethoscope className="h-4 w-4" />
    };
    const labels = { frame: "Frame", lens: "Spectical-lens", "contact-lens": "Contact-Lens", accessory: "Accessory", "eye-checkup": "Checkup" };

    return (
        <Label className="flex items-center gap-1.5 font-medium">
            {icons[type] || <Sparkles className="h-4 w-4" />}
            {labels[type] || "Item"}
        </Label>
    );
}
