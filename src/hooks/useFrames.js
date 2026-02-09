"use client";

import { useState } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useFramesData } from "./useFramesData";
import { useFrameForm } from "./useFrameForm";
import { useFrameActions } from "./useFrameActions";

export function useFrames() {
    const { currentShop, currentBranch, loading: hl } = useBranch();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { frames, setFrames, loading, loadFrames, stats } = useFramesData(currentShop, currentBranch, hl);
    const form = useFrameForm();
    const actions = useFrameActions({
        currentShop, currentBranch, isEditing: form.isEditing,
        selectedFrame: form.selectedFrame, form: form.form,
        loadFrames, setSheetOpen: form.setSheetOpen,
        setDeleteDialogOpen, setFrames, resetForm: form.resetForm
    });

    return {
        frames, loading, deleteDialogOpen, setDeleteDialogOpen, ...form,
        ...actions, stats, loadFrames
    };
}
