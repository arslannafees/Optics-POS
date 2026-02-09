"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const getContactLensColumns = (currency, lowStockThreshold, actions) => [
    { accessorKey: "name", header: "Lens Name", cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div> },
    { accessorKey: "brand", header: "Brand", cell: ({ row }) => row.getValue("brand") || "-" },
    { accessorKey: "type", header: "Type", cell: ({ row }) => row.getValue("type") || "-" },
    { accessorKey: "replacementSchedule", header: "Replacement", cell: ({ row }) => row.getValue("replacementSchedule") || "-" },
    { accessorKey: "expiryDate", header: "Expiry", cell: ({ row }) => row.getValue("expiryDate") || "-" },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span className="font-medium">{currency} {parseFloat(row.getValue("price") || 0).toLocaleString()}</span>
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock");
            const variant = stock === 0 ? "destructive" : (stock <= lowStockThreshold ? "secondary" : "default");
            return <Badge variant={variant}>{stock} pcs</Badge>;
        }
    },
    { accessorKey: "active", header: "Status", cell: ({ row }) => <Badge variant={row.getValue("active") ? "default" : "secondary"}>{row.getValue("active") ? "Active" : "Inactive"}</Badge> },
    {
        id: "actions", header: "Actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => actions.onEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => actions.onDelete(row.original)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
        )
    },
];
