"use client";

import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function PurchasesReportFilters({ filters, setFilters, meta, onSearch }) {
    const change = (f, v) => setFilters(p => ({ ...p, [f]: v }));

    return (
        <div className="bg-background mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <FSelect
                    label="Branch"
                    value={filters.branch}
                    onChange={v => change("branch", v)}
                    items={meta.branches}
                    allLabel="All Branches"
                />
                <FSelect
                    label="Product Type"
                    value={filters.productType}
                    onChange={v => change("productType", v)}
                    items={[
                        { id: "Frame", name: "Frames" },
                        { id: "Spectacle Lens", name: "Spectacle Lenses" },
                        { id: "Contact Lens", name: "Contact Lenses" }
                    ]}
                    allLabel="All Items"
                />
                <ProductSelect filters={filters} change={change} meta={meta} />
                <FSelect
                    label="Vendor"
                    value={filters.vendor}
                    onChange={v => change("vendor", v)}
                    items={meta.vendors}
                    allLabel="All Vendors"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">From Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.fromDate} onChange={e => change("fromDate", e.target.value)} placeholder="Select Date" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">To Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.toDate} onChange={e => change("toDate", e.target.value)} placeholder="Select Date" />
                </div>
                <div className="flex items-end">
                    <Button onClick={onSearch} className="w-full h-10 bg-black hover:bg-black/90 text-white font-medium rounded-md">
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}

const FSelect = ({ label, value, onChange, items = [], allLabel = "All" }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label} <span className="text-red-500">*</span></label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">{allLabel}</SelectItem>
                {items.map(i => <SelectItem key={i.id} value={i.id.toString()}>{i.name}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
);

const ProductSelect = ({ filters, change, meta }) => {
    const items = filters.productType === "Frame" ? meta.frames : filters.productType === "Lens" ? meta.lenses : [];
    return (
        <FSelect
            label="Product"
            value={filters.product}
            onChange={v => change("product", v)}
            items={items}
            allLabel="All Products"
        />
    );
};
