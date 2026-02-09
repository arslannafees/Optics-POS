"use client";

import React from "react";
import { AlertCircle, Bell, Info, ShieldAlert } from "lucide-react";

const AlertsMarquee = ({ alerts }) => {
    if (!alerts || alerts.length === 0) return null;

    // Duplicate alerts to ensure smooth looping
    const displayAlerts = [...alerts, ...alerts];

    const getAlertIcon = (text) => {
        if (text.includes("ALERT") || text.includes("out of stock")) return <ShieldAlert className="h-4 w-4 text-destructive" />;
        if (text.includes("Low Stock")) return <Bell className="h-4 w-4 text-orange-500" />;
        if (text.includes("Outstanding") || text.includes("pending")) return <AlertCircle className="h-4 w-4 text-primary" />;
        return <Info className="h-4 w-4 text-muted-foreground" />;
    };

    return (
        <div className="relative w-full overflow-hidden bg-muted/30 border-y border-border/50 py-2.5 glass shadow-sm opacity-0 animate-fade-in">
            <div className="flex animate-marquee">
                {displayAlerts.map((alert, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2.5 mx-8 shrink-0 group"
                    >
                        {getAlertIcon(alert)}
                        <span className="text-sm font-medium tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
                            {alert}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-border mx-2" />
                    </div>
                ))}
            </div>

            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </div>
    );
};

export default AlertsMarquee;
