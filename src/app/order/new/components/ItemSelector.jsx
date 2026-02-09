"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function ItemSelector({ item, lists, onChange }) {
    const [selectedModel, setSelectedModel] = useState("");

    if (item.type === "eye-checkup") return <Input value="Professional Eye Checkup" readOnly className="bg-muted/50" />;

    const sourceMap = {
        frame: lists.frames, lens: lists.lenses,
        "contact-lens": lists.contactLenses, accessory: lists.accessories
    };
    const source = sourceMap[item.type] || [];
    const labelPrefix = item.type === 'lens' ? 'Spectical-lens' : item.type === 'contact-lens' ? 'Contact Lens' : item.type === 'accessory' ? 'Accessory' : item.type;

    const isGroupable = item.type === "frame" || item.type === "contact-lens";

    const groupedItems = useMemo(() => {
        if (!isGroupable || !source.length) return null;

        const groups = {};
        source.forEach((sourceItem) => {
            let modelKey;
            if (item.type === "frame") {
                modelKey = `${sourceItem.brand || ""} ${sourceItem.model || ""}`.trim();
            } else {
                modelKey = `${sourceItem.brand || ""} ${sourceItem.name || ""}`.trim();
            }

            if (!groups[modelKey]) {
                groups[modelKey] = {
                    modelKey,
                    displayName: modelKey || "Unknown",
                    variants: [],
                    totalStock: 0
                };
            }
            groups[modelKey].variants.push(sourceItem);
            groups[modelKey].totalStock += parseInt(sourceItem.stock) || 0;
        });

        return Object.values(groups);
    }, [source, item.type, isGroupable]);

    const selectedModelData = useMemo(() => {
        if (!groupedItems || !selectedModel) return null;
        return groupedItems.find(g => g.modelKey === selectedModel);
    }, [groupedItems, selectedModel]);

    useEffect(() => {
        if (isGroupable && item.itemId && groupedItems) {
            const foundItem = source.find(f => f.id.toString() === item.itemId);
            if (foundItem) {
                let modelKey;
                if (item.type === "frame") {
                    modelKey = `${foundItem.brand || ""} ${foundItem.model || ""}`.trim();
                } else {
                    modelKey = `${foundItem.brand || ""} ${foundItem.name || ""}`.trim();
                }
                if (modelKey !== selectedModel) {
                    setSelectedModel(modelKey);
                }
            }
        }
    }, [item.itemId, item.type, source, groupedItems, selectedModel, isGroupable]);

    if (isGroupable && groupedItems) {
        const hasMultipleVariants = groupedItems.some(g => g.variants.length > 1);
        const needsColorSelector = selectedModelData && selectedModelData.variants.length > 1;

        if (!hasMultipleVariants) {
            return (
                <Select value={item.itemId} onValueChange={(val) => onChange(item.id, "itemId", val)}>
                    <SelectTrigger className="bg-white/50"><SelectValue placeholder={`Select ${labelPrefix}`} /></SelectTrigger>
                    <SelectContent>
                        {source.length > 0 ? source.map((i) => (
                            <SelectItem key={i.id} value={i.id.toString()}>
                                {i.name || `${i.brand || ""} ${i.model || ""}`.trim()} <Badge variant="secondary" className="ml-2">{i.stock} in stock</Badge>
                            </SelectItem>
                        )) : <SelectItem value="no-items" disabled>No {item.type}s available</SelectItem>}
                    </SelectContent>
                </Select>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                <Select value={selectedModel} onValueChange={(val) => {
                    setSelectedModel(val);
                    const group = groupedItems.find(g => g.modelKey === val);
                    if (group && group.variants.length === 1) {
                        onChange(item.id, "itemId", group.variants[0].id.toString());
                    } else {
                        onChange(item.id, "itemId", "");
                    }
                }}>
                    <SelectTrigger className="bg-white/50"><SelectValue placeholder={`Select ${labelPrefix}`} /></SelectTrigger>
                    <SelectContent>
                        {groupedItems.length > 0 ? groupedItems.map((group) => (
                            <SelectItem key={group.modelKey} value={group.modelKey}>
                                {group.displayName} <Badge variant="secondary" className="ml-2">{group.totalStock} total</Badge>
                            </SelectItem>
                        )) : <SelectItem value="no-items" disabled>No {item.type}s available</SelectItem>}
                    </SelectContent>
                </Select>

                {needsColorSelector && (
                    <Select value={item.itemId} onValueChange={(val) => onChange(item.id, "itemId", val)}>
                        <SelectTrigger className="bg-white/50"><SelectValue placeholder="Select Color" /></SelectTrigger>
                        <SelectContent>
                            {selectedModelData.variants.map((variant) => (
                                <SelectItem key={variant.id} value={variant.id.toString()}>
                                    {variant.color || "Default"} <Badge variant="secondary" className="ml-2">{variant.stock} in stock</Badge>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        );
    }

    return (
        <Select value={item.itemId} onValueChange={(val) => onChange(item.id, "itemId", val)}>
            <SelectTrigger className="bg-white/50"><SelectValue placeholder={`Select ${labelPrefix}`} /></SelectTrigger>
            <SelectContent>
                {source.length > 0 ? source.map((i) => (
                    <SelectItem key={i.id} value={i.id.toString()}>
                        {i.name} {i.stock !== undefined && <Badge variant="secondary" className="ml-2">{i.stock} in stock</Badge>}
                    </SelectItem>
                )) : <SelectItem value="no-items" disabled>No {item.type}s available</SelectItem>}
            </SelectContent>
        </Select>
    );
}
