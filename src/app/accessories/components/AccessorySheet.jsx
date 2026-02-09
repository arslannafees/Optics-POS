"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { AccessoryFormFields } from "./AccessoryFormFields";

export function AccessorySheet({ open, onOpenChange, isEditing, form, brands, onChange, onSelectChange, onSubmit }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEditing ? "Edit Accessory" : "Add New Accessory"}</SheetTitle>
                    <SheetDescription>
                        {isEditing ? "Update information below" : "Fill in the details to add a new accessory"}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={onSubmit}>
                    <AccessoryFormFields
                        form={form}
                        brands={brands}
                        onChange={onChange}
                        onSelectChange={onSelectChange}
                    />
                    <SheetFooter className="gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">{isEditing ? "Update" : "Add Accessory"}</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
