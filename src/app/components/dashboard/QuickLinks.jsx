"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Users, Package, ArrowUpRight, ArrowRight } from "lucide-react";

export function QuickLinks() {
    const links = [
        { href: "/order/new", label: "New Order", icon: ShoppingCart },
        { href: "/customer", label: "Customers", icon: Users },
        { href: "/frame", label: "Frames", icon: Package },
        { href: "/analytics", label: "Analytics", icon: ArrowUpRight },
    ];

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((item, index) => (
                <Link key={item.href} href={item.href} className="group flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-accent hover:shadow-sm transition-all duration-300 opacity-0 animate-slide-up [animation-fill-mode:forwards]" style={{ animationDelay: `${400 + index * 50}ms` }}>
                    <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                </Link>
            ))}
        </div>
    );
}
