"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function OrderMetadataFields({ state, branches, isEyeCheckupOnly }) {
    const { formData, setFormData } = state;
    return (
        <>
            <div className="space-y-2">
                <Label>Order Date</Label>
                <DatePicker value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            {!isEyeCheckupOnly && (
                <>
                    <div className="space-y-2">
                        <Label>Delivery Date</Label>
                        <DatePicker value={formData.deliveryDate} onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Order Type</Label>
                        <Select value={formData.orderType} onValueChange={(v) => setFormData({ ...formData, orderType: v })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                                <SelectItem value="Express">Express</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}
            <div className="space-y-2">
                <Label>Branch *</Label>
                <Select value={formData.branchId} onValueChange={(v) => setFormData({ ...formData, branchId: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Branch" /></SelectTrigger>
                    <SelectContent>
                        {branches.map((b) => <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
