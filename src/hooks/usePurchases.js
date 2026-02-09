"use client";

import { useState } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useSettings } from "@/contexts/SettingsContext";
import { usePurchasesData } from "./usePurchasesData";
import { usePurchaseForm } from "./usePurchaseForm";
import { usePurchaseActions } from "./usePurchaseActions";
import { useQuickAdd } from "./useQuickAdd";

export function usePurchases() {
    const { currentShop, currentBranch } = useBranch();
    const { settings } = useSettings();
    const d = usePurchasesData();
    const f = usePurchaseForm(currentShop, currentBranch, settings, d.refresh);
    const a = usePurchaseActions(d.refresh);
    const q = useQuickAdd(currentShop, currentBranch, d.refreshMeta);
    const [sheetOpen, setSheetOpen] = useState(false);

    const handleQuickAdd = async (data) => {
        const item = await q.add(data);
        if (item) {
            f.setFormData(prev => ({
                ...prev,
                items: prev.items.map(i => i.id === q.activeRowId ? { ...i, itemId: item.id.toString(), name: item.name || item.model || "", cost: item.cost || item.price || "" } : i)
            }));
        }
    };

    return { d, f, a, q, sheetOpen, setSheetOpen, settings, currentShop, currentBranch, handleQuickAdd };
}
