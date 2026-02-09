"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ReceivableReportSearch({ query, setQuery, customers, selectedId, setSelectedId, onSearch }) {
    const [open, setOpen] = useState(false);
    const filtered = customers.filter(c => !query || c.searchValue.includes(query.toLowerCase()));

    return (
        <div className="bg-background mb-8">
            <div className="flex items-end gap-6 max-w-2xl">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search Customer <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <div className="relative cursor-pointer">
                                    <Input
                                        className="bg-white border-gray-200"
                                        placeholder="Enter customer name or mobile..."
                                        value={query}
                                        onChange={e => { setQuery(e.target.value); setSelectedId(null); setOpen(true); }}
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <Search className="size-4 text-gray-400" />
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <Command>
                                    <CommandList>
                                        <CommandEmpty>No customers found.</CommandEmpty>
                                        <CommandGroup>
                                            {filtered.map(c => (
                                                <CommandItem
                                                    key={c.id}
                                                    onSelect={() => { setQuery(c.name); setSelectedId(c.id); setOpen(false); }}
                                                    className="cursor-pointer hover:bg-gray-100"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm text-gray-900">{c.name}</span>
                                                        <span className="text-xs text-gray-500">{c.mobile}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Button onClick={onSearch} className="h-10 px-10 bg-black hover:bg-black/90 text-white font-medium rounded-md">
                    Search
                </Button>
            </div>
        </div>
    );
}
