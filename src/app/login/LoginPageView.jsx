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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-muted/30">
            {/* Left side: Logo Section (Desktop only) */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-background border-r relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                <img 
                    src="/Images/Logo.png" 
                    alt="Logo" 
                    className="max-w-md w-10/12 h-auto object-contain z-10 transition-transform duration-500 hover:scale-105"
                />
            </div>

            {/* Right side: Login Form Section */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-6">
                    <LoginHeader />
                    <div className="bg-background border rounded-xl p-8 shadow-md transition-all hover:shadow-lg">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
                            <p className="text-sm text-muted-foreground mt-1">Access your optical store dashboard.</p>
                        </div>
                        <LoginForm {...f} onSubmit={f.handleLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
}
