"use client";

import React from "react";
import { SettingsPageView } from "./SettingsPageView";

/**
 * SettingsPage Component
 * 
 * Main entry for application preferences.
 * Modularized for 20-60 line limit compliance.
 * 
 * @returns {JSX.Element} The rendered Settings page.
 */
export default function SettingsPage() {
  return (
    <section className="container mx-auto py-2">
      <SettingsPageView />
    </section>
  );
}
