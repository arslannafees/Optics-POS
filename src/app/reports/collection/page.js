"use client";

import React from "react";
import { CollectionReportPageView } from "./CollectionReportPageView";

/**
 * CollectionReportPage: Entry point for /reports/collection.
 * 
 * Modularized for 20-60 line limit compliance.
 * Delegates all logic and UI to the CollectionReportPageView component.
 * 
 * @returns {JSX.Element} The rendered Collection report.
 */
export default function CollectionReportPage() {
  return (
    <section className="bg-background min-h-screen">
      <CollectionReportPageView />
    </section>
  );
}
