"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EyeglassTypes, ContactLensTypes } from "./AccessoryTypes";
import { useBranch } from "@/contexts/BranchContext";
import { useBrandsData } from "@/hooks/useBrandsData";
import { Search, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export function AccessoryFormFields({ form, onChange, onSelectChange }) {
    const { currentShop, currentBranch } = useBranch();
    const { brands, loading: brandsLoading } = useBrandsData(currentShop, currentBranch, "Accessory");
    const [searchBrand, setSearchBrand] = useState("");

    const filteredBrands = useMemo(() => {
        if (!searchBrand) return brands;
        return brands.filter(b => b.brand?.toLowerCase().includes(searchBrand.toLowerCase()));
    }, [searchBrand, brands]);
    return (
        <div className="space-y-4 mt-6 px-10 pb-6">
            <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" value={form.name} onChange={onChange} required placeholder="Accessory name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brandId">Brand</Label>
                    <Select value={form.brandId?.toString() || ""} onValueChange={(v) => onSelectChange("brandId", v)}>
                        <SelectTrigger id="brandId">
                            <SelectValue placeholder={brandsLoading ? "Loading..." : "Select brand"} />
                        </SelectTrigger>
                        <SelectContent align="start" position="popper" side="bottom" className="min-w-[300px] max-h-[350px] p-0 overflow-hidden flex flex-col">
                            <div className="p-2 border-b flex items-center gap-2 sticky top-0 bg-background z-10">
                                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                <Input
                                    placeholder="Search brand..."
                                    value={searchBrand}
                                    onChange={(e) => setSearchBrand(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className="h-8 border-none focus-visible:ring-0 pl-4"
                                />
                            </div>
                            <div className="overflow-y-auto flex-1 max-h-[290px] pt-2">
                                {brandsLoading ? (
                                    <div className="p-4 flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                ) : filteredBrands.length > 0 ? (
                                    filteredBrands.map(b => (
                                        <SelectItem key={b.id} value={b.id.toString()}>{b.brand}</SelectItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">No brand found</div>
                                )}
                            </div>
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
