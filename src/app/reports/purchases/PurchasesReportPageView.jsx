"use client";

import React from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useSettings } from "@/contexts/SettingsContext";
import { usePurchasesReport } from "@/hooks/usePurchasesReport";
import * as C from "./components";

/**
 * PurchasesReportPageView: Orchestrates the purchase reporting system.
 */
export function PurchasesReportPageView() {
    const { currentShop } = useBranch();
    const { settings } = useSettings();
    const { filters, setFilters, meta, data, loading, search } = usePurchasesReport(currentShop);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <header className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">Purchases Report</h1>
            </header>

            <C.PurchasesReportFilters filters={filters} setFilters={setFilters} meta={meta} onSearch={search} />
            <C.PurchasesReportTable data={data} loading={loading} currency={settings.currency} />
            {data.length > 0 && <C.PurchasesReportSummary data={data} currency={settings.currency} />}
        </div>
    );
}
