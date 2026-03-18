"use client";

import React, { useEffect, useState } from "react";

/**
 * LoginHeader: Renders the branding logo and app description.
 */
export function LoginHeader() {
    const [businessName, setBusinessName] = useState("Optics");

    useEffect(() => {
        fetch("/api/public/settings")
            .then(res => res.json())
            .then(data => {
                if (data && data.businessName) {
                    setBusinessName(data.businessName);
                }
            })
            .catch(err => console.error("Error fetching branding:", err));
    }, []);

    return (
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">{businessName}</h1>
            <p className="text-sm text-muted-foreground mt-2">A professional store management solution for optical retailers.</p>
        </div>
    );
}
