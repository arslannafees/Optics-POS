"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, AlertTriangle, Info, Package, DollarSign, Glasses, Eye, Sparkles, CreditCard, ShoppingCart, Flag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ContactLensIcon from "@/components/ContactLensIcon";

export function NotificationTray({ alerts, lowStockItems, pendingPayments, flaggedFabJobs = [], currency, onDismissAll }) {
    const filteredAlerts = alerts.filter(a => !a.includes('🔔 Low Stock:') && !a.includes('💰 Outstanding:'));
    const hasNotifications = filteredAlerts.length > 0 || lowStockItems.length > 0 || pendingPayments.length > 0 || flaggedFabJobs.length > 0;

    const [isDismissing, setIsDismissing] = useState(false);
    const [dismissedItems, setDismissedItems] = useState(new Set());
    const [showCaughtUp, setShowCaughtUp] = useState(false);

    const totalItems = filteredAlerts.length + pendingPayments.length + lowStockItems.length + flaggedFabJobs.length;
    const allItems = [
        ...filteredAlerts.map((_, i) => `alert-${i}`),
        ...pendingPayments.map((_, i) => `payment-${i}`),
        ...lowStockItems.map((_, i) => `item-${i}`),
        ...flaggedFabJobs.map((_, i) => `fab-${i}`),
    ];

    const handleDismissAll = useCallback(() => {
        if (isDismissing || !hasNotifications) return;
        setIsDismissing(true);

        const reversedItems = [...allItems].reverse();

        reversedItems.forEach((itemKey, index) => {
            setTimeout(() => {
                setDismissedItems(prev => new Set([...prev, itemKey]));
            }, index * 150);
        });

        setTimeout(() => {
            setShowCaughtUp(true);
            setTimeout(() => {
                onDismissAll?.();
                setIsDismissing(false);
                setDismissedItems(new Set());
                setShowCaughtUp(false);
            }, 600);
        }, reversedItems.length * 150 + 300);
    }, [isDismissing, hasNotifications, allItems, onDismissAll]);

    useEffect(() => {
        if (!hasNotifications) {
            setDismissedItems(new Set());
            setShowCaughtUp(false);
        }
    }, [hasNotifications]);

    const getItemIcon = (type) => {
        switch (type) {
            case 'Frame': return <Glasses className="h-4 w-4" />;
            case 'Spectacle Lens': return <Eye className="h-4 w-4" />;
            case 'Contact Lens': return <ContactLensIcon className="h-4 w-4" />;
            case 'Accessory': return <Sparkles className="h-4 w-4" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    const getAlertIcon = (alert) => {
        if (alert.includes('Frames')) return <Glasses className="h-4 w-4" />;
        if (alert.includes('Spectacle Lenses')) return <Eye className="h-4 w-4" />;
        if (alert.includes('Contact Lenses')) return <ContactLensIcon className="h-4 w-4" />;
        if (alert.includes('Accessories')) return <Sparkles className="h-4 w-4" />;
        return <AlertTriangle className="h-4 w-4" />;
    };

    return (
        <div
            style={{ width: '320px', minWidth: '320px', maxWidth: '320px' }}
            className="flex flex-col max-h-[700px] bg-card border shadow-xl rounded-2xl overflow-hidden"
        >
            <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-sm tracking-tight">Notifications</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                    {filteredAlerts.length + lowStockItems.length + pendingPayments.length + flaggedFabJobs.length} Total
                </span>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                    {/* Critical General Alerts (Out of Stock) */}
                    {filteredAlerts.map((alert, i) => {
                        const isAlert = alert.includes('⚠️ ALERT');
                        const itemKey = `alert-${i}`;
                        const isItemDismissed = dismissedItems.has(itemKey);

                        return (
                            <Link
                                key={itemKey}
                                href="/stock-in-hand"
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 group cursor-pointer"
                                style={{
                                    opacity: isItemDismissed ? 0 : 1,
                                    transform: isItemDismissed ? 'translateX(-100%)' : 'translateX(0)',
                                    maxHeight: isItemDismissed ? '0px' : '100px',
                                    padding: isItemDismissed ? '0 16px' : undefined,
                                    margin: isItemDismissed ? '0' : undefined,
                                    overflow: 'hidden',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    pointerEvents: isDismissing ? 'none' : 'auto'
                                }}
                            >
                                <div className={`mt-1 p-2 rounded-full shadow-sm transition-transform group-hover:scale-110 ${isAlert ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {getAlertIcon(alert)}
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <p className="text-xs leading-tight font-semibold text-foreground/90">
                                        {alert.replace('⚠️ ALERT: ', '').replace('🔔 Low Stock: ', '')}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/70 font-medium">
                                        {isAlert ? 'Action required immediately' : 'Inventory update'}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Pending Payments Section */}
                    {pendingPayments.length > 0 && (
                        <>
                            <div className="mx-2 px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-amber-500/5 text-amber-600 rounded-lg my-3 border border-amber-500/10">
                                Pending Payments
                            </div>
                            {pendingPayments.map((order, i) => {
                                const itemKey = `payment-${i}`;
                                const isItemDismissed = dismissedItems.has(itemKey);
                                return (
                                    <Link
                                        key={itemKey}
                                        href={`/order/${order.id}`}
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 group cursor-pointer"
                                        style={{
                                            opacity: isItemDismissed ? 0 : 1,
                                            transform: isItemDismissed ? 'translateX(-100%)' : 'translateX(0)',
                                            maxHeight: isItemDismissed ? '0px' : '100px',
                                            padding: isItemDismissed ? '0 16px' : undefined,
                                            margin: isItemDismissed ? '0' : undefined,
                                            overflow: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            pointerEvents: isDismissing ? 'none' : 'auto'
                                        }}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                                                <CreditCard className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold truncate text-foreground/90">{order.customerName}</p>
                                                <p className="text-[10px] text-muted-foreground/70 font-medium">Order #{order.localId || order.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-amber-600">{currency} {order.balance.toLocaleString()}</p>
                                            <p className="text-[10px] text-muted-foreground/50">Balance</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </>
                    )}

                    {/* Flagged Lens Fabrication Jobs */}
                    {flaggedFabJobs.length > 0 && (
                        <>
                            <div className="mx-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-red-500/5 text-red-600 rounded-lg my-3 border border-red-500/10">
                                Lens Lab Issues
                            </div>
                            {flaggedFabJobs.map((job, i) => {
                                const itemKey = `fab-${i}`;
                                const isItemDismissed = dismissedItems.has(itemKey);
                                return (
                                    <Link
                                        key={itemKey}
                                        href={`/order/${job.orderId}`}
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 group cursor-pointer"
                                        style={{
                                            opacity: isItemDismissed ? 0 : 1,
                                            transform: isItemDismissed ? 'translateX(-100%)' : 'translateX(0)',
                                            maxHeight: isItemDismissed ? '0px' : '100px',
                                            padding: isItemDismissed ? '0 16px' : undefined,
                                            margin: isItemDismissed ? '0' : undefined,
                                            overflow: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            pointerEvents: isDismissing ? 'none' : 'auto'
                                        }}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="p-2 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors shrink-0">
                                                <Flag className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold truncate text-foreground/90">
                                                    {job.patientName || 'Unknown Patient'}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/70 font-medium truncate">
                                                    Order #{String(job.orderLocalId || job.orderId).padStart(4, '0')} — {job.flagReason || 'Issue flagged by fabricator'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 whitespace-nowrap ml-2 shrink-0">
                                            Flagged
                                        </span>
                                    </Link>
                                );
                            })}
                        </>
                    )}

                    {/* Detailed Low Stock Items */}
                    {lowStockItems.length > 0 && (
                        <>
                            <div className="mx-2 px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/40 rounded-lg my-3 border border-border/10">
                                Low Stock Items
                            </div>
                            {lowStockItems.map((item, i) => {
                                const itemKey = `item-${i}`;
                                const isItemDismissed = dismissedItems.has(itemKey);
                                return (
                                    <Link
                                        key={itemKey}
                                        href="/stock-in-hand"
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 group cursor-pointer"
                                        style={{
                                            opacity: isItemDismissed ? 0 : 1,
                                            transform: isItemDismissed ? 'translateX(-100%)' : 'translateX(0)',
                                            maxHeight: isItemDismissed ? '0px' : '100px',
                                            padding: isItemDismissed ? '0 16px' : undefined,
                                            margin: isItemDismissed ? '0' : undefined,
                                            overflow: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            pointerEvents: isDismissing ? 'none' : 'auto'
                                        }}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {getItemIcon(item.type)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold truncate text-foreground/90">{item.name}</p>
                                                <p className="text-[10px] text-muted-foreground/70 font-medium">{item.type}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap backdrop-blur-sm uppercase tracking-tight">
                                            {item.stock} left
                                        </span>
                                    </Link>
                                );
                            })}
                        </>
                    )}

                    {(!hasNotifications || showCaughtUp) && (
                        <div
                            className="py-12 text-center"
                            style={{
                                opacity: showCaughtUp ? 1 : (!hasNotifications ? 1 : 0),
                                transform: showCaughtUp ? 'scale(1)' : (!hasNotifications ? 'scale(1)' : 'scale(0.9)'),
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted mb-3">
                                <Bell className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">No pending alerts at the moment.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {hasNotifications && (
                <div className="p-3 border-t bg-muted/20 text-center">
                    <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-[10px] text-muted-foreground hover:text-foreground"
                        onClick={handleDismissAll}
                        disabled={isDismissing}
                    >
                        {isDismissing ? 'Dismissing...' : 'Dismiss All Notifications'}
                    </Button>
                </div>
            )}
        </div>
    );
}
