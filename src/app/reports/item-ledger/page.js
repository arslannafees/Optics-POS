"use client";

import React from "react";
import { ItemLedgerPageView } from "./ItemLedgerPageView";

/**
 * ItemLedgerPage: Entry point for /reports/item-ledger.
 * 
 * Modularized for 20-60 line limit compliance.
 * Delegates all logic and UI to the ItemLedgerPageView component.
 * 
 * @returns {JSX.Element} The rendered Item Ledger report.
 */
export default function ItemLedgerPage() {
  return (
    <section className="bg-background min-h-screen">
      <ItemLedgerPageView />
    </section>
  );
}
