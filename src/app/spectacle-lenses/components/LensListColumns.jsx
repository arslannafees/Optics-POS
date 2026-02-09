"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const getLensColumns = (currency, actions) => [
    { accessorKey: "name", header: "Name", cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div> },
    { accessorKey: "brand", header: "Brand" },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => row.getValue("type") && <Badge variant="secondary" className="capitalize">{row.getValue("type")}</Badge>
    },
    { accessorKey: "material", header: "Material" },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock");
            return <Badge variant={stock < 5 ? "destructive" : "default"}>{stock} pcs</Badge>;
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span className="font-medium">{currency} {row.getValue("price")?.toLocaleString()}</span>
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => actions.onEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => actions.onDelete(row.original)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
        )
    },
];
