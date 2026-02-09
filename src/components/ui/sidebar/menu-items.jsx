"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export function SidebarMenu({ className, ...p }) {
    return <ul data-slot="sidebar-menu" data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...p} />
}

export function SidebarMenuItem({ className, ...p }) {
    return <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...p} />
}

export function SidebarMenuBadge({ className, ...p }) {
    return (
        <div
            data-slot="sidebar-menu-badge" data-sidebar="menu-badge"
            className={cn(
                "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
                "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
                "peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5",
                "group-data-[collapsible=icon]:hidden", className
            )}
            {...p} />
    )
}
