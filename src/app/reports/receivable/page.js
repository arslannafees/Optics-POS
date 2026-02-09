"use client";

import React from "react";
import { ReceivableReportPageView } from "./ReceivableReportPageView";

/**
 * ReceivableReportPage: Entry point for /reports/receivable.
 * 
 * Modularized for 20-60 line limit compliance.
 * Delegates all logic and UI to the ReceivableReportPageView component.
 * 
 * @returns {JSX.Element} The rendered Receivable report.
 */
export default function ReceivableReportPage() {
  return (
    <section className="bg-background min-h-screen">
      <ReceivableReportPageView />
    </section>
  );
}
