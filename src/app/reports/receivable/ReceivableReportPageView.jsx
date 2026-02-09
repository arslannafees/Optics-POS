"use client";

import React from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useReceivableReport } from "@/hooks/useReceivableReport";
import { useReceivableActions } from "@/hooks/useReceivableActions";
import * as C from "./components";

/**
 * ReceivableReportPageView: Orchestrates the receivable reporting module.
 */
export function ReceivableReportPageView() {
    const { currentShop } = useBranch();
    const { settings } = useSettings();
    const r = useReceivableReport(currentShop);
    const a = useReceivableActions(currentShop, r.fetchReceivables);

    const onSearch = () => {
        const p = {};
        if (r.selectedId) p.customerId = r.selectedId;
        else if (r.searchQuery) p.searchQuery = r.searchQuery;
        r.fetchReceivables(p);
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <C.ReceivableReportHeader onRefresh={a.refresh} refreshing={a.refreshing} onExportPDF={() => a.exportPDF(r.data.receivables)} onExportExcel={() => a.exportExcel(r.data.receivables)} />
            <C.ReceivableReportSearch query={r.searchQuery} setQuery={r.setSearchQuery} customers={r.data.customers} selectedId={r.selectedId} setSelectedId={r.setSelectedId} onSearch={onSearch} />
            <C.ReceivableReportTable data={r.data.receivables} loading={r.loading} currency={settings.currency} onViewOrders={a.viewOrders} />
            <C.CustomerOrdersDialog open={a.orders.open} onOpenChange={o => a.setOrders(p => ({ ...p, open: o }))} orders={a.orders} customer={a.orders.customer} currency={settings.currency} />
        </div>
    );
}
