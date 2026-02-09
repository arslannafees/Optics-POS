"use client";

import React from "react";
import { useLoginForm } from "@/hooks/useLoginForm";
import { LoginHeader, LoginForm } from "./components";

/**
 * LoginPageView: Main orchestrator for the login screen.
 */
export function LoginPageView() {
    const f = useLoginForm(); // f = form hook

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-sm">
                <LoginHeader />
                <div className="bg-background border rounded-lg p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium">Sign in</h2>
                        <p className="text-sm text-muted-foreground">Access your optical store dashboard.</p>
                    </div>
                    <LoginForm {...f} onSubmit={f.handleLogin} />
                </div>
            </div>
        </div>
    );
}
