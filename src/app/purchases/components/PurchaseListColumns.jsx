"use client";

import React from "react";
import { FileText, Building2, Eye, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const getPurchaseColumns = (settings, actions) => [
    {
        accessorKey: "invoiceNumber", header: "Invoice #", cell: ({ row }) => (
            <div className="flex items-center gap-2 font-medium">
                <FileText className="size-4 text-muted-foreground" />
                {row.getValue("invoiceNumber") || `PO-${String(row.original.localId || row.original.id).padStart(4, "0")}`}
            </div>
        )
    },
    {
        accessorKey: "vendorName", header: "Vendor", cell: ({ row }) => (
            <div className="flex items-center gap-2"><Building2 className="size-4 text-muted-foreground" />{row.getValue("vendorName") || "-"}</div>
        )
    },
    { accessorKey: "date", header: "Date", cell: ({ row }) => formatDate(row.getValue("date"), settings?.dateFormat) || "-" },
    { accessorKey: "total", header: "Total", cell: ({ row }) => <span className="font-bold">{settings.currency} {parseFloat(row.getValue("total")).toLocaleString()}</span> },
    {
        accessorKey: "balance", header: "Balance", cell: ({ row }) => (
            <span className={row.getValue("balance") > 0 ? "text-destructive font-bold" : "text-green-600 font-bold"}>
                {settings.currency} {parseFloat(row.getValue("balance")).toLocaleString()}
            </span>
        )
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline">{row.getValue("status") || "Pending"}</Badge> },
    {
        id: "actions", header: "Actions", cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => actions.view(row.original)}><Eye className="size-4" /></Button>
                {row.original.balance > 0 && <Button variant="ghost" size="icon" onClick={() => actions.setSelected(row.original) || actions.setPayOpen(true)}><DollarSign className="size-4 text-green-600" /></Button>}
                <Button variant="ghost" size="icon" onClick={() => actions.setSelected(row.original) || actions.setDelOpen(true)}><Trash2 className="size-4 text-destructive" /></Button>
            </div>
        )
    },
];
