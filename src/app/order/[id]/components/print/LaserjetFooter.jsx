"use client";

import React from "react";

export function LaserjetFooter({ order, settings }) {
    if (!order || !settings) return null;
    return (
        <div className="mt-8 border-t border-slate-200 pt-8 flex justify-between items-start">
            <div className="w-1/2 pr-12">
                <h3 className="font-bold text-slate-800 mb-1 text-xs">Message</h3>
                <p className="text-xs text-slate-600 mb-4">{order.notes || settings?.customerMessage}</p>
                {settings?.invoiceTerms && (
                    <div className="mt-4">
                        <p className="font-bold text-slate-800 text-[10px] uppercase mb-1">Terms</p>
                        <p className="text-[10px] text-slate-500 whitespace-pre-line">{settings.invoiceTerms}</p>
                    </div>
                )}
            </div>
            <div className="w-1/3 space-y-1 text-sm">
                <div className="flex justify-between text-slate-600">
                    <span className="font-bold text-slate-800">Subtotal</span>
                    <span>{settings?.currency} {Number(order.subtotal || 0).toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                    <div className="flex justify-between text-slate-600">
                        <span className="font-bold text-slate-800">Discount</span>
                        <span className="text-red-500">-{Number(order.discount).toLocaleString()}</span>
                    </div>
                )}
                {(order.tax > 0 || settings?.gstNumber) && (
                    <div className="flex justify-between text-slate-600">
                        <span className="font-bold text-slate-800">{settings?.gstNumber ? "GSTIN TAX" : "Tax"}</span>
                        <span>{Number(order.tax || 0).toLocaleString()}</span>
                    </div>
                )}
                <div className="h-px bg-slate-800 my-2"></div>
                <div className="flex justify-between items-center bg-slate-100 p-2 rounded-sm">
                    <span className="font-bold text-lg text-slate-800">Total</span>
                    <span className="font-bold text-lg text-slate-800">{settings?.currency} {Number(order.total || 0).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
