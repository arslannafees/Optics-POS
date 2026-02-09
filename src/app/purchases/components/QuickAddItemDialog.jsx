"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuickAddItemDialog({ open, onOpenChange, type, onSubmit, loading, currency }) {
    const [form, setForm] = useState({});
    useEffect(() => { if (open) setForm({ brand: "", model: "", name: "", cost: "", price: "", stock: "0", active: true }); }, [open, type]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader><DialogTitle>Quick Add {type?.replace("-", " ")}</DialogTitle>
                    <DialogDescription>Add new item to inventory.</DialogDescription>
                </DialogHeader>
                <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="space-y-4 overflow-y-auto px-1 py-1 flex-1">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1"><Label>Brand/Manufacturer</Label><Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></div>
                        <div className="col-span-2 space-y-1"><Label>Model/Name *</Label><Input required value={form.model || form.name} onChange={e => setForm({ ...form, model: e.target.value, name: e.target.value })} /></div>
                        <div className="space-y-1"><Label>Cost ({currency})</Label><Input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} /></div>
                        <div className="space-y-1"><Label>Price ({currency})</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                    </div>
                    <DialogFooter className="mt-4"><Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Item"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
