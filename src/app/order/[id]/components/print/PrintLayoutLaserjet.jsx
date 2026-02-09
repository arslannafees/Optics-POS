"use client";

import React from "react";
import { LaserjetHeader } from "./LaserjetHeader";
import { LaserjetInfoBar } from "./LaserjetInfoBar";
import { LaserjetItemsTable } from "./LaserjetItemsTable";

import { LaserjetFooter } from "./LaserjetFooter";

export function PrintLayoutLaserjet({ order, settings, isPreview = false }) {
    if (!order) return null;
    const items = order.items || [];

    // Pagination logic
    const calculateChunks = (allLines) => {
        const chunks = [];
        let currentLines = [...allLines];
        let pIndex = 0;
        const P1_WITH_FOOTER = 9;
        const P1_NO_FOOTER = 11;
        const PX_WITH_FOOTER = 14;
        const PX_NO_FOOTER = 20;

        if (currentLines.length === 0) return [[]];
        while (currentLines.length > 0) {
            const isFirst = pIndex === 0;
            const limitLast = isFirst ? P1_WITH_FOOTER : PX_WITH_FOOTER;
            const limitNotLast = isFirst ? P1_NO_FOOTER : PX_NO_FOOTER;
            const remaining = currentLines.length;
            let count;
            if (remaining <= limitLast) { count = remaining; }
            else { count = remaining <= limitNotLast ? remaining - 1 : limitNotLast; }
            chunks.push(currentLines.slice(0, count));
            currentLines = currentLines.slice(count);
            pIndex++;
        }
        return chunks;
    };

    const chunks = calculateChunks(items);

    const totals = {
        qty: items.reduce((s, i) => s + (Number(i.quantity) || 0), 0),
        rate: items.reduce((s, i) => s + (Number(i.price) || 0), 0),
        amount: order.subtotal || items.reduce((s, i) => s + (Number(i.total) || 0), 0)
    };

    return (
        <div className={isPreview ? "fixed top-0 left-0 z-[9999] h-screen w-screen bg-slate-500/50 overflow-auto flex flex-col items-center p-8 backdrop-blur-sm" : "hidden print:block"}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print { 
                    @page { size: A4; margin: 0; } 
                    body { margin: 0; padding: 0 !important; }
                    .main-page { height: 297mm !important; padding: 40px; position: relative !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; }
                    .main-page:not(:last-child) { page-break-after: always; }
                    .main-page:last-child { page-break-after: avoid; }
                }
                .main-page { height: 297mm; width: 210mm; padding: 40px 40px 60px 40px; background: white; display: flex; flex-direction: column; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            ` }} />

            {chunks.map((pItems, i) => {
                const isFirstPage = i === 0;
                const isLastPage = i === chunks.length - 1;

                return (
                    <div key={i} className="main-page relative">
                        {isFirstPage && (
                            <>
                                <LaserjetHeader settings={settings} order={order} />
                                <LaserjetInfoBar order={order} settings={settings} />
                            </>
                        )}

                        <div className={!isFirstPage ? 'mt-8' : ''}>
                            <LaserjetItemsTable items={pItems} isLastPage={isLastPage} totals={totals} />
                        </div>

                        {isLastPage && (
                            <>
                                { /* Removed Clinical Prescription as per request */}
                                <div className="mt-8">
                                    <LaserjetFooter order={order} settings={settings} />
                                </div>
                            </>
                        )}

                        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400">
                            Page {i + 1} of {chunks.length}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
