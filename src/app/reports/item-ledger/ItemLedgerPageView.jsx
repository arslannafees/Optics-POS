"use client";

import React from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useItemLedger } from "@/hooks/useItemLedger";
import { ItemLedgerFilters, ItemLedgerTable } from "./components";

/**
 * ItemLedgerPageView: Orchestrates the item ledger reporting interface.
 */
export function ItemLedgerPageView() {
    const { currentShop } = useBranch();
    const { filters, setFilters, data, loading, initialLoading, search } = useItemLedger(currentShop);

    if (initialLoading) return (
        <div className="p-10 text-center animate-pulse text-muted-foreground font-medium">
            Initializing Report Systems...
        </div>
    );

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <header className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">Item Ledger</h1>
            </header>

            <ItemLedgerFilters filters={filters} setFilters={setFilters} data={data} onSearch={search} />
            <ItemLedgerTable ledger={data.ledger} loading={loading} />
        </div>
    );
}
