"use client";

import React from "react";
import { Plus, ChevronDown, Trash2, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { PurchaseFormItems } from "./PurchaseFormItems";

export function PurchaseAddEditSheet({ open, setOpen, vendors, formData, setFormData, onSubmit, meta, currency, onQuickAdd }) {
    const addRow = (type) => setFormData(p => ({ ...p, items: [...p.items, { id: Date.now(), type, itemId: "", name: "", cost: "", quantity: "1" }] }));
    const removeRow = (id) => setFormData(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>New Purchase Order</SheetTitle>
                    <SheetDescription>Create a new purchase order entry</SheetDescription>
                </SheetHeader>
                <form onSubmit={onSubmit} className="space-y-6 mt-6 px-8 pb-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Vendor *</Label>
                            <Select value={formData.vendorId} onValueChange={v => setFormData({ ...formData, vendorId: v })} required>
                                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                                <SelectContent>{vendors.map(v => <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Invoice Number</Label>
                            <Input value={formData.invoiceNumber} onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })} placeholder="INV-001" />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <DatePicker value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label>Subtotal ({currency}) *</Label>
                            <Input type="number" value={formData.subtotal} onChange={e => setFormData({ ...formData, subtotal: e.target.value })} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Discount ({currency})</Label>
                                <span className="text-[10px] text-muted-foreground">
                                    ({formData.subtotal > 0 ? ((parseFloat(formData.discount) || 0) / parseFloat(formData.subtotal) * 100).toFixed(0) : 0}%)
                                </span>
                            </div>
                            <Input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} placeholder="0" />
                        </div>

                        <div className="space-y-2">
                            <Label>Tax ({currency})</Label>
                            <Input type="number" value={formData.tax} onChange={e => setFormData({ ...formData, tax: e.target.value })} placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <Label>Total ({currency})</Label>
                            <Input value={formData.total} readOnly className="bg-muted" />
                        </div>

                        <div className="space-y-2">
                            <Label>Amount Paid ({currency})</Label>
                            <Input type="number" value={formData.paid} onChange={e => setFormData({ ...formData, paid: e.target.value })} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <Select value={formData.paymentMethod} onValueChange={v => setFormData({ ...formData, paymentMethod: v })}>
                                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="cheque">Cheque</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                    <SelectItem value="on_credit">On Credit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <PurchaseFormItems items={formData.items} setFormData={setFormData} addRow={addRow} removeRow={removeRow} meta={meta} currency={currency} onQuickAdd={onQuickAdd} />

                        <div className="col-span-2 space-y-2">
                            <Label>Remarks</Label>
                            <Textarea value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} placeholder="Additional notes..." />
                        </div>
                    </div>
                    <SheetFooter className="mt-6">
                        <Button type="submit" className="w-full bg-[#006b52] hover:bg-[#005a45] text-white py-6 text-base font-semibold">Create Purchase</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
