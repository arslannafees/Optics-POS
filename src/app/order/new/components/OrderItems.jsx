"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NoData from "@/components/NoData";
import { OrderButtonTray } from "./OrderButtonTray";
import { OrderItemRow } from "./OrderItemRow";
import { ScanBarcode } from "lucide-react";

const TYPE_LABELS = { frame: "Frame", lens: "Lens", "contact-lens": "Contact Lens", accessory: "Accessory" };
const TYPE_COLORS = {
    frame: "bg-blue-100 text-blue-700",
    lens: "bg-purple-100 text-purple-700",
    "contact-lens": "bg-teal-100 text-teal-700",
    accessory: "bg-orange-100 text-orange-700",
};

export const OrderItems = React.memo(function OrderItems({ state, lists, settings, actions, dragActions, onBarcodeScan }) {
    const { formData } = state;
    const { handleAddItem, handleRemoveItem, handleItemChange, handleAddScannedItem } = actions;
    const [query, setQuery] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Flatten all products into one searchable list
    const allProducts = useMemo(() => [
        ...( lists.frames       || []).map(p => ({ ...p, _type: "frame" })),
        ...( lists.lenses       || []).map(p => ({ ...p, _type: "lens" })),
        ...( lists.contactLenses|| []).map(p => ({ ...p, _type: "contact-lens" })),
        ...( lists.accessories  || []).map(p => ({ ...p, _type: "accessory" })),
    ], [lists]);

    // Filter by barcode prefix first, then by name contains
    const suggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        const byBarcode = allProducts.filter(p => p.barcode && p.barcode.toLowerCase().startsWith(q));
        const byName    = allProducts.filter(p => !byBarcode.includes(p) && (p.name || "").toLowerCase().includes(q));
        return [...byBarcode, ...byName].slice(0, 8);
    }, [query, allProducts]);

    // Reset highlight when suggestions change
    useEffect(() => { setHighlightIndex(0); }, [suggestions]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selectProduct = (product) => {
        const { _type, ...p } = product;
        handleAddScannedItem(_type, p);
        setQuery("");
        setOpen(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!open || suggestions.length === 0) {
            if (e.key === "Enter" && query.trim()) {
                onBarcodeScan(query.trim());
                setQuery("");
                setOpen(false);
            }
            return;
        }
        if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIndex(i => Math.min(i + 1, suggestions.length - 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIndex(i => Math.max(i - 1, 0)); }
        else if (e.key === "Enter") { e.preventDefault(); selectProduct(suggestions[highlightIndex]); }
        else if (e.key === "Escape") { setOpen(false); }
    };

    return (
        <Card className="border shadow-none">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-2 pt-1.5 min-w-fit">
                        Order Items {formData.items.length > 0 && <Badge variant="secondary" className="text-xs">{formData.items.length}</Badge>}
                    </CardTitle>
                    <OrderButtonTray buttons={{ config: state.buttonConfig, setConfig: state.setButtonConfig, dragged: state.draggedType }}
                        customize={{ isCustomizing: state.isCustomizing, setIsCustomizing: state.setIsCustomizing }}
                        onAdd={(type) => handleAddItem(type, settings?.eyeCheckupFee)}
                        onDrag={dragActions} />
                </div>

                {/* Barcode / search input with suggestions */}
                <div className="relative mt-1" ref={wrapperRef}>
                    <ScanBarcode className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <Input
                        ref={inputRef}
                        className="h-8 pl-8 text-sm"
                        placeholder="Scan barcode or search by name..."
                        value={query}
                        onChange={e => { setQuery(e.target.value); setOpen(true); }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => { if (query) setOpen(true); }}
                        autoComplete="off"
                    />

                    {open && suggestions.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg overflow-hidden">
                            {suggestions.map((product, i) => (
                                <button
                                    key={`${product._type}-${product.id}`}
                                    type="button"
                                    className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${i === highlightIndex ? "bg-accent" : "hover:bg-accent/50"}`}
                                    onMouseEnter={() => setHighlightIndex(i)}
                                    onMouseDown={e => { e.preventDefault(); selectProduct(product); }}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded ${TYPE_COLORS[product._type]}`}>
                                            {TYPE_LABELS[product._type]}
                                        </span>
                                        <span className="truncate font-medium">{product.name || `${product.brand || ""} ${product.model || ""}`.trim()}</span>
                                        {product.barcode && <span className="text-muted-foreground text-xs shrink-0">{product.barcode}</span>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant="secondary" className="text-xs">{product.stock ?? 0} in stock</Badge>
                                        {product.price && <span className="text-xs text-muted-foreground">{product.price}</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {formData.items.length === 0 ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/5 border-muted-foreground/10">
                        <NoData message='No items added yet. Choose an item type above to start building this order.' />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {formData.items.map(item => (
                            <OrderItemRow key={item.id} item={item} lists={lists} settings={settings} onRemove={handleRemoveItem} onChange={handleItemChange} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
