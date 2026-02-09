"use client";

import { useState } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useLensesData } from "./useLensesData";
import { useLensForm } from "./useLensForm";
import { useLensActions } from "./useLensActions";

export function useLenses() {
    const { currentShop, currentBranch, loading: brLoading } = useBranch();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { lenses, loading, fetchLenses, stats } = useLensesData(currentShop, currentBranch, brLoading);
    const form = useLensForm();
    const actions = useLensActions({
        currentShop, currentBranch, isEditing: form.isEditing,
        selectedLens: form.selectedLens, formData: form.formData,
        fetchLenses, setSheetOpen: form.setSheetOpen,
        setDeleteDialogOpen, resetForm: form.resetForm
    });

    return {
        lenses, loading, deleteDialogOpen, setDeleteDialogOpen, ...form,
        ...actions, stats
    };
}
