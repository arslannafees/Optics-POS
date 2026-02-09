"use client";

import React from "react";
import LensesPageView from "./LensesPageView";

/**
 * LensesPage: Entry point for /spectacle-lenses inventory management.
 * 
 * Responsibilities:
 * - Render the modularized LensesPageView.
 * - Adhere to 20-60 line project limit.
 * - Provide a clean, documented entry point for the lens inventory module.
 */
export default function LensesPage() {
  return (
    <section className="container mx-auto py-2">
      <LensesPageView />
    </section>
  );
}
