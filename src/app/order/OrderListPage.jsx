"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";
import { useOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { OrderPageHeader, OrderStats, OrderDeleteDialog, getOrderColumns } from "./components";
import { WhatsAppPromptDialog } from "@/components/notifications/WhatsAppPromptDialog";

export default function OrderPage() {
    const { settings } = useSettings();
    const router = useRouter();
    const h = useOrders(); // h = hook

    const actions = {
        onStatus: h.handleStatusUpdate,
        onDelete: (o) => { h.setSelectedOrder(o); h.setDeleteDialogOpen(true); }
    };
    const columns = getOrderColumns(settings, actions);

    return (
        <div className="space-y-6">
            <OrderPageHeader onRefresh={h.loadOrders} isRefreshing={h.isLoading} />
            <OrderStats ordersCount={h.orders.length} stats={h.stats} currency={settings.currency} />

            <Card className="border shadow-none">
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                    <CardDescription>View and manage all customer prescriptions and purchases.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={h.orders}
                        isLoading={h.isLoading}
                        onRowClick={o => router.push(`/order/${o.id}`)}
                        searchPlaceholder="Search orders by customer or ID..."
                    />
                </CardContent>
            </Card>

            <OrderDeleteDialog
                open={h.deleteDialogOpen}
                setOpen={h.setDeleteDialogOpen}
                order={h.selectedOrder}
                onConfirm={h.confirmDelete}
            />

            <WhatsAppPromptDialog 
                open={h.whatsappOpen} 
                onOpenChange={h.setWhatsappOpen} 
                customerName={h.whatsappData?.name}
                message={h.whatsappData?.message}
                onConfirm={() => { window.open(h.whatsappData?.url, "_blank"); h.setWhatsappOpen(false); }}
            />
        </div>
    );
}
