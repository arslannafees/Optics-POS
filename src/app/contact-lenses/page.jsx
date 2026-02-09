"use client";

import React from "react";
import { ContactLensesPageView } from "./ContactLensesPageView";

/**
 * ContactLensesPage: Main entry for contact lens inventory.
 * Modularized for 20-60 line limit compliance.
 * 
 * @returns {JSX.Element} The rendered Contact Lenses module.
 */
export default function ContactLensesPage() {
    return (
        <section className="container mx-auto py-2">
            <ContactLensesPageView />
        </section>
    );
}
