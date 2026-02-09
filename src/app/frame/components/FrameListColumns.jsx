"use client";

import React from "react";
import { MoreHorizontal, Pencil, Trash2, Glasses } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const getFrameColumns = (currency, actions) => [
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => <div className="flex items-center gap-2 font-medium"><Glasses className="h-4 w-4" />{row.original.brand}</div>
    },
    { accessorKey: "model", header: "Model" },
    { accessorKey: "size", header: "Size", cell: ({ row }) => <Badge variant="outline">{row.original.size || "-"}</Badge> },
    { accessorKey: "color", header: "Color" },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span className="font-medium">{currency} {parseFloat(row.original.price || 0).toLocaleString()}</span>
    },
    { accessorKey: "stock", header: "Stock", cell: ({ row }) => <Badge variant="outline">{row.original.stock} pcs</Badge> },
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => <Switch checked={row.original.active} onCheckedChange={() => actions.onToggle(row.original)} />
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => actions.onEdit(row.original)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => actions.onDelete(row.original)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
];
