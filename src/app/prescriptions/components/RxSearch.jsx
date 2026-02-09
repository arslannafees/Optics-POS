"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export function RxSearch({
    searchQuery, setSearchQuery, selectedCustomer, setSelectedCustomerId,
    customers, customerOpen, setCustomerOpen, searchRef
}) {
    const filtered = customers.filter(c =>
        `${c.firstName} ${c.lastName || ''} ${c.mobile}`.toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex items-center gap-3 relative" ref={searchRef}>
            <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search patient..."
                    className="pl-10 h-11 border-primary/20 bg-primary/[0.02]"
                    value={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName || ''}`.trim() : searchQuery}
                    onChange={e => { if (selectedCustomer) setSelectedCustomerId(""); setSearchQuery(e.target.value); setCustomerOpen(true); }}
                    onFocus={() => setCustomerOpen(true)}
                />
                {(selectedCustomer || searchQuery) && (
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={() => { setSelectedCustomerId(""); setSearchQuery(""); }}>
                        <span className="text-lg">&times;</span>
                    </Button>
                )}
            </div>
            {customerOpen && (
                <div className="absolute top-full right-0 mt-2 w-[320px] max-h-[400px] overflow-auto bg-background border rounded-xl shadow-2xl z-50">
                    <Command><CommandList><CommandEmpty>No patient found.</CommandEmpty>
                        <CommandGroup heading="Patients">
                            {filtered.map(c => (
                                <CommandItem key={c.id} onSelect={() => { setSelectedCustomerId(c.id.toString()); setCustomerOpen(false); setSearchQuery(""); }} className="py-3 px-4 flex items-center gap-3 cursor-pointer">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">{c.firstName.charAt(0)}</div>
                                    <div className="flex flex-col"><span className="font-medium text-sm">{c.firstName} {c.lastName}</span><span className="text-[10px] text-muted-foreground">{c.mobile}</span></div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList></Command>
                </div>
            )}
        </div>
    );
}
