"use client";

import React from "react";

export function LaserjetInfoBar({ order, settings }) {
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString();
    };

    if (!order) return null;
    return (
        <div className="flex bg-slate-100 p-6 mb-10">
            <div className="w-full">
                <h3 className="font-bold text-slate-800 mb-2 text-sm">Details</h3>
                <div className="grid grid-cols-4 gap-4 text-sm text-slate-600">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs uppercase">Invoice #</span>
                        <span>{settings?.invoicePrefix || "INV"}-{String(order.localId || order.id).padStart(4, "0")}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs uppercase">Date</span>
                        <span>{formatDate(order.date)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs uppercase">Due Date</span>
                        <span>{formatDate(order.deliveryDate || order.date)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs uppercase">Type</span>
                        <span>{order.orderType || "Standard"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
