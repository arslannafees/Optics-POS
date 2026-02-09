"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

export function CustomerPicker({ state, customers }) {
    const { formData, setFormData, customerOpen, setCustomerOpen, customerSearch, setCustomerSearch } = state;
    return (
        <div className="space-y-2">
            <Label>Select Customer *</Label>
            <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverAnchor asChild>
                    <div className="relative">
                        <Input placeholder="Search customer..." value={customerSearch} autoComplete="off"
                            onChange={(e) => { setCustomerSearch(e.target.value); if (!customerOpen) setCustomerOpen(true); }}
                            onFocus={() => { if (!customerOpen) setCustomerOpen(true); }}
                            className="w-full pr-10" />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                    </div>
                </PopoverAnchor>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={10} onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Command className="w-full">
                        <CommandList className="w-full">
                            <CommandEmpty className="text-sm text-center py-4">No customer found.</CommandEmpty>
                            <CommandGroup className="w-full">
                                {customers.filter(c => !customerSearch || c.searchValue.includes(customerSearch.toLowerCase())).map((c) => (
                                    <CommandItem key={c.id} value={c.searchValue} onSelect={() => {
                                        setFormData(prev => ({ ...prev, customerId: c.id.toString(), customerName: c.name }));
                                        setCustomerSearch(c.name); setCustomerOpen(false);
                                    }} className="w-full">
                                        <div className="flex flex-col w-full">
                                            <span className="font-medium text-sm">{c.name}</span>
                                            {(c.mobile || c.phone) && <span className="text-[10px] sm:text-xs text-muted-foreground">{c.mobile || c.phone}</span>}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
