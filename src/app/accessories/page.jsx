"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";
import { useBranch } from "@/contexts/BranchContext";
import { useAccessories } from "@/hooks/useAccessories";
import { useAccessoryForm } from "@/hooks/useAccessoryForm";
import { saveAccessory, deleteAccessory } from "@/lib/accessory-api";
import { getAccessoryColumns } from "./columns";
import { AccessoryStats } from "./components/AccessoryStats";
import { AccessorySheet } from "./components/AccessorySheet";
import { AccessoryDeleteDialog } from "./components/AccessoryDeleteDialog";
import { AccessoryHeader } from "./components/AccessoryHeader";

export default function AccessoriesPage() {
    const { settings } = useSettings();
    const { currentShop, currentBranch } = useBranch();
    const { accessories, brands, isLoading, loadAccessories, setAccessories } = useAccessories();
    const state = useAccessoryForm();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (await saveAccessory(state.form, state.isEditing, state.selectedAccessory?.id, currentShop, currentBranch)) {
            loadAccessories();
            state.resetForm();
            state.setSheetOpen(false);
        }
    };

    const onConfirmDelete = async () => {
        if (await deleteAccessory(state.selectedAccessory.id)) {
            setAccessories(prev => prev.filter(a => a.id !== state.selectedAccessory.id));
            state.setDeleteDialogOpen(false);
        }
    };

    const columns = getAccessoryColumns({
        onEdit: state.handleEdit,
        onDelete: (acc) => { state.setSelectedAccessory(acc); state.setDeleteDialogOpen(true); },
        onToggleActive: async (acc) => { /* logic for toggle active could be moved to lib as well */ },
        currency: settings.currency,
        threshold: parseInt(settings.lowStockThreshold || "5")
    });

    return (
        <div className="space-y-6">
            <AccessoryHeader onRefresh={loadAccessories} onAdd={() => { state.resetForm(); state.setSheetOpen(true); }} />
            <AccessoryStats accessories={accessories} currency={settings.currency} threshold={parseInt(settings.lowStockThreshold || "5")} />
            <Card>
                <CardHeader><CardTitle>Accessory List</CardTitle><CardDescription>A list of all accessories</CardDescription></CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={accessories} searchPlaceholder="Search..." isLoading={isLoading} />
                </CardContent>
            </Card>
            <AccessorySheet open={state.sheetOpen} onOpenChange={state.setSheetOpen} isEditing={state.isEditing} form={state.form} brands={brands} onChange={(e) => state.setForm(p => ({ ...p, [e.target.name]: e.target.value }))} onSelectChange={(n, v) => state.setForm(p => ({ ...p, [n]: v }))} onSubmit={onSubmit} />
            <AccessoryDeleteDialog open={state.deleteDialogOpen} onOpenChange={state.setDeleteDialogOpen} accessoryName={state.selectedAccessory?.name} onConfirm={onConfirmDelete} />
        </div>
    );
}
