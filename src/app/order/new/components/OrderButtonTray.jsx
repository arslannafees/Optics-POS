"use client";

import React from "react";
import { Glasses, Eye, Sparkles, Stethoscope, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ContactLensIcon from "@/components/ContactLensIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const ICONS = { frame: <Glasses className="h-3.5 w-3.5" />, lens: <Eye className="h-3.5 w-3.5" />, "contact-lens": <ContactLensIcon className="h-3.5 w-3.5" />, accessory: <Sparkles className="h-3.5 w-3.5" />, "eye-checkup": <Stethoscope className="h-3.5 w-3.5" /> };
const LABELS = { frame: "Frame", lens: "Spectical-lens", "contact-lens": "Contact-Lens", accessory: "Accessory", "eye-checkup": "Checkup" };

export function OrderButtonTray({ buttons, dragged, customize, onAdd, onToggle, onDrag }) {
    const { config, setConfig } = buttons;
    const { isCustomizing, setIsCustomizing } = customize;
    const { onDragStart, onDragEnd, onDragOver, onDropToHeader, onDropToDropdown } = onDrag;

    return (
        <div className={cn("flex flex-wrap gap-2 items-center justify-end min-h-[40px] px-2 rounded-lg max-w-[580px]")} onDragOver={onDragOver} onDrop={onDropToHeader}>
            {config.visible.length === 0 && !dragged && <span className="text-[10px] text-muted-foreground italic px-2">Drag here to show buttons</span>}
            {config.visible.map(type => (
                <OrderActionButton key={type} type={type} isCustomizing={isCustomizing} onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={() => onAdd(type)} />
            ))}
            <HiddenButtonsDropdown buttons={buttons} customize={customize} onAdd={onAdd} onDrag={onDrag} />
        </div>
    );
}

function OrderActionButton({ type, isCustomizing, onDragStart, onDragEnd, onClick }) {
    return (
        <Button type="button" variant="outline" size="sm" draggable={isCustomizing} onDragStart={e => isCustomizing && onDragStart(e, type)} onDragEnd={onDragEnd} onClick={onClick} className={cn("gap-1.5 h-8 px-3", isCustomizing ? "cursor-grab border-primary/40 bg-primary/5" : "cursor-default")}>
            {ICONS[type]} <span className="hidden sm:inline">Add</span> {LABELS[type]}
        </Button>
    );
}

function HiddenButtonsDropdown({ buttons, customize, onAdd, onDrag }) {
    const [open, setOpen] = React.useState(false);
    return (
        <div onDragOver={onDrag.onDragOver} onDrop={onDrag.onDropToDropdown} className={cn("relative inline-block transition-all", buttons.dragged && buttons.config.visible.includes(buttons.dragged) && "scale-110")}>
            <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8 px-2"><ChevronDown className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem onClick={() => customize.setIsCustomizing(!customize.isCustomizing)} className="flex justify-between gap-2">
                        <div className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5" /> <span>Mode: {customize.isCustomizing ? "Done" : "Edit"}</span></div>
                    </DropdownMenuItem>
                    <Separator className="my-1" />
                    {buttons.config.hidden.map(type => (
                        <DropdownMenuItem key={type} draggable={customize.isCustomizing} onDragStart={e => customize.isCustomizing && onDrag.onDragStart(e, type)} onClick={() => !customize.isCustomizing && onAdd(type)} className="gap-2">
                            {ICONS[type] || <Sparkles className="h-3.5 w-3.5" />}
                            {LABELS[type] || type}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
