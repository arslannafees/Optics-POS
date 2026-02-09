"use client";

import React, { useEffect } from "react";
import { LoginPageView } from "./LoginPageView";

/**
 * LoginPage: Entry point for /login.
 * 
 * Modularized for 20-60 line limit compliance.
 * Sets the document title and renders the view.
 * 
 * @returns {JSX.Element} The rendered login page.
 */
export default function LoginPage() {
  useEffect(() => { document.title = "Optics"; }, []);

  return (
    <section>
      <LoginPageView />
    </section>
  );
}
