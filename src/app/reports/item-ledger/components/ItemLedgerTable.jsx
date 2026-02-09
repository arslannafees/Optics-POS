import React from "react";
import NoData from "@/components/NoData";

export function ItemLedgerTable({ ledger, loading }) {
    const cols = "grid-cols-[50px_100px_1.2fr_1.2fr_120px_80px_80px_90px]";

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[400px]">
            {/* Header */}
            <div className={`bg-gray-50 border-b border-gray-200 px-6 py-4 grid ${cols} gap-4 text-xs font-bold uppercase text-gray-600 tracking-wider items-end leading-snug text-center`}>
                <div>#</div>
                <div>Date</div>
                <div>Item</div>
                <div>Client</div>
                <div>Branch</div>
                <div>In</div>
                <div>Out</div>
                <div>Balance</div>
            </div>

            {/* Body */}
            <div className="divide-y divide-gray-200">
                {loading ? (
                    <div className="p-12 text-center text-gray-500 font-medium italic">Loading Ledger...</div>
                ) : ledger.length > 0 ? (
                    ledger.map((it, idx) => (
                        <div key={idx} className={`grid ${cols} gap-4 px-6 py-4 text-sm font-medium text-gray-700 items-center hover:bg-gray-50 transition-colors text-center`}>
                            <div className="text-gray-500 font-normal">{idx + 1}</div>
                            <div className="text-gray-600">{it.date}</div>
                            <div className="font-semibold text-gray-900 truncate">{it.item_name}</div>
                            <div className="text-gray-700 truncate">{it.client}</div>
                            <div className="truncate text-gray-500">{it.branch || 'Main'}</div>
                            <div className="text-green-600 font-bold">{it.in || 0}</div>
                            <div className="text-red-500 font-bold">{it.out || 0}</div>
                            <div className="font-black text-gray-900">{it.balance}</div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center p-12">
                        <NoData message="No transactions found for this item." />
                    </div>
                )}
            </div>
        </div>
    );
}
