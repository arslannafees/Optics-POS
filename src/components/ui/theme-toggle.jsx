"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onKeyDown={(e) => e.key === "Enter" && setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex w-16 h-8 p-1 rounded-full cursor-pointer select-none",
        "transition-colors duration-300 ease-in-out",
        isDark
          ? "bg-zinc-900 border border-zinc-700"
          : "bg-zinc-100 border border-zinc-300",
        className
      )}
    >
      {/* Track icons — always visible */}
      <Sun
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-opacity duration-300",
          isDark ? "opacity-30 text-zinc-400" : "opacity-0"
        )}
        strokeWidth={1.5}
      />
      <Moon
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-opacity duration-300",
          isDark ? "opacity-0" : "opacity-30 text-zinc-500"
        )}
        strokeWidth={1.5}
      />

      {/* Sliding knob */}
      <div
        className={cn(
          "absolute top-1 w-6 h-6 rounded-full flex items-center justify-center",
          "shadow-sm transition-all duration-300 ease-in-out",
          isDark
            ? "translate-x-8 bg-zinc-700"
            : "translate-x-0 bg-white"
        )}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-zinc-100" strokeWidth={1.5} />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.5} />
        )}
      </div>
    </div>
  )
}
