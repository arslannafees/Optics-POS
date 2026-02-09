"use client";

import React from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useLenses } from "@/hooks";
import { DataTable } from "@/components/ui/data-table";
import { LensPageHeader, LensStats, LensDeleteDialog, LensAddEditSheet, getLensColumns } from "./components";

export default function LensesPageView() {
    const { settings } = useSettings();
    const l = useLenses(); // l = lenses hook

    const actions = {
        onEdit: (lens) => l.startEdit(lens),
        onDelete: (lens) => { l.setSelectedLens(lens); l.setDeleteDialogOpen(true); }
    };
    const columns = getLensColumns(settings.currency, actions);

    return (
        <div className="space-y-6">
            <LensPageHeader onAddClick={() => l.setSheetOpen(true)} />
            <LensStats stats={l.stats} currency={settings.currency} />
            <DataTable
                columns={columns}
                data={l.lenses}
                loading={l.loading}
                searchPlaceholder="Search lenses by name, brand or material..."
            />
            <LensAddEditSheet
                open={l.sheetOpen}
                setOpen={l.setSheetOpen}
                isEditing={l.isEditing}
                formData={l.formData}
                setFormData={l.setFormData}
                onSubmit={l.handleSubmit}
                resetForm={l.resetForm}
            />
            <LensDeleteDialog
                open={l.deleteDialogOpen}
                setOpen={l.setDeleteDialogOpen}
                lens={l.selectedLens}
                onConfirm={l.handleDelete}
            />
        </div>
    );
}
