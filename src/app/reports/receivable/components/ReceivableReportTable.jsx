import React from "react";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";

export function ReceivableReportTable({ data, loading, currency, onViewOrders }) {
    // 9 columns: Name (2), Contact (2), Financials (3), Ref (1), Actions (1)
    const cols = "grid-cols-[1fr_1fr_110px_100px_100px_100px_100px_1fr_100px]";

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[400px]">
            {/* Header */}
            <div className={`bg-gray-50 border-b border-gray-200 px-6 py-4 grid ${cols} gap-4 text-[10px] font-bold uppercase text-gray-500 tracking-wider items-end leading-snug text-center`}>
                <div>First Name</div>
                <div>Last Name</div>
                <div>Mobile</div>
                <div>Phone</div>
                <div>Balance</div>
                <div>Total</div>
                <div>Deposit</div>
                <div>Reference</div>
                <div>Actions</div>
            </div>

            {/* Body */}
            <div className="divide-y divide-gray-200">
                {loading ? (
                    <div className="p-12 text-center text-gray-500 font-medium italic animate-pulse">Loading Receivables...</div>
                ) : data.length > 0 ? (
                    data.map((it, idx) => (
                        <div key={it.id || idx} className={`grid ${cols} gap-4 px-6 py-4 text-xs font-medium text-gray-700 items-center hover:bg-gray-50 transition-colors text-center`}>
                            <div className="text-gray-900 font-semibold">{it.firstName}</div>
                            <div className="text-gray-900 font-semibold">{it.lastName}</div>
                            <div className="text-gray-500">{it.mobile}</div>
                            <div className="text-gray-500">{it.phone || '-'}</div>
                            <div className="font-bold text-red-600 underline decoration-red-200 underline-offset-4">
                                {currency} {it.balance?.toLocaleString()}
                            </div>
                            <div className="font-bold text-gray-900">
                                {currency} {it.total?.toLocaleString()}
                            </div>
                            <div className="text-green-600 font-bold">
                                {currency} {it.deposit?.toLocaleString()}
                            </div>
                            <div className="truncate text-[10px] text-gray-400 font-mono" title={it.reference}>
                                {it.reference || '-'}
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewOrders(it)}
                                    className="h-8 px-3 text-[10px] uppercase font-bold text-black border-gray-200 bg-white hover:bg-gray-50"
                                >
                                    Orders
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center p-12">
                        <NoData message="No receivable records found." />
                    </div>
                )}
            </div>
        </div>
    );
}
