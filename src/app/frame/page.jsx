"use client";

import React from "react";
import { FramesPageView } from "./FramesPageView";

/**
 * FramesPage Component
 * 
 * Entry point for /frame inventory management.
 * Adheres to the 20-60 line limit by delegating to FramesPageView.
 * 
 * @returns {JSX.Element} The rendered Frames management page.
 */
export default function FramesPage() {
  return (
    <section className="container mx-auto py-2">
      <FramesPageView />
    </section>
  );
}
