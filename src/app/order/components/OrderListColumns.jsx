"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Package, XCircle, Calendar, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

export const getOrderColumns = (settings, actions) => [
    { accessorKey: "id", header: "Order #", cell: ({ row }) => <span className="font-mono text-sm">#{String(row.original.localId || row.original.id).padStart(4, "0")}</span> },
    {
        accessorKey: "customer", header: "Customer", cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary uppercase text-xs">{row.original.customer?.charAt(0)}</div>
                <span className="font-medium">{row.original.customer}</span>
            </div>
        )
    },
    { accessorKey: "orderType", header: "Type", cell: ({ row }) => <Badge variant="outline">{row.original.orderType || "Std"}</Badge> },
    { accessorKey: "date", header: "Date", cell: ({ row }) => <div className="text-sm flex items-center gap-1">{formatDate(row.original.date, settings.dateFormat)}</div> },
    { accessorKey: "total", header: "Total", cell: ({ row }) => <span className="font-semibold">{settings.currency} {row.original.total?.toLocaleString()}</span> },
    {
        accessorKey: "status", header: "Status", cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}><button className="outline-none"><StatusB s={row.original.status} /></button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); actions.onStatus(row.original.id, "pending"); }}><Clock className="mr-2 h-4 w-4" /> Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); actions.onStatus(row.original.id, "completed"); }}><CheckCircle2 className="mr-2 h-4 w-4" /> Completed</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
    {
        id: "actions", cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild onClick={e => e.stopPropagation()}><Link href={`/order/${row.original.id}`}><Eye className="mr-2 h-4 w-4" /> View</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); actions.onDelete(row.original); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
];

const StatusB = ({ s }) => {
    const i = { completed: CheckCircle2, pending: Clock, processing: Package, cancelled: XCircle }[s] || Clock;
    const Icon = i;
    return <Badge variant="outline" className="font-normal capitalize"><Icon className="mr-1 h-3 w-3" /> {s || "pending"}</Badge>;
};
