"use client";

import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ItemLedgerFilters({ filters, setFilters, data, onSearch }) {
    const change = (f, v) => setFilters(p => ({ ...p, [f]: v }));
    const bFiltered = data.brands.filter(b => {
        if (filters.itemType === "All") return true;
        if (filters.itemType === "Frame") return ["Glass", "Frame", "glass", "frame"].includes(b.type);
        if (filters.itemType === "Spectacle") return ["Spectacle Lens", "Lens", "spectacle lens", "lens"].includes(b.type);
        if (filters.itemType === "Contact") return ["Contact Lens", "contact lens"].includes(b.type);
        return ["Accessory", "accessory"].includes(b.type);
    });

    return (
        <div className="bg-background mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <FSelect
                    label="Item Type"
                    value={filters.itemType}
                    onChange={v => change("itemType", v)}
                    items={[
                        { v: "All", l: "All Items" },
                        { v: "Frame", l: "Frames" },
                        { v: "Spectacle", l: "Spectacle Lenses" },
                        { v: "Contact", l: "Contact Lenses" },
                        { v: "Accessory", l: "Accessories" }
                    ]}
                />
                <FSelect
                    label="Brand"
                    value={filters.brand}
                    onChange={v => change("brand", v)}
                    items={[{ v: "All", l: "All Brands" }, ...bFiltered.map(b => ({ v: b.id.toString(), l: b.brand }))]}
                    placeholder="Select Brand"
                />
                <FSelect
                    label="Branch"
                    value={filters.branch}
                    onChange={v => change("branch", v)}
                    items={[{ v: "All", l: "All Branches" }, ...data.branches.map(b => ({ v: b.id.toString(), l: b.name }))]}
                />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">From Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.fromDate} onChange={e => change("fromDate", e.target.value)} placeholder="Select Date" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">To Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.toDate} onChange={e => change("toDate", e.target.value)} placeholder="Select Date" />
                </div>
                <div className="flex justify-end">
                    <Button onClick={onSearch} className="w-full md:w-auto px-12 h-10 bg-black hover:bg-black/90 text-white font-medium rounded-md">
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}

const FSelect = ({ label, value, onChange, items, placeholder }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label} <span className="text-red-500">*</span></label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder={placeholder || `Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                {items.map(i => <SelectItem key={i.v} value={i.v}>{i.l}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
);
