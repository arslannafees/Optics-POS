"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export function SidebarHeader({ className, ...p }) {
    return <div data-slot="sidebar-header" data-sidebar="header" className={cn("flex flex-col gap-2 p-2", className)} {...p} />
}

export function SidebarFooter({ className, ...p }) {
    return <div data-slot="sidebar-footer" data-sidebar="footer" className={cn("flex flex-col gap-2 p-2", className)} {...p} />
}

export function SidebarContent({ className, ...p }) {
    return <div data-slot="sidebar-content" data-sidebar="content" className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)} {...p} />
}

export function SidebarSeparator({ className, ...p }) {
    return <Separator data-slot="sidebar-separator" data-sidebar="separator" className={cn("bg-sidebar-border mx-2 w-auto", className)} {...p} />
}

export function SidebarInput({ className, ...p }) {
    return <Input data-slot="sidebar-input" data-sidebar="input" className={cn("bg-background h-8 w-full shadow-none", className)} {...p} />
}
