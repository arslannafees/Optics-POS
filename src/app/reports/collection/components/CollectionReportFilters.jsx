"use client";

import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function CollectionReportFilters({ filters, setFilters, branches, onSearch }) {
    const ch = (f, v) => setFilters(p => ({ ...p, [f]: v }));

    return (
        <div className="bg-background mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                <FSelect
                    label="Branch"
                    value={filters.branch}
                    onChange={v => ch("branch", v)}
                    items={branches}
                    allLabel="All Branches"
                />
                <FSelect
                    label="Order Type"
                    value={filters.orderType}
                    onChange={v => ch("orderType", v)}
                    items={[{ id: "Online", name: "Online" }, { id: "Offline", name: "Offline" }, { id: "Phone", name: "Phone" }]}
                    allLabel="All"
                />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">From Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.fromDate} onChange={e => ch("fromDate", e.target.value)} placeholder="Select Date" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">To Date <span className="text-red-500">*</span></label>
                    <DatePicker value={filters.toDate} onChange={e => ch("toDate", e.target.value)} placeholder="Select Date" />
                </div>
                <Button onClick={onSearch} className="w-full h-10 bg-black hover:bg-black/90 text-white font-medium rounded-md">
                    Search
                </Button>
            </div>
        </div>
    );
}

const FSelect = ({ label, value, onChange, items, allLabel = "All" }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label} <span className="text-red-500">*</span></label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="All">{allLabel}</SelectItem>
                {items.map(i => <SelectItem key={i.id || i.v} value={(i.id || i.v).toString()}>{i.name || i.l}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
);
