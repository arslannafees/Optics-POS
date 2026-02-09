"use client";

import React from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useCollectionReport } from "@/hooks/useCollectionReport";
import * as C from "./components";

/**
 * CollectionReportPageView: Orchestrates the payment collection reporting interface.
 */
export function CollectionReportPageView() {
    const { currentShop } = useBranch();
    const { settings } = useSettings();
    const r = useCollectionReport(currentShop);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <header className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">Collection Report</h1>
            </header>

            <C.CollectionReportFilters filters={r.filters} setFilters={r.setFilters} branches={r.branches} onSearch={r.search} />
            <C.CollectionReportTable data={r.data} loading={r.loading} currency={settings.currency} />
            {r.data.length > 0 && <C.CollectionReportSummary sums={r.sums} currency={settings.currency} />}
        </div>
    );
}
