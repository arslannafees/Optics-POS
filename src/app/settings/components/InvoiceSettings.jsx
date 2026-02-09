"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InvoiceSettings({ settings, update }) {
    return (
        <Card className="border shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Receipt className="size-4" /> Invoice Settings
                </CardTitle>
                <CardDescription>Customize your invoice format and numbering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Invoice Prefix</Label>
                        <Input value={settings.invoicePrefix} onChange={e => update("invoicePrefix", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Starting Number</Label>
                        <Input type="number" value={settings.invoiceStartNumber} onChange={e => update("invoiceStartNumber", e.target.value)} />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-[-10px]">Example: {(settings.invoicePrefix || "INV")}-{(settings.invoiceStartNumber || "1").toString().padStart(4, '0')}</p>

                <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Invoice Terms</Label>
                    <Textarea value={settings.invoiceTerms} onChange={e => update("invoiceTerms", e.target.value)} />
                </div>

                <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Customer Message</Label>
                    <Textarea value={settings.customerMessage} onChange={e => update("customerMessage", e.target.value)} />
                    <p className="text-xs text-muted-foreground italic">This message appears above the Terms & Conditions.</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Show Logo on Invoice</Label>
                        <p className="text-sm text-muted-foreground">Display your business logo on printed invoices</p>
                    </div>
                    <Switch checked={!!settings.showLogo} onCheckedChange={c => update("showLogo", c)} />
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Primary Printer Type</Label>
                    <Select value={settings.printerType || "laserjet"} onValueChange={v => update("printerType", v)}>
                        <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="laserjet">Laserjet (A4 Layout)</SelectItem>
                            <SelectItem value="thermal">Thermal (80mm Layout)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground italic">This will determine the default layout for invoices and prescriptions.</p>
                </div>
            </CardContent>
        </Card>
    );
}
