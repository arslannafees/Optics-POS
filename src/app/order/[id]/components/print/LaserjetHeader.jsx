"use client";

import React from "react";

export function LaserjetHeader({ settings, order }) {
    if (!settings) return null;
    return (
        <div className="flex justify-between items-start mb-12">
            <div className="w-1/2">
                {settings?.businessLogo && (
                    <img src={settings.businessLogo} alt="Logo" className="h-40 w-auto object-contain mb-6 mix-blend-multiply" />
                )}
                <div className="text-sm space-y-1 text-slate-700">
                    <div className="mb-2">
                        <p className="font-bold text-3xl leading-tight">
                            {settings?.businessName || "OPTICS"}
                        </p>
                        {order?.branchName && order.branchName !== settings?.businessName && (
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                                {order.branchName}
                            </p>
                        )}
                    </div>
                    <p className="text-slate-600">{order?.branchAddress || settings?.businessAddress}</p>
                </div>
            </div>
            <div className="w-1/2 text-right">
                <h2 className="text-4xl font-bold text-slate-800 mb-8">Invoice</h2>
                <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-bold text-slate-800">Phone #</span> {order?.branchPhone || settings?.businessPhone}</p>
                    <p><span className="font-bold text-slate-800">Email</span> {settings?.businessEmail}</p>
                    {settings?.gstNumber && <p><span className="font-bold text-slate-800">GST #</span> {settings.gstNumber}</p>}
                </div>
            </div>
        </div>
    );
}
