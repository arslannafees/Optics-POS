"use client";

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
import { useChart } from "./context"
import { getPayloadConfigFromPayload } from "./utils"
import { ChartTooltipIndicator, ChartTooltipLabel } from "./tooltip-parts"

export const ChartTooltip = RechartsPrimitive.Tooltip

export function ChartTooltipContent({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }) {
    const { config } = useChart()
    if (!active || !payload?.length) return null;
    const nest = payload.length === 1 && indicator !== "dot"

    return (
        <div className={cn("border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl", className)}>
            {!nest && <ChartTooltipLabel config={config} payload={payload} label={label} hideLabel={hideLabel} labelKey={labelKey} labelFormatter={labelFormatter} labelClassName={labelClassName} />}
            <div className="grid gap-1.5">
                {payload.filter(i => i.type !== "none").map((it, idx) => {
                    const cfg = getPayloadConfigFromPayload(config, it, `${nameKey || it.name || it.dataKey || "value"}`)
                    const iCol = color || it.payload.fill || it.color
                    return (
                        <div key={it.dataKey} className={cn("[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5", indicator === "dot" && "items-center")}>
                            {formatter && it.value !== undefined && it.name ? formatter(it.value, it.name, it, idx, it.payload) : (
                                <><div className={cn("flex flex-1 justify-between leading-none", nest ? "items-end" : "items-center")}>
                                    <div className="grid gap-1.5"> {nest && <ChartTooltipLabel config={config} payload={payload} label={label} hideLabel={hideLabel} labelKey={labelKey} labelFormatter={labelFormatter} labelClassName={labelClassName} />} <span className="text-muted-foreground">{cfg?.label || it.name}</span></div>
                                    {it.value && <span className="text-foreground font-mono font-medium tabular-nums">{it.value.toLocaleString()}</span>}
                                </div>{!hideIndicator && (cfg?.icon ? <cfg.icon /> : <ChartTooltipIndicator indicator={indicator} color={iCol} nestLabel={nest} />)}</>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
