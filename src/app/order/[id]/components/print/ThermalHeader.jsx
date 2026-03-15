"use client";

import React from "react";

export function ThermalHeader({ order, settings }) {
    if (!settings) return null;

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString();
    };

    const formatTime = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="text-center space-y-1.5 mb-6">
            <div className="flex flex-col items-center mb-4">
                {settings?.businessLogo && (
                    <img src={settings.businessLogo} alt="Logo" className="h-20 w-auto object-contain mb-2 mix-blend-multiply" />
                )}
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-black uppercase tracking-tight leading-none">
                        {settings?.businessName || "OPTICS"}
                    </h1>
                    {order?.branchName && order.branchName !== settings?.businessName && (
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-700 mt-0.5">
                            {order.branchName}
                        </p>
                    )}
                    <p className="text-[10px] font-medium leading-tight max-w-[200px] text-center mt-1">
                        {order?.branchAddress || settings?.businessAddress}
                    </p>
                </div>
            </div>

            <div className="border-t border-black/10 pt-2 space-y-0.5">
                <p className="text-[11px] font-black">TEL: {settings?.businessPhone}</p>
                <p className="text-[10px] uppercase font-bold">EMAIL: {settings?.businessEmail}</p>
                {settings?.gstNumber && (
                    <p className="text-[10px] font-black uppercase">GSTIN: {settings.gstNumber}</p>
                )}
            </div>

            <div className="border-t-2 border-black mt-4 pt-2 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-black uppercase">
                    <span>INVOICE: {settings?.invoicePrefix || "INV"}-{String(order.localId || order.id).padStart(4, "0")}</span>
                    <span>{formatDate(order.date)}</span>
                </div>
                <div className="flex flex-col text-[11px] font-black uppercase border-b border-black/10 pb-1 mb-1">
                    <span className="text-[10px] font-medium text-slate-500">CUSTOMER:</span>
                    <span className="leading-tight">{order.customer || "Walking Customer"}</span>
                    {order.customerMobile && <span className="text-[10px] font-medium">{order.customerMobile}</span>}
                </div>
                <div className="flex justify-between items-center text-[10px] font-medium uppercase text-slate-600">
                    <span>CASHIER: ADMIN</span>
                    <span>{formatDate(new Date())}, {formatTime(new Date())}</span>
                </div>
            </div>
        </div>
    );
}
