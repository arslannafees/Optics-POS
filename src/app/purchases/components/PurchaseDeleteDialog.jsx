"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PurchaseDeleteDialog({ open, onOpenChange, onConfirm }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Purchase Order</DialogTitle>
                    <DialogDescription>
                        Are you sure? This will also reverse any stock changes associated with this purchase.
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => onConfirm().then(s => s && onOpenChange(false))}>Confirm Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
