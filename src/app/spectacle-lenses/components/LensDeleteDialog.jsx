"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * LensDeleteDialog: Confirmation modal for lens deletion.
 */
export function LensDeleteDialog({ open, setOpen, lens, onConfirm }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Lens</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <span className="font-semibold text-primary">&quot;{lens?.name}&quot;</span>?
                        This action cannot be undone and will remove it from inventory.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Confirm Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
