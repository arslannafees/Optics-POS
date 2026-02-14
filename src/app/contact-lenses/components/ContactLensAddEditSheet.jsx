"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Search, Loader2 } from "lucide-react";
import { useBranch } from "@/contexts/BranchContext";
import { useBrandsData } from "@/hooks/useBrandsData";
import { useMemo, useState } from "react";

export function ContactLensAddEditSheet({ open, setOpen, isEditing, formData, setFormData, onSubmit, resetForm }) {
    const { currentShop, currentBranch } = useBranch();
    const { brands, loading: brandsLoading } = useBrandsData(currentShop, currentBranch, "Contact Lens");
    const [searchBrand, setSearchBrand] = useState("");
    const update = (obj) => setFormData({ ...formData, ...obj });

    const filteredBrands = useMemo(() => {
        if (!searchBrand) return brands;
        return brands.filter(b => b.brand?.toLowerCase().includes(searchBrand.toLowerCase()));
    }, [searchBrand, brands]);

    return (
        <Sheet open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
            <SheetContent className="sm:max-w-xl md:max-w-lg p-0 flex flex-col h-full">
                <div className="overflow-y-auto flex-1 px-8 pb-6">
                    <SheetHeader className="text-left -ml-4 pt-4 pb-4">
                        <SheetTitle className="text-left">{isEditing ? "Edit" : "Add New"} Contact Lens</SheetTitle>
                        <SheetDescription className="text-left">{isEditing ? "Update lens details" : "Add a new contact lens to your inventory"}</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={onSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Lens Name *</Label>
                                <Input className="h-9" placeholder="Enter contact lens name" value={formData.name || ""} onChange={e => update({ name: e.target.value })} required />
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
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lens Type</Label>
                                <Select value={formData.type || ""} onValueChange={v => update({ type: v })}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent position="popper" className="max-h-[300px]">
                                        <SelectItem value="spherical">Spherical</SelectItem>
                                        <SelectItem value="toric">Toric (Astigmatism)</SelectItem>
                                        <SelectItem value="multifocal">Multifocal/Bifocal</SelectItem>
                                        <SelectItem value="colored">Colored/Cosmetic</SelectItem>
                                        <SelectItem value="plano">Plano (Zero Power)</SelectItem>
                                        <SelectItem value="monovision">Monovision</SelectItem>
                                        <SelectItem value="orthokeratology">Orthokeratology (Ortho-K)</SelectItem>
                                        <SelectItem value="scleral">Scleral</SelectItem>
                                        <SelectItem value="mini-scleral">Mini-Scleral</SelectItem>
                                        <SelectItem value="rgp">RGP (Rigid Gas Permeable)</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                        <SelectItem value="keratoconus">Keratoconus</SelectItem>
                                        <SelectItem value="bandage">Bandage/Therapeutic</SelectItem>
                                        <SelectItem value="prosthetic">Prosthetic</SelectItem>
                                        <SelectItem value="specialty">Custom/Specialty</SelectItem>
                                        <SelectItem value="aspheric">Aspheric</SelectItem>
                                        <SelectItem value="circle">Circle Lenses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Replacement Schedule</Label>
                                <Select value={formData.replacementSchedule || ""} onValueChange={v => update({ replacementSchedule: v })}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select schedule" /></SelectTrigger>
                                    <SelectContent position="popper" className="max-h-[300px]">
                                        <SelectItem value="daily">Daily Disposable</SelectItem>
                                        <SelectItem value="weekly">Weekly Disposable</SelectItem>
                                        <SelectItem value="bi-weekly">Bi-Weekly (2 Weeks)</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly (3 Months)</SelectItem>
                                        <SelectItem value="bi-annual">Bi-Annual (6 Months)</SelectItem>
                                        <SelectItem value="yearly">Yearly/Annual</SelectItem>
                                        <SelectItem value="extended">Extended Wear</SelectItem>
                                        <SelectItem value="conventional">Conventional (Non-Disposable)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lens Material</Label>
                                <Select value={formData.material || ""} onValueChange={v => update({ material: v })}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select material" /></SelectTrigger>
                                    <SelectContent position="popper" className="max-h-[300px]">
                                        <SelectItem value="hydrogel">Hydrogel</SelectItem>
                                        <SelectItem value="silicone-hydrogel">Silicone Hydrogel</SelectItem>
                                        <SelectItem value="rgp">RGP (Rigid Gas Permeable)</SelectItem>
                                        <SelectItem value="pmma">PMMA (Hard Lens)</SelectItem>
                                        <SelectItem value="hybrid">Hybrid (Rigid Center + Soft Skirt)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color / Tint</Label>
                                <Input className="h-9" placeholder="e.g. Clear, Hazel" value={formData.color || ""} onChange={e => update({ color: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expiry Date</Label>
                                <DatePicker value={formData.expiryDate} onChange={e => update({ expiryDate: e.target.value })} align="end" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Eye Side</Label>
                                <Select value={formData.eyeSide || ""} onValueChange={v => update({ eyeSide: v })}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select side" /></SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sphere (SPH / PWR)</Label>
                                <Input className="h-9" placeholder="-2.00" value={formData.sph || ""} onChange={e => update({ sph: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cylinder (CYL)</Label>
                                <Input className="h-9" placeholder="-0.75" value={formData.cyl || ""} onChange={e => update({ cyl: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Axis</Label>
                                <Input className="h-9" placeholder="180" value={formData.axis || ""} onChange={e => update({ axis: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Power</Label>
                                <Input className="h-9" placeholder="+2.00" value={formData.addPower || ""} onChange={e => update({ addPower: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dominance</Label>
                                <Select value={formData.dominance || ""} onValueChange={v => update({ dominance: v })}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select dominance" /></SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="dominant">Dominant (D)</SelectItem>
                                        <SelectItem value="non-dominant">Non-Dominant (N)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base Curve (BC)</Label>
                                <Input className="h-9" placeholder="e.g. 8.6" value={formData.baseCurve || ""} onChange={e => update({ baseCurve: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diameter (DIA)</Label>
                                <Input className="h-9" placeholder="e.g. 14.2" value={formData.diameter || ""} onChange={e => update({ diameter: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Water Content (%)</Label>
                                <Input className="h-9" placeholder="e.g. 38%" value={formData.waterContent || ""} onChange={e => update({ waterContent: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Oxygen Permeability (Dk/t)</Label>
                                <Input className="h-9" placeholder="e.g. 120" value={formData.oxygenPermeability || ""} onChange={e => update({ oxygenPermeability: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost Price (PKR)</Label>
                                <Input className="h-9" type="number" step="0.01" placeholder="0.00" value={formData.cost || ""} onChange={e => update({ cost: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selling Price (PKR)</Label>
                                <Input className="h-9" type="number" step="0.01" placeholder="0.00" value={formData.price || ""} onChange={e => update({ price: e.target.value })} />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Quantity</Label>
                                <Input className="h-9" type="number" placeholder="0" value={formData.stock || ""} onChange={e => update({ stock: e.target.value })} />
                            </div>

                            <div className="md:col-span-2 flex items-center gap-8 pt-2">
                                <div className="flex items-center space-x-2">
                                    <Switch id="uv-protection" checked={formData.uvProtection || false} onCheckedChange={c => update({ uvProtection: c })} />
                                    <Label htmlFor="uv-protection" className="text-xs font-semibold uppercase">UV Protection</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="active-status" checked={formData.active !== false} onCheckedChange={c => update({ active: c })} />
                                    <Label htmlFor="active-status" className="text-xs font-semibold uppercase">Active</Label>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remarks</Label>
                                <Textarea placeholder="Additional notes..." value={formData.remarks || ""} onChange={e => update({ remarks: e.target.value })} className="min-h-[80px] text-sm" />
                            </div>
                        </div>
                        <SheetFooter className="mt-6">
                            <Button type="submit" className="w-full bg-[#006b52] hover:bg-[#005a46] text-white py-4 text-base font-semibold">
                                {isEditing ? "Update" : "Add"} Contact Lens
                            </Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
