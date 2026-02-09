"use client";

import React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NameCell, PriceCell, CostCell } from "./column-cells";

export const getAccessoryColumns = ({ onEdit, onDelete, onToggleActive, currency, threshold }) => [
    { accessorKey: "name", header: "Name", cell: ({ row }) => <NameCell value={row.original.name} /> },
    { accessorKey: "accessory_type", header: "Type", cell: ({ row }) => row.original.accessory_type || "-" },
    { accessorKey: "brand", header: "Brand", cell: ({ row }) => row.original.brand || "-" },
    { accessorKey: "cost", header: "Cost", cell: ({ row }) => <CostCell currency={currency} value={row.original.cost} /> },
    { accessorKey: "price", header: "Price", cell: ({ row }) => <PriceCell currency={currency} value={row.original.price} /> },
    {
        accessorKey: "stock", header: "Stock",
        cell: ({ row }) => {
            const stock = parseInt(row.original.stock) || 0;
            return <Badge variant={stock <= threshold ? "destructive" : "outline"}>{stock} pcs</Badge>;
        },
    },
    { accessorKey: "active", header: "Status", cell: ({ row }) => <Switch checked={row.original.active} onCheckedChange={() => onToggleActive(row.original)} /> },
    {
        id: "actions", header: "Actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(row.original)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
