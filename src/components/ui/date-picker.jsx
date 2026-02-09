"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = React.forwardRef(({ className, value, onChange, placeholder, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const date = value ? new Date(value) : null;

    const handleSelect = (selectedDate) => {
        if (onChange) {
            const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
            onChange({ target: { value: formattedDate } });
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{placeholder || "Pick a date"}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom" avoidCollisions={false}>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
});

DatePicker.displayName = "DatePicker";

export { DatePicker };
