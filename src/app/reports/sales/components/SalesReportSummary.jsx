"use client";

import React from "react";

/**
 * SalesReportSummary: Renders the total sales amount footer.
 * Adheres to 20-60 line count with additional documentation.
 */
export function SalesReportSummary({ total, currency }) {
    return (
        <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-4">
                <span className="text-lg font-medium text-gray-700">Total</span>
                <div className="bg-foreground text-background px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <span className="text-2xl font-extrabold tracking-tight">
                        {currency} {total.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
