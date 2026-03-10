"use client";

import React from "react";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const PaymentFields = React.memo(function PaymentFields({ formData, setFormData, settings, saving, editId }) {
    const upd = (f, v) => setFormData(p => ({ ...p, [f]: v }));

    // Local state for Paid input
    const [localPaid, setLocalPaid] = React.useState(formData.paid || "");
    React.useEffect(() => {
        setLocalPaid(formData.paid || "");
    }, [formData.paid]);
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (localPaid !== (formData.paid || "")) {
                upd('paid', localPaid);
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [localPaid]);

    // Local state for Remarks
    const [localRemarks, setLocalRemarks] = React.useState(formData.remarks || "");
    React.useEffect(() => {
        setLocalRemarks(formData.remarks || "");
    }, [formData.remarks]);
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (localRemarks !== formData.remarks) {
                upd('remarks', localRemarks);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localRemarks]);

    const balance = formData.total - (parseFloat(localPaid) || 0);

    return (
        <div className="space-y-4">
            <div className="space-y-2"><Label>Paid ({settings?.currency})</Label><Input type="number" value={localPaid} onChange={e => setLocalPaid(e.target.value)} /></div>
            <div className="space-y-2">
                <Label>Method</Label>
                <Select value={formData.paymentMethod} onValueChange={v => upd('paymentMethod', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                        {['cash', 'card', 'upi', 'bank', 'credit'].map(m => <SelectItem key={m} value={m}>{m.toUpperCase()}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            {balance > 0 && <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">Balance Due: {settings?.currency} {balance.toFixed(2)}</div>}
            <Separator />
            <div className="space-y-2"><Label>Remarks</Label><Textarea value={localRemarks} onChange={e => setLocalRemarks(e.target.value)} /></div>
            <Button type="submit" className="w-full gap-2" size="lg" disabled={saving}>
                <Save className="h-4 w-4" /> {saving ? "Saving..." : (editId ? "Update Order" : "Create Order")}
            </Button>
        </div>
    );
});
