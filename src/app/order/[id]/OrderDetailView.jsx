"use client";

import React from "react";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { useSettings } from "@/contexts/SettingsContext";
import { OrderDetailHeader, OrderSummaryCard, OrderDetailItems, OrderPrescriptionCard, OrderDetailCustomer, OrderDetailPayment } from "./components";
import { PrintLayoutThermal, PrintLayoutLaserjet } from "./components/print";

export default function OrderDetailPageWrapper() {
    const { order, isLoading, cashierName, handlePrint, id } = useOrderDetails();
    const { settings } = useSettings();

    if (isLoading) return <LoadingDisplay />;
    if (!order) return null;

    return (
        <div className="space-y-6 pb-12 print:space-y-0 print:p-0">
            <OrderDetailHeader orderId={order.localId || order.id} onPrint={handlePrint} dbId={order.id} />
            <div className="grid gap-6 md:grid-cols-3 print:hidden">
                <div className="md:col-span-2 space-y-6">
                    <OrderSummaryCard order={order} dateFormat={settings?.dateFormat} />
                    <OrderDetailItems items={order.items} currency={settings?.currency} />
                    <OrderPrescriptionCard px={order.prescription} />
                    {order.notes && <NotesCard notes={order.notes} />}
                </div>
                <div className="space-y-6">
                    <OrderDetailCustomer order={order} />
                    <OrderDetailPayment order={order} settings={settings} />
                </div>
            </div>
            <div className="hidden print:block">
                {settings?.printerType === "thermal" ? (
                    <PrintLayoutThermal order={order} settings={settings} cashierName={cashierName} />
                ) : (
                    <PrintLayoutLaserjet order={order} settings={settings} cashierName={cashierName} />
                )}
            </div>
        </div>
    );
}

const LoadingDisplay = () => (
    <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading order details...</p>
        </div>
    </div>
);

const NotesCard = ({ notes }) => (
    <Card className="border shadow-none"><CardHeader><CardTitle className="text-sm font-medium">Order Notes</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{notes}</p></CardContent></Card>
);
