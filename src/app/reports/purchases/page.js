"use client";

import React from "react";
import { PurchasesReportPageView } from "./PurchasesReportPageView";

/**
 * PurchasesReportPage: Entry point for /reports/purchases.
 * 
 * Modularized for 20-60 line limit compliance.
 * Delegates all logic and UI to the PurchasesReportPageView component.
 * 
 * @returns {JSX.Element} The rendered Purchases report.
 */
export default function PurchasesReportPage() {
  return (
    <section className="bg-background min-h-screen">
      <PurchasesReportPageView />
    </section>
  );
}
