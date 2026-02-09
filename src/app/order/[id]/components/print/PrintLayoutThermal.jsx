"use client";

import React from "react";
import { ThermalHeader } from "./ThermalHeader";
import { ThermalItemsTable } from "./ThermalItemsTable";
import { ThermalFooter } from "./ThermalFooter";

export function PrintLayoutThermal({ order, settings, cashierName, isPreview = false }) {
    if (!order) return null;

    return (
        <div className={isPreview ? "fixed top-0 left-0 z-[9999] h-screen w-screen bg-slate-500/50 overflow-auto flex justify-center p-8 backdrop-blur-sm" : "hidden print:block"}>
            <div className="bg-white p-4 w-[80mm] min-h-fit shadow-xl print:shadow-none font-sans text-black leading-tight">
                <style dangerouslySetInnerHTML={{ __html: "@media print { @page { margin: 0; size: 80mm auto; } body { margin: 0; padding: 0 !important; } }" }} />

                <ThermalHeader order={order} settings={settings} />

                <ThermalItemsTable items={order.items} />

                <ThermalFooter order={order} settings={settings} cashier={cashierName} />
            </div>
        </div>
    );
}
