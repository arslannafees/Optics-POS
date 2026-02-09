"use client";

import React from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useSalesReport } from "@/hooks/useSalesReport";
import { SalesReportHeader, SalesReportFilters, SalesReportTable, SalesReportSummary } from "./components";

/**
 * SalesReportPageView: Main orchestrator for the Sales Report view.
 */
export function SalesReportPageView() {
    const { settings } = useSettings();
    const s = useSalesReport(); // s = sales hook

    return (
        <div className="p-6 bg-background min-h-screen space-y-6">
            <SalesReportHeader />
            <SalesReportFilters
                filters={s.filters} setFilters={s.setFilters}
                meta={s.meta} onSearch={s.search}
            />
            <SalesReportTable
                data={s.reportData} loading={s.loading}
                currency={settings.currency}
            />
            <SalesReportSummary
                total={s.totals.amount}
                currency={settings.currency}
            />
        </div>
    );
}
