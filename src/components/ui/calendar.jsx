"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row gap-4 relative",
                month: "space-y-4",
                month_caption: "flex justify-center pt-1 items-center h-10",
                caption_label: "text-base font-semibold",
                nav: "flex items-center justify-center gap-36 absolute inset-x-0 top-0 h-10",
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-transparent p-0 opacity-100 hover:bg-accent rounded-lg text-muted-foreground border-muted-foreground/20"
                ),
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-transparent p-0 opacity-100 hover:bg-accent rounded-lg text-muted-foreground border-muted-foreground/20"
                ),
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex justify-between",
                weekday: "text-muted-foreground w-9 font-normal text-[0.85rem]",
                week: "flex w-full mt-2 justify-between",
                day: "h-9 w-9 text-center text-sm p-0 relative",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal rounded-xl"
                ),
                selected: "bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-semibold rounded-xl [&_button]:bg-accent [&_button]:text-accent-foreground [&_button]:rounded-xl",
                today: "bg-accent/50 text-accent-foreground rounded-xl [&_button]:rounded-xl",
                outside: "text-muted-foreground opacity-50",
                disabled: "text-muted-foreground opacity-50",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
