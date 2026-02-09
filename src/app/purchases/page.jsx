"use client";

import React from "react";
import { PurchasesPageView } from "./PurchasesPageView";

/**
 * PurchasesPage: Main entry for /purchases.
 * 
 * Modularized for 20-60 line limit compliance.
 * Delegates all logic to the PurchasesPageView orchestrator.
 * 
 * @returns {JSX.Element} The rendered Purchases module.
 */
export default function PurchasesPage() {
  return (
    <section className="container mx-auto">
      <PurchasesPageView />
    </section>
  );
}
