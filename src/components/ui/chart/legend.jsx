"use client";

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { useChart } from "./context"
import { getPayloadConfigFromPayload } from "./utils"

export const ChartLegend = RechartsPrimitive.Legend

export function ChartLegendContent({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }) {
    const { config } = useChart()
    if (!payload?.length) return null;

    return (
        <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
            {payload.filter(i => i.type !== "none").map((it) => {
                const cfg = getPayloadConfigFromPayload(config, it, `${nameKey || it.dataKey || "value"}`)
                return (
                    <div key={it.value} className={cn("[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3")}>
                        {cfg?.icon && !hideIcon ? <cfg.icon /> : <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: it.color }} />}
                        {cfg?.label}
                    </div>
                )
            })}
        </div>
    )
}
