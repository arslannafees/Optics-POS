"use client";

import React from "react";
import { CheckCircle2, Clock, Package, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OrderStatusBadge({ status }) {
    const config = {
        completed: { icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/20" },
        pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
        processing: { icon: Package, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        cancelled: { icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
    }[status] || { icon: Clock, color: "" };

    const Icon = config.icon;
    return (
        <Badge variant="outline" className={`font-normal ${config.color}`}>
            <Icon className="mr-1 h-3 w-3" />
            {(status || "pending").charAt(0).toUpperCase() + (status || "pending").slice(1)}
        </Badge>
    );
}
