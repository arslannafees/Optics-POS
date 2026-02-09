"use client";

import { Suspense } from "react";
import { OrderForm } from "./OrderForm";

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse">Loading order form...</div>}>
      <OrderForm />
    </Suspense>
  );
}
