"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EyeglassTypes, ContactLensTypes } from "./AccessoryTypes";

export function AccessoryFormFields({ form, onChange, onSelectChange, brands }) {
    return (
        <div className="space-y-4 mt-6 px-10 pb-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" value={form.name} onChange={onChange} required placeholder="Accessory name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brandId">Brand</Label>
                    <Select value={form.brandId} onValueChange={(v) => onSelectChange("brandId", v)}>
                        <SelectTrigger id="brandId"><SelectValue placeholder="Select brand" /></SelectTrigger>
                        <SelectContent>
                            {brands.map((b) => <SelectItem key={b.id} value={b.id.toString()}>{b.brand}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accessoryType">Type</Label>
                    <Select value={form.accessoryType} onValueChange={(v) => onSelectChange("accessoryType", v)}>
                        <SelectTrigger id="accessoryType"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                            <EyeglassTypes />
                            <ContactLensTypes />
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <AccessoryPricingFields form={form} onChange={onChange} />
            <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" name="remarks" value={form.remarks} onChange={onChange} placeholder="Notes" />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="active">Active Status</Label>
                <Switch id="active" checked={form.active} onCheckedChange={(v) => onSelectChange("active", v)} />
            </div>
        </div>
    );
}

function AccessoryPricingFields({ form, onChange }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="cost">Cost Price</Label>
                <Input id="cost" name="cost" type="number" step="0.01" value={form.cost} onChange={onChange} placeholder="0.00" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Selling Price</Label>
                <Input id="price" name="price" type="number" step="0.01" value={form.price} onChange={onChange} placeholder="0.00" />
            </div>
            <div className="space-y-2 col-span-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" name="stock" type="number" value={form.stock} onChange={onChange} placeholder="0" />
            </div>
        </div>
    );
}
