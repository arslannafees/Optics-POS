"use client";

import { useContactLensData } from "./useContactLensData";
import { useContactLensForm } from "./useContactLensForm";
import { useBranch } from "@/contexts/BranchContext";

/**
 * useContactLenses: Orchestrates data and form logic for contact lens management. 
 */
export function useContactLenses() {
    const { currentShop, currentBranch } = useBranch();
    const { lenses, isLoading, refresh, stats } = useContactLensData();
    const form = useContactLensForm(refresh, currentShop?.id, currentBranch?.id);

    const startEdit = (lens) => {
        form.setIsEditing(true);
        form.setSelectedLens(lens);
        form.setFormData({
            ...lens, cost: lens.cost?.toString(), price: lens.price?.toString(),
            stock: lens.stock?.toString(), active: !!lens.active
        });
        form.setSheetOpen(true);
    };

    return {
        lenses, isLoading, stats, startEdit, ...form
    };
}
