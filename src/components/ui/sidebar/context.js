"use client";

import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) throw new Error("useSidebar must be used within a SidebarProvider.")
    return context
}

export function SidebarProvider({ defaultOpen = true, open: oProp, onOpenChange: setOProp, className, style, children, ...props }) {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = oProp ?? _open

    const setOpen = React.useCallback((val) => {
        const next = typeof val === "function" ? val(open) : val
        if (setOProp) setOProp(next); else _setOpen(next);
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }, [setOProp, open])

    const toggle = React.useCallback(() => isMobile ? setOpenMobile(v => !v) : setOpen(v => !v), [isMobile, setOpen])

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) { e.preventDefault(); toggle(); }
        }
        window.addEventListener("keydown", down); return () => window.removeEventListener("keydown", down)
    }, [toggle])

    const state = open ? "expanded" : "collapsed"
    const val = React.useMemo(() => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar: toggle }), [state, open, setOpen, isMobile, openMobile, toggle])

    return (
        <SidebarContext.Provider value={val}>
            <TooltipProvider delayDuration={0}>
                <div style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style }} className={cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)} {...props}>
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    )
}

export { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SIDEBAR_WIDTH_MOBILE } from "./constants";
