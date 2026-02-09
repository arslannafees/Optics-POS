"use client";

import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SalesReportFilters({ filters, setFilters, meta, onSearch }) {
    const update = (k, v) => setFilters(p => ({ ...p, [k]: v }));

    return (
        <div className="bg-background mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <FSelect
                    label="Branch"
                    value={filters.branch}
                    onChange={v => update('branch', v)}
                    options={meta.branches}
                    allLabel="All Branches"
                />
                <FSelect
                    label="Order Type"
                    value={filters.orderType}
                    onChange={v => update('orderType', v)}
                    options={[{ id: "Online", name: "Online" }, { id: "Offline", name: "Offline" }, { id: "Phone", name: "Phone" }]}
                    allLabel="All"
                />
                <FSelect
                    label="Product Type"
                    value={filters.productType}
                    onChange={v => update('productType', v)}
                    options={[
                        { id: "Frame", name: "Frames" },
                        { id: "Spectacle Lens", name: "Spectacle Lenses" },
                        { id: "Contact Lens", name: "Contact Lenses" },
                        { id: "Accessory", name: "Accessories" }
                    ]}
                    allLabel="All Items" // Matches Image 1
                />
                <ProductSelect filters={filters} update={update} meta={meta} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FSelect
                    label="Customer"
                    value={filters.customer}
                    onChange={v => update('customer', v)}
                    options={meta.customers}
                    allLabel="All Customers"
                />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">From Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.fromDate} onChange={e => update('fromDate', e.target.value)} placeholder="Select Date" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">To Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.toDate} onChange={e => update('toDate', e.target.value)} placeholder="Select Date" />
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

const FSelect = ({ label, value, onChange, options, allLabel = "All" }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label} <span className="text-red-500">*</span></label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">{allLabel}</SelectItem>
                {options.map(o => <SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
);

const ProductSelect = ({ filters, update, meta }) => {
    const opts = filters.productType === "Frame" ? meta.frames : filters.productType === "Lens" ? meta.lenses : filters.productType === "Accessory" ? meta.accessories : [];
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product <span className="text-red-500">*</span></label>
            <Select value={filters.product} onValueChange={v => update('product', v)}>
                <SelectTrigger className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Products</SelectItem>
                    {opts.map(o => <SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
};
