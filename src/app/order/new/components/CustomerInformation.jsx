"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerPicker } from "./CustomerPicker";
import { OrderMetadataFields } from "./OrderMetadataFields";

export const CustomerInformation = React.memo(function CustomerInformation({ state, lists, settings, isEyeCheckupOnly }) {
    const selected = lists.customers.find(c => c.id.toString() === state.formData.customerId);

    return (
        <Card className="border shadow-none">
            <CardHeader><CardTitle className="text-base">Customer Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <CustomerPicker state={state} customers={lists.customers} />
                    <OrderMetadataFields state={state} branches={lists.branches} isEyeCheckupOnly={isEyeCheckupOnly} />
                </div>
                {selected && <SelectedCustomerBadge customer={selected} />}
            </CardContent>
        </Card>
    );
});

function SelectedCustomerBadge({ customer }) {
    return (
        <div className="rounded-lg border p-3 bg-muted/50">
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.mobile || customer.phone}</p>
            {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}
        </div>
    );
}
