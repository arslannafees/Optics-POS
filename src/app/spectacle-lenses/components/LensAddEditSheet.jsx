"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { MATERIAL_CATEGORIES } from "../constants/lensMaterials";
import { Search, Loader2 } from "lucide-react";
import { useBranch } from "@/contexts/BranchContext";
import { useBrandsData } from "@/hooks/useBrandsData";

const COATINGS = [
    { value: "none", label: "None" },
    { value: "anti-reflective", label: "Anti-Reflective (AR) Coating" },
    { value: "scratch-resistant", label: "Scratch-Resistant Coating" },
    { value: "uv-protection", label: "UV Protection Coating" },
    { value: "blue-light-filter", label: "Blue Light Filter Coating" },
    { value: "anti-fog", label: "Anti-Fog Coating" },
    { value: "hydrophobic", label: "Hydrophobic Coating (Water-Repellent)" },
    { value: "oleophobic", label: "Oleophobic Coating (Oil-Repellent)" },
    { value: "mirror", label: "Mirror Coating" },
    { value: "photochromic", label: "Photochromic Coating (Transitions)" },
    { value: "polarized", label: "Polarized Coating" },
    { value: "tinted", label: "Tinted Coating" },
    { value: "anti-static", label: "Anti-Static Coating" },
    { value: "multi-coating", label: "Multi-Coating (Combined Layers)" },
    { value: "hard", label: "Hard Coating" },
    { value: "emi", label: "EMI Coating (Electromagnetic Interference Protection)" },
    { value: "crizal", label: "Crizal (brand-specific multi-coating)" },
    { value: "anti-dust", label: "Anti-Static/Dust-Repellent Coating" },
    { value: "backside-uv", label: "Backside UV Coating (protects from UV reflecting back)" },
    { value: "edge", label: "Edge Coating (for rimless frames)" },
    { value: "super-hydrophobic", label: "Super Hydrophobic Coating (advanced water repellent)" },
    { value: "gradient-tint", label: "Gradient Tint Coating" },
    { value: "color-enhancement", label: "Color Enhancement Coating (Enchroma-type)" },
    { value: "night-vision", label: "Night Vision/Yellow Tint Coating" },
    { value: "silver-gold-mirror", label: "Silver/Gold Mirror Coating (various colors)" },
    { value: "anti-bacterial", label: "Anti-Bacterial Coating" },
    { value: "self-cleaning", label: "Self-Cleaning Coating" }
];

export function LensAddEditSheet({ open, setOpen, isEditing, formData, setFormData, onSubmit, resetForm }) {
    const { currentShop, currentBranch } = useBranch();
    const { brands, loading: brandsLoading } = useBrandsData(currentShop, currentBranch, "Spectacle Lens");
    const [matCat, setMatCat] = useState("");
    const [searchCoating, setSearchCoating] = useState("");
    const [searchBrand, setSearchBrand] = useState("");
    const update = (f) => setFormData({ ...formData, ...f });

    const filteredBrands = useMemo(() => {
        if (!searchBrand) return brands;
        return brands.filter(b => b.brand?.toLowerCase().includes(searchBrand.toLowerCase()));
    }, [searchBrand, brands]);

    const filteredCoatings = useMemo(() => {
        if (!searchCoating) return COATINGS;
        return COATINGS.filter(c => c.label.toLowerCase().includes(searchCoating.toLowerCase()));
    }, [searchCoating]);

    return (
        <Sheet open={open} onOpenChange={o => { setOpen(o); if (!o) { resetForm(); setMatCat(""); setSearchCoating(""); } }}>
            <SheetContent className="sm:max-w-xl md:max-w-lg p-0 flex flex-col h-full">
                <div className="overflow-y-auto flex-1 px-8 pb-6">
                    <SheetHeader className="text-left -ml-4 pt-4 pb-4">
                        <SheetTitle className="text-left">{isEditing ? "Edit" : "Add New"} Spectacle lens</SheetTitle>
                        <SheetDescription className="text-left">{isEditing ? "Update spectacle lens details" : "Add a new spectacle lens to your inventory"}</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={onSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spectacle lens Name *</Label>
                                <Input className="h-9" placeholder="Enter spectacle lens name" value={formData.name || ""} onChange={e => update({ name: e.target.value })} required />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand</Label>
                                <Select value={formData.brand || ""} onValueChange={v => update({ brand: v })}>
                                    <SelectTrigger className="h-9">
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
                                                    <SelectItem key={b.id} value={b.brand}>{b.brand}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">No brand found</div>
                                            )}
                                        </div>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</Label>
                                <Select value={formData.type || ""} onValueChange={v => update({ type: v })}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent position="popper" side="bottom">
                                        <SelectItem value="single-vision">Single Vision</SelectItem>
                                        <SelectItem value="bifocal">Bifocal</SelectItem>
                                        <SelectItem value="progressive">Progressive</SelectItem>
                                        <SelectItem value="reading">Reading</SelectItem>
                                        <SelectItem value="computer">Computer</SelectItem>
                                        <SelectItem value="sunglasses">Sunglasses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Material Category</Label>
                                <Select value={matCat} onValueChange={v => { setMatCat(v); update({ material: "" }); }}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent position="popper" side="bottom">
                                        {Object.keys(MATERIAL_CATEGORIES).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specific Material / Index</Label>
                                <Select value={formData.material || ""} onValueChange={v => update({ material: v })} disabled={!matCat}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select specific material" /></SelectTrigger>
                                    <SelectContent position="popper" side="bottom">
                                        {matCat && MATERIAL_CATEGORIES[matCat].map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coating</Label>
                                <Select value={formData.coating || ""} onValueChange={v => update({ coating: v })}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select coating" /></SelectTrigger>
                                    <SelectContent align="start" position="popper" side="bottom" className="min-w-[400px] max-h-[350px] p-0 overflow-hidden flex flex-col">
                                        <div className="p-2 border-b flex items-center gap-2 sticky top-0 bg-background z-10">
                                            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <Input
                                                placeholder="Search coating..."
                                                value={searchCoating}
                                                onChange={(e) => setSearchCoating(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                className="h-8 border-none focus-visible:ring-0 px-0"
                                            />
                                        </div>
                                        <div className="overflow-y-auto flex-1 max-h-[290px]">
                                            {filteredCoatings.length > 0 ? (
                                                filteredCoatings.map(c => (
                                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">No coating found</div>
                                            )}
                                        </div>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost Price (PKR)</Label>
                                <Input className="h-9" type="number" placeholder="0.00" value={formData.cost || ""} onChange={e => update({ cost: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selling Price (PKR)</Label>
                                <Input className="h-9" type="number" placeholder="0.00" value={formData.price || ""} onChange={e => update({ price: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Quantity</Label>
                                <Input className="h-9" type="number" placeholder="0" value={formData.stock || ""} onChange={e => update({ stock: e.target.value })} />
                            </div>

                            <div className="flex items-center space-x-2 pt-6">
                                <Switch id="active-status" checked={formData.active !== false} onCheckedChange={c => update({ active: c })} />
                                <Label htmlFor="active-status" className="text-xs font-semibold uppercase">Active</Label>
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remarks</Label>
                                <Textarea placeholder="Additional notes..." value={formData.remarks || ""} onChange={e => update({ remarks: e.target.value })} className="min-h-[80px] text-sm" />
                            </div>
                        </div>

                        <SheetFooter className="mt-6">
                            <Button type="submit" className="w-full bg-[#006b52] hover:bg-[#005a46] text-white py-4 text-base font-semibold">
                                {isEditing ? "Update" : "Add"} Spectacle lens
                            </Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}


