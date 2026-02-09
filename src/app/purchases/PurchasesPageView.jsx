"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { usePurchases } from "@/hooks/usePurchases";
import * as C from "./components";

export function PurchasesPageView() {
    const p = usePurchases();
    const [delOpen, setDelOpen] = useState(false);
    const [payOpen, setPayOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);

    const actions = {
        view: (x) => p.a.view(x).then(() => setViewOpen(true)),
        setSelected: p.a.setSelected, setDelOpen, setPayOpen
    };

    return (
        <div className="space-y-6 p-4">
            <C.PurchasePageHeader onNew={() => p.setSheetOpen(true)} />
            <C.PurchaseStats stats={p.d.stats} currency={p.settings.currency} />
            <DataTable columns={C.getPurchaseColumns(p.settings, actions)} data={p.d.purchases} loading={p.d.loading} />

            <C.PurchaseAddEditSheet open={p.sheetOpen} setOpen={p.setSheetOpen} vendors={p.d.vendors} formData={p.f.formData} setFormData={p.f.setFormData} onSubmit={p.f.submit} meta={p.d.meta} currency={p.settings.currency} onQuickAdd={(id, type) => p.q.setActiveRowId(id) || p.q.setType(type) || p.q.setOpen(true)} />
            <C.PurchaseViewDialog open={viewOpen} onOpenChange={setViewOpen} data={p.a.details} loading={p.a.loading} currency={p.settings.currency} dateFormat={p.settings.dateFormat} />
            <C.PurchasePaymentDialog open={payOpen} onOpenChange={setPayOpen} purchase={p.a.selected} currency={p.settings.currency} onPay={p.a.pay} />
            <C.PurchaseDeleteDialog open={delOpen} onOpenChange={setDelOpen} onConfirm={p.a.remove} />
            <C.QuickAddItemDialog open={p.q.open} onOpenChange={p.q.setOpen} type={p.q.type} onSubmit={p.handleQuickAdd} loading={p.q.loading} currency={p.settings.currency} />
        </div>
    );
}
