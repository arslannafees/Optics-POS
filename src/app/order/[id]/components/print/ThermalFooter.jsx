"use client";

import React from "react";

export function ThermalFooter({ order, settings, cashier }) {
    if (!order || !settings) return null;

    const cur = settings.currency || "PKR";
    const subtotal = order.subtotal || order.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const tax = order.tax || 0;

    return (
        <div className="space-y-4">
            <div className="space-y-2 border-t border-black pt-2">
                <div className="flex justify-between text-[11px] font-black">
                    <span>SUBTOTAL</span>
                    <span>{cur} {Number(subtotal).toLocaleString()}</span>
                </div>
                {Number(order.discount || 0) > 0 && (
                    <div className="flex justify-between text-[11px] font-black text-red-600">
                        <span>DISCOUNT</span>
                        <span>-{cur} {Number(order.discount).toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-[11px] font-medium text-slate-600">
                    <span>{settings?.gstNumber ? "GSTIN TAX" : "TAX"}:</span>
                    <span>{Number(tax).toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t-2 border-black py-2 bg-slate-100 px-2 rounded-sm">
                    <span className="text-xl font-black">TOTAL</span>
                    <span className="text-xl font-black">{cur} {Number(order.total || 0).toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                        <span>PAID AMOUNT:</span>
                        <span>{cur} {Number(order.advance || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between bg-slate-100 p-2 text-[12px] font-black uppercase">
                        <span>BALANCE DUE:</span>
                        <span>{cur} {Number(order.balance || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {(order.notes || settings?.customerMessage) && (
                <div className="border-t border-black py-2">
                    <p className="text-[10px] font-black italic text-center uppercase tracking-widest">
                        {order.notes || settings?.customerMessage}
                    </p>
                </div>
            )}

            <div className="border-t border-black/20 pt-2 text-left">
                <p className="text-[9px] font-black uppercase underline mb-1">TERMS & CONDITIONS:</p>
                <p className="text-[8px] leading-tight text-slate-700">{settings?.invoiceTerms || "Thank you for your business!"}</p>
            </div>

            <div className="text-center pt-4 border-t border-black/10 text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                <p>DESIGNED BY ARSLAN NAFEES</p>
                <p>+923341113047</p>
            </div>
        </div>
    );
}
