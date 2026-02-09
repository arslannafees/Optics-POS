"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export function ChartTooltipIndicator({ indicator, color, nestLabel }) {
    return (
        <div
            className={cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
                "h-2.5 w-2.5": indicator === "dot", "w-1": indicator === "line",
                "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                "my-0.5": nestLabel && indicator === "dashed",
            })}
            style={{ "--color-bg": color, "--color-border": color }} />
    )
}

export function ChartTooltipLabel({ config, payload, label, hideLabel, labelKey, labelFormatter, labelClassName }) {
    const value = React.useMemo(() => {
        if (hideLabel || !payload?.length) return null;
        const [item] = payload
        const key = `${labelKey || item?.dataKey || item?.name || "value"}`
        return !labelKey && typeof label === "string" ? config[label]?.label || label : config[key]?.label
    }, [label, payload, hideLabel, config, labelKey])

    if (labelFormatter) return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
    return value ? <div className={cn("font-medium", labelClassName)}>{value}</div> : null
}
