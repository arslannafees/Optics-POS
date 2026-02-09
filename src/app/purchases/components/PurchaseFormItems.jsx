"use client";

import React from "react";
import { Plus, ChevronDown, Trash2, Glasses, Eye, Sparkles } from "lucide-react";
import ContactLensIcon from "@/components/ContactLensIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export const PurchaseFormItems = ({ items, setFormData, addRow, removeRow, meta, currency, onQuickAdd }) => (
    <div className="col-span-2 space-y-4 border-t pt-6 mt-2">
        <div className="flex items-center justify-between">
            <Label className="text-lg font-bold">Purchase Items</Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2" type="button">
                        <Plus className="size-4" /> Add Item <ChevronDown className="size-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => addRow("frame")} className="gap-2">
                        <Glasses className="size-4" /> Frame
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addRow("lens")} className="gap-2">
                        <Eye className="size-4" /> Spectacle-Lens
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addRow("contact-lens")} className="gap-2">
                        <ContactLensIcon className="size-4" /> Contact-Lens
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addRow("accessory")} className="gap-2">
                        <Sparkles className="size-4" /> Accessory
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="space-y-3">
            {items.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                    <p className="mt-2">No items added yet. Click "Add Item" to begin.</p>
                </div>
            ) : (
                items.map(i => <ItemRow key={i.id} item={i} meta={meta} currency={currency} onRemove={() => removeRow(i.id)} onChange={(f, v) => setFormData(p => ({ ...p, items: p.items.map(it => it.id === i.id ? { ...it, [f]: v } : it) }))} onQuickAdd={onQuickAdd} />)
            )}
        </div>
    </div>
);

const ItemRow = ({ item, meta, currency, onRemove, onChange, onQuickAdd }) => {
    const [open, setOpen] = React.useState(false);
    const source = item.type === "frame" ? meta.f : item.type === "lens" ? meta.l : item.type === "contact-lens" ? meta.cl : meta.a;
    return (
        <div className="flex gap-2 items-center border p-2 rounded bg-muted/20">
            <div className="flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-9 text-xs" type="button">
                            {item.name || `Select ${item.type}`}
                            <ChevronDown className="size-3 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-64">
                        <Command>
                            <CommandInput />
                            <CommandList>
                                <CommandEmpty>None</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem className="font-bold text-primary" onSelect={() => { onQuickAdd(item.id, item.type); setOpen(false); }}>
                                        + Quick Add {item.type}
                                    </CommandItem>
                                </CommandGroup>
                                <CommandGroup>
                                    {source.map(s => (
                                        <CommandItem
                                            key={s.id}
                                            value={s.name || s.model}
                                            onSelect={() => {
                                                onChange("itemId", s.id.toString());
                                                onChange("name", s.name || s.model);
                                                onChange("cost", s.cost || s.price);
                                                setOpen(false);
                                            }}
                                        >
                                            {s.name || s.model}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <Input type="number" className="w-20 h-9" value={item.cost} onChange={e => onChange("cost", e.target.value)} placeholder="Cost" />
            <Input type="number" className="w-16 h-9" value={item.quantity} onChange={e => onChange("quantity", e.target.value)} placeholder="Qty" />
            <Button variant="ghost" size="icon" className="text-destructive h-9 w-9" onClick={onRemove} type="button"><Trash2 className="size-3" /></Button>
        </div>
    );
};
