"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    title = "Confirm Deletion",
    loading = false,
    requiredText = "DELETE"
}) {
    const [confirmText, setConfirmText] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setConfirmText("");
        }
    }, [isOpen]);

    const handleConfirm = (e) => {
        if (e) e.preventDefault();
        if (confirmText.toUpperCase() === requiredText) {
            onConfirm();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-0 shadow-2xl">
                <DialogHeader className="space-y-3 pb-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-center text-gray-900 leading-tight">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed text-center">
                            Are you sure you want to delete <span className="font-bold text-gray-900">"{itemName}"</span>?
                            This action is permanent and cannot be undone.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="confirm-delete" className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">
                            Type <span className="text-red-600 font-extrabold px-1 cursor-default select-none">{requiredText}</span> to confirm
                        </Label>
                        <Input
                            id="confirm-delete"
                            autoComplete="off"
                            className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none text-center font-bold tracking-widest placeholder:tracking-normal placeholder:font-normal"
                            placeholder="Enter confirmation text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmText.toUpperCase() === requiredText && handleConfirm()}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:gap-0 mt-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-11 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-all border-0 shadow-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={confirmText.toUpperCase() !== requiredText || loading}
                        className="flex-1 h-11 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? "Deleting..." : "Delete Permanently"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
