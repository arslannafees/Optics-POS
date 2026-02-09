"use client";

import React from "react";
import { SalesReportPageView } from "./SalesReportPageView";

/**
 * SalesReportPage: Main entry for /reports/sales.
 * 
 * Modularized for 20-60 line limit compliance.
 * 
 * @returns {JSX.Element} The rendered Sales Report module.
 */
export default function SalesReportPage() {
  return (
    <section className="container mx-auto">
      <SalesReportPageView />
    </section>
  );
}
