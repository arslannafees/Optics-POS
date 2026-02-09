"use client";

import React from "react";
import NoData from "@/components/NoData";

export function SalesReportTable({ data, loading, currency }) {
    if (loading) return <div className="px-6 py-12 text-center text-gray-500">Loading...</div>;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[400px]">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 grid grid-cols-9 gap-4 text-sm font-medium text-gray-700">
                <div>No</div><div>Order No</div><div>Customer</div><div>Item Type</div><div>Item Name</div><div>Date</div><div>Order Type</div><div>Branch</div><div>Total</div>
            </div>
            <div className="divide-y divide-gray-200">
                {data.length > 0 ? (
                    data.map((item, idx) => (
                        <div key={`${item.orderId}-${item.itemId}`} className="grid grid-cols-9 gap-4 px-6 py-4 text-sm text-gray-700 items-center hover:bg-gray-50 transition-colors">
                            <div>{idx + 1}</div><div className="font-medium">{item.orderId}</div><div>{item.customer}</div><div className="capitalize">{item.type}</div><div className="font-medium truncate">{item.name}</div><div>{item.date}</div>
                            <div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.orderType === 'Online' ? 'bg-blue-100 text-blue-700' : item.orderType === 'Offline' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {item.orderType}
                                </span>
                            </div>
                            <div className="truncate">{item.branchName || 'Main'}</div><div className="font-bold">{currency} {item.total?.toLocaleString()}</div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center p-12">
                        <NoData message="No sales data found for the selected filters" />
                    </div>
                )}
            </div>
        </div>
    );
}
