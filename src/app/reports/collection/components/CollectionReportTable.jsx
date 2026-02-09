import React from "react";
import NoData from "@/components/NoData";

export function CollectionReportTable({ data, loading, currency }) {
    // Simplified columns: Removed Order Type & Delivery Date for better spacing
    const cols = "grid-cols-[50px_100px_1fr_100px_100px_100px_100px_100px_100px]";

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[400px]">
            {/* Header */}
            <div className={`bg-gray-50 border-b border-gray-200 px-6 py-4 grid ${cols} gap-4 text-[11px] font-bold uppercase text-gray-500 tracking-wider items-end leading-snug text-center`}>
                <div>No</div>
                <div>Reference No</div>
                <div>Name</div>
                <div>Order Date</div>
                <div>Branch</div>
                <div>Total</div>
                <div>Deposit</div>
                <div>Balance</div>
                <div>Received</div>
            </div>

            {/* Body */}
            <div className="divide-y divide-gray-200">
                {loading ? (
                    <div className="p-12 text-center text-gray-500 font-medium">Loading Collections...</div>
                ) : data.length > 0 ? (
                    data.map((it, idx) => (
                        <div key={it.id} className={`grid ${cols} gap-4 px-6 py-4 text-xs font-medium text-gray-700 items-center hover:bg-gray-50 transition-colors text-center`}>
                            <div className="text-gray-500">{idx + 1}</div>
                            <div className="font-medium text-gray-900 truncate">{it.id}</div>
                            <div className="font-medium whitespace-normal leading-tight">{it.customer}</div>
                            <div>{it.date}</div>
                            <div>
                                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                                    {it.branch || 'Main'}
                                </span>
                            </div>
                            <div className="font-bold text-gray-900">{currency} {it.total?.toLocaleString()}</div>
                            <div className="font-bold text-green-600">{currency} {it.deposit?.toLocaleString()}</div>
                            <div className="font-bold text-red-600">{currency} {it.balance?.toLocaleString()}</div>
                            <div className="font-bold text-gray-900">{currency} {it.deposit?.toLocaleString()}</div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center p-12">
                        <NoData message="No collection data found" />
                    </div>
                )}
            </div>
        </div>
    );
}
