"use client";

import React from "react";
import { Activity, ScrollText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActivityLogsAlert({ count, onClear }) {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    // Only show if user is admin
    if (count <= 0 || (user && user.role !== 'admin')) return null;
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full shrink-0">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-300">New Activity Detected</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                        <span className="font-bold">{count}</span> new actions were performed while you were away.
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800" onClick={() => { localStorage.setItem('lastLogCheck', Date.now().toString()); window.location.href = '/logs'; }}>
                    <ScrollText className="mr-2 h-4 w-4" /> View Logs
                </Button>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-100/50" onClick={onClear}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
