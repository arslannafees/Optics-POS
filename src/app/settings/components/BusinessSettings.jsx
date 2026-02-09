"use client";

import React from "react";
import { Building2, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function BusinessSettings({ settings, update }) {
    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size < 1024 * 1024) {
            const r = new FileReader();
            r.onloadend = () => update("businessLogo", r.result);
            r.readAsDataURL(file);
        } else if (file) toast.error("Max 1MB");
    };

    return (
        <Card className="border shadow-none">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Building2 className="size-4" /> Business Information
                </CardTitle>
                <CardDescription>Configure your business details for invoices and reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Logo Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group size-28 border-2 border-dashed rounded-xl flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors shrink-0">
                        {settings.businessLogo ? (
                            <img src={settings.businessLogo} className="size-full object-contain p-2" alt="Logo" />
                        ) : (
                            <FileText className="size-8 text-muted-foreground/40" />
                        )}
                        {settings.businessLogo && (
                            <button
                                onClick={() => update("businessLogo", "")}
                                className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-md"
                            >
                                <X className="size-3" />
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="logo-upload" className="text-sm font-medium text-[#05664F] hover:underline cursor-pointer flex items-center gap-2">
                            <FileText className="size-4" /> Upload Business Logo
                            <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                        </label>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                            Recommended: Square image, max 1MB. This logo will appear in your sidebar and invoices.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-border/60" />

                {/* Form Fields */}
                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                    <SInput id="businessName" label="Business Name" value={settings.businessName} onChange={e => update("businessName", e.target.value)} placeholder="Optics" />
                    <SInput id="gstNumber" label="GST Number" value={settings.gstNumber} onChange={e => update("gstNumber", e.target.value)} placeholder="XXXXXXX" />
                    <SInput id="businessPhone" label="Phone Number" value={settings.businessPhone} onChange={e => update("businessPhone", e.target.value)} placeholder="+XX XXX XXX XXXX" />
                    <SInput id="businessEmail" label="Email Address" type="email" value={settings.businessEmail} onChange={e => update("businessEmail", e.target.value)} placeholder="XX@gmail.com" />
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="businessAddress" className="font-medium">Business Address</Label>
                        <Textarea id="businessAddress" value={settings.businessAddress} onChange={e => update("businessAddress", e.target.value)} className="min-h-[100px] resize-none" placeholder="XX" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const SInput = ({ id, label, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="font-medium">{label}</Label>
        <Input id={id} {...props} className="h-10" />
    </div>
);
