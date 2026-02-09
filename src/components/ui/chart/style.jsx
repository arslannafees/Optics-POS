"use client";

import * as React from "react"

export const THEMES = { light: "", dark: ".dark" }

export function ChartStyle({ id, config }) {
    const colorConfig = Object.entries(config).filter(([, it]) => it.theme || it.color)
    if (!colorConfig.length) return null;

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                            .map(([key, item]) => {
                                const color = item.theme?.[theme] || item.color
                                return color ? `  --color-${key}: ${color};` : null
                            })
                            .join("\n")}
}
`)
                    .join("\n"),
            }} />
    )
}
