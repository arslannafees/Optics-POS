"use client";

import React from "react";
import OrderListPage from "./OrderListPage";

/**
 * OrderPage: Entry point for /order route.
 * Renders the modularized Order List Page within the application layout.
 * 
 * Objectives:
 * - Adhere to 20-60 line project limit.
 * - Provide clean entry point for routing.
 * - Delegate logic to specialized components and hooks.
 */
export default function OrderPage() {
  return (
    <section className="container mx-auto py-2">
      <OrderListPage />
    </section>
  );
}
