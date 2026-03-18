"use client";

import React from "react";
import { Database, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function SystemSettings({ settings, update }) {
    return (
        <Card className="border shadow-none">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Database className="size-4" /> System Settings
                </CardTitle>
                <CardDescription>Configure system-wide preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                    {/* Currency */}
                    <SSelect
                        label="Currency"
                        value={settings.currency}
                        onChange={v => update("currency", v)}
                        options={[
                            { i: "PKR", n: "Pakistani Rupee (PKR)" },
                            { i: "INR", n: "Indian Rupee (₹)" },
                            { i: "USD", n: "US Dollar ($)" },
                            { i: "EUR", n: "Euro (€)" },
                            { i: "GBP", n: "British Pound (£)" }
                        ]}
                    />

                    {/* Date Format */}
                    <SSelect
                        label="Date Format"
                        value={settings.dateFormat}
                        onChange={v => update("dateFormat", v)}
                        options={[
                            { i: "DD/MM/YYYY", n: "DD/MM/YYYY" },
                            { i: "MM/DD/YYYY", n: "MM/DD/YYYY" },
                            { i: "YYYY-MM-DD", n: "YYYY-MM-DD" }
                        ]}
                    />

                    {/* Default Tax Rate */}
                    <div className="space-y-1">
                        <Label className="font-medium">Default Tax Rate (%)</Label>
                        <Input
                            type="number"
                            value={settings.taxRate}
                            onChange={e => update("taxRate", e.target.value)}
                            className="h-10"
                        />
                    </div>

                    {/* Discount Type */}
                    <SSelect
                        label="Discount Type"
                        value={settings.discountType}
                        onChange={v => update("discountType", v)}
                        description="This will determine how discounts are calculated across the app."
                        options={[
                            { i: "percentage", n: "Percentage (%)" },
                            { i: "fixed", n: "Fixed Amount" }
                        ]}
                    />

                    {/* Tax Application */}
                    <div className="space-y-1">
                        <Label className="font-medium">Tax Application</Label>
                        <Select value={settings.taxApplication || "post"} onValueChange={v => update("taxApplication", v)}>
                            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pre">Pre-Tax (Discount applied before tax)</SelectItem>
                                <SelectItem value="post">Post-Tax (Discount applied after tax)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">"Pre-Tax" calculates tax on the discounted amount. "Post-Tax" calculates tax on the subtotal.</p>
                    </div>

                    {/* Prescription details dropdown */}
                    <SSelect
                        label="Prescription details"
                        value={settings.prescriptionInputType}
                        onChange={v => update("prescriptionInputType", v)}
                        description="Choose how you want to enter prescription details in the order form."
                        options={[
                            { i: "manual", n: "Manual Typing" },
                            { i: "dropdown", n: "Dropdown Selection (Automatic)" }
                        ]}
                    />

                    {/* Default Eye Checkup Fee */}
                    <div className="space-y-1">
                        <Label className="font-medium">Default Eye Checkup Fee</Label>
                        <Input
                            type="number"
                            value={settings.eyeCheckupFee}
                            onChange={e => update("eyeCheckupFee", e.target.value)}
                            className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">This fee will be automatically applied when adding an "Eye Checkup" to an order.</p>
                    </div>

                    {/* Round Off Total Amount */}
                    <SSelect
                        label="Round Off Total Amount"
                        value={settings.roundOffTotal || "false"}
                        onChange={v => update("roundOffTotal", v)}
                        description="Always round up the total amount to the nearest integer (e.g., 21.1 -> 22)."
                        options={[
                            { i: "true", n: "Enabled" },
                            { i: "false", n: "Disabled" }
                        ]}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

const SSelect = ({ label, value, onChange, options, description }) => (
    <div className="space-y-1">
        <Label className="font-medium">{label}</Label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-10">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map(o => (
                    <SelectItem key={o.i} value={o.i} className="focus:bg-[#E6F4F1] focus:text-foreground">
                        {o.n}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
);
