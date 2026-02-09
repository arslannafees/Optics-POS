"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { useSettings } from "@/contexts/SettingsContext";
import { useContactLenses } from "@/hooks/useContactLenses";
import { ContactLensHeader, ContactLensStats, ContactLensColumns, ContactLensAddEditSheet, ContactLensDeleteDialog, getContactLensColumns } from "./components";

export function ContactLensesPageView() {
    const { settings } = useSettings();
    const c = useContactLenses(); // c = contact lens hook
    const low = parseInt(settings.lowStockThreshold || "5");

    const actions = {
        onEdit: (lens) => c.startEdit(lens),
        onDelete: (lens) => { c.setSelectedLens(lens); c.setDeleteDialogOpen(true); }
    };
    const columns = getContactLensColumns(settings.currency, low, actions);

    return (
        <div className="space-y-6">
            <ContactLensHeader onAddClick={() => { c.resetForm(); c.setSheetOpen(true); }} />
            <ContactLensStats stats={c.stats} currency={settings.currency} />
            <DataTable
                columns={columns} data={c.lenses} loading={c.isLoading}
                searchPlaceholder="Search contact lenses..."
            />
            <ContactLensAddEditSheet
                open={c.sheetOpen} setOpen={c.setSheetOpen} isEditing={c.isEditing}
                formData={c.formData} setFormData={c.setFormData}
                onSubmit={c.onSubmit} resetForm={c.resetForm}
            />
            <ContactLensDeleteDialog
                open={c.deleteDialogOpen} setOpen={c.setDeleteDialogOpen}
                lens={c.selectedLens} onConfirm={c.handleDelete}
            />
        </div>
    );
}
