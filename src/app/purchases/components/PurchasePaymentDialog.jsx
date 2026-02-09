"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PurchasePaymentDialog({ open, onOpenChange, purchase, currency, onPay }) {
    const [amount, setAmount] = useState("");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                        Record payment for PO #{purchase?.invoiceNumber || purchase?.id}.
                        Outstanding: {currency} {purchase?.balance?.toLocaleString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4"><Label>Amount ({currency})</Label>
                    <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} max={purchase?.balance} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button disabled={!amount} onClick={() => onPay(amount).then(s => s && onOpenChange(false))}>Record</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
