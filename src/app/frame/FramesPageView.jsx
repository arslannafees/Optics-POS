"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useSettings } from "@/contexts/SettingsContext";
import { useFrames } from "@/hooks/useFrames";
import { FramePageHeader, FrameStats, FrameDeleteDialog, FrameAddEditSheet, getFrameColumns } from "./components";

export function FramesPageView() {
    const { settings } = useSettings();
    const f = useFrames(); // f = frames hook

    const actions = {
        onEdit: (frame) => f.editFrame(frame),
        onDelete: (frame) => { f.setSelectedFrame(frame); f.setDeleteDialogOpen(true); },
        onToggle: (frame) => f.toggleActive(frame)
    };
    const columns = getFrameColumns(settings.currency, actions);
    const lowStock = f.frames.filter(x => x.stock <= 5).length;

    return (
        <div className="space-y-6">
            <FramePageHeader onRefresh={f.loadFrames} onAdd={() => { f.setForm({ active: true }); f.setSheetOpen(true); }} isRefreshing={f.loading} />
            <FrameStats stats={f.stats} currency={settings.currency} lowStockCount={lowStock} />
            <Card>
                <CardHeader><CardTitle>Frame List</CardTitle></CardHeader>
                <CardContent><DataTable columns={columns} data={f.frames} searchPlaceholder="Search frames..." isLoading={f.loading} /></CardContent>
            </Card>
            <FrameAddEditSheet open={f.sheetOpen} setOpen={f.setSheetOpen} isEditing={f.isEditing} form={f.form} setForm={f.setForm} onSubmit={f.handleSubmit} />
            <FrameDeleteDialog open={f.deleteDialogOpen} setOpen={f.setDeleteDialogOpen} frame={f.selectedFrame} onConfirm={f.deleteFrame} />
        </div>
    );
}
