"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Loader2 } from "lucide-react";
import { useBranch } from "@/contexts/BranchContext";
import { useBrandsData } from "@/hooks/useBrandsData";

const FRAME_SHAPES = [
    { value: "rectangle", label: "Rectangle" },
    { value: "square", label: "Square" },
    { value: "round", label: "Round (Circle)" },
    { value: "oval", label: "Oval" },
    { value: "aviator", label: "Aviator (Pilot)" },
    { value: "cat-eye", label: "Cat-Eye" },
    { value: "wayfarer", label: "Wayfarer (Trapezoid)" },
    { value: "panto", label: "Panto" },
    { value: "browline", label: "Browline (Clubmaster)" },
    { value: "butterfly", label: "Butterfly" },
    { value: "hexagon", label: "Hexagon" },
    { value: "octagon", label: "Octagon" },
    { value: "polygon", label: "Polygon" },
    { value: "shield", label: "Shield (Mask)" },
    { value: "almond", label: "Almond" },
    { value: "boston", label: "Boston" },
    { value: "wellington", label: "Wellington" },
    { value: "d-frame", label: "D-Frame" },
    { value: "teardrop", label: "Teardrop" },
    { value: "heart", label: "Heart Shape" },
    { value: "bug-eye", label: "Bug-Eye" },
    { value: "geometric", label: "Geometric" },
    { value: "oversized", label: "Oversized" }
];

const FRAME_MATERIALS = [
    { value: "zyl", label: "Zyl" },
    { value: "acetate", label: "Acetate" },
    { value: "metal", label: "Metal" },
    { value: "tr-90", label: "TR-90" },
    { value: "wood", label: "Wood" },
    { value: "plastic", label: "Plastic" },
    { value: "nylon", label: "Nylon" },
    { value: "cap", label: "Cellulose Acetate Propionate" },
    { value: "titanium", label: "Titanium" },
    { value: "stainless-steel", label: "Stainless Steel" },
    { value: "monel", label: "Monel" },
    { value: "carbon-fiber", label: "Carbon Fiber" },
    { value: "aluminum", label: "Aluminum" },
    { value: "beryllium", label: "Beryllium" },
    { value: "flexon", label: "Flexon" },
    { value: "precious-metals", label: "Precious Metals" }
];

export function FrameAddEditSheet({ open, setOpen, isEditing, form, setForm, onSubmit }) {
    const { currentShop, currentBranch } = useBranch();
    const { brands, loading: brandsLoading } = useBrandsData(currentShop, currentBranch, "Frame");
    const [searchShape, setSearchShape] = useState("");
    const [searchMaterial, setSearchMaterial] = useState("");
    const [searchBrand, setSearchBrand] = useState("");

    const update = (obj) => setForm({ ...form, ...obj });

    const filteredBrands = useMemo(() => {
        if (!searchBrand) return brands;
        return brands.filter(b => b.brand?.toLowerCase().includes(searchBrand.toLowerCase()));
    }, [searchBrand, brands]);

    const filteredShapes = useMemo(() => {
        if (!searchShape) return FRAME_SHAPES;
        return FRAME_SHAPES.filter(s => s.label.toLowerCase().includes(searchShape.toLowerCase()));
    }, [searchShape]);

    const filteredMaterials = useMemo(() => {
        if (!searchMaterial) return FRAME_MATERIALS;
        return FRAME_MATERIALS.filter(m => m.label.toLowerCase().includes(searchMaterial.toLowerCase()));
    }, [searchMaterial]);

    return (
        <Sheet open={open} onOpenChange={v => { setOpen(v); if (!v) { setSearchShape(""); setSearchMaterial(""); } }}>
            <SheetContent className="sm:max-w-xl md:max-w-lg p-0 flex flex-col h-full">
                <div className="overflow-y-auto flex-1 px-8 pb-6">
                    <SheetHeader className="text-left -ml-4 pt-4 pb-4">
                        <SheetTitle className="text-left">{isEditing ? "Edit" : "Add New"} Frame</SheetTitle>
                        <SheetDescription className="text-left">
                            Fill in the details to {isEditing ? "update the" : "add a new"} frame
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={onSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Brand and Model */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand *</Label>
                                <Select value={form.brand || ""} onValueChange={v => update({ brand: v })}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder={brandsLoading ? "Loading brands..." : "Select brand"} />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" className="min-w-[300px] max-h-[350px] p-0 overflow-hidden flex flex-col">
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
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model</Label>
                                <Input
                                    className="h-9"
                                    placeholder="Model number"
                                    value={form.model || ""}
                                    onChange={e => update({ model: e.target.value })}
                                />
                            </div>

                            {/* Size and Color */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size</Label>
                                <Input
                                    className="h-9"
                                    placeholder="e.g., 52"
                                    value={form.size || ""}
                                    onChange={e => update({ size: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</Label>
                                <Input
                                    className="h-9"
                                    placeholder="e.g., Black"
                                    value={form.color || ""}
                                    onChange={e => update({ color: e.target.value })}
                                />
                            </div>

                            {/* Frame Shape and Material */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frame Shape</Label>
                                <Select value={form.shape || ""} onValueChange={v => update({ shape: v })}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select shape" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" className="min-w-[300px] max-h-[350px] p-0 overflow-hidden flex flex-col">
                                        <div className="p-2 border-b flex items-center gap-2 sticky top-0 bg-background z-10">
                                            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <Input
                                                placeholder="Search shape..."
                                                value={searchShape}
                                                onChange={(e) => setSearchShape(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                className="h-8 border-none focus-visible:ring-0 px-0"
                                            />
                                        </div>
                                        <div className="overflow-y-auto flex-1 max-h-[290px]">
                                            {filteredShapes.length > 0 ? (
                                                filteredShapes.map(s => (
                                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">No shape found</div>
                                            )}
                                        </div>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Material</Label>
                                <Select value={form.material || ""} onValueChange={v => update({ material: v })}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Select material" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" className="min-w-[300px] max-h-[350px] p-0 overflow-hidden flex flex-col">
                                        <div className="p-2 border-b flex items-center gap-2 sticky top-0 bg-background z-10">
                                            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <Input
                                                placeholder="Search material..."
                                                value={searchMaterial}
                                                onChange={(e) => setSearchMaterial(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                className="h-8 border-none focus-visible:ring-0 px-0"
                                            />
                                        </div>
                                        <div className="overflow-y-auto flex-1 max-h-[290px]">
                                            {filteredMaterials.length > 0 ? (
                                                filteredMaterials.map(m => (
                                                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">No material found</div>
                                            )}
                                        </div>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Cost Price and Selling Price */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost Price</Label>
                                <Input
                                    type="number"
                                    className="h-9"
                                    placeholder="0.00"
                                    value={form.cost || ""}
                                    onChange={e => update({ cost: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selling Price</Label>
                                <Input
                                    type="number"
                                    className="h-9"
                                    placeholder="0.00"
                                    value={form.price || ""}
                                    onChange={e => update({ price: e.target.value })}
                                />
                            </div>


                            {/* Current Stock and Opening Balance */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Stock</Label>
                                <Input
                                    type="number"
                                    className="h-9"
                                    placeholder="0"
                                    value={form.stock || ""}
                                    onChange={e => update({ stock: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opening Balance</Label>
                                <Input
                                    type="number"
                                    className="h-9"
                                    placeholder="0"
                                    value={form.openingBalance || ""}
                                    onChange={e => update({ openingBalance: e.target.value })}
                                />
                            </div>

                            {/* Barcode */}
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Barcode</Label>
                                <Input
                                    className="h-9"
                                    placeholder="Scan or enter barcode"
                                    value={form.barcode || ""}
                                    onChange={e => update({ barcode: e.target.value })}
                                />
                            </div>

                            {/* Remarks (Full width) */}
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remarks</Label>
                                <Textarea
                                    placeholder="Any additional notes"
                                    value={form.remarks || ""}
                                    onChange={e => update({ remarks: e.target.value })}
                                    className="min-h-[80px] text-sm"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="md:col-span-2 flex items-center justify-between pt-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Status</Label>
                                <Switch
                                    checked={form.active !== false}
                                    onCheckedChange={c => update({ active: c })}
                                />
                            </div>
                        </div>

                        <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-col">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="w-full py-4 text-base font-semibold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-full bg-[#006b52] hover:bg-[#005a46] text-white py-4 text-base font-semibold"
                            >
                                {isEditing ? "Update" : "Add"} Frame
                            </Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
