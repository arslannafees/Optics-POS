"use client";

import useSWR from "swr";
import { useBranch } from "@/contexts/BranchContext";

const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Error');
    return res.json();
};

export function useContactLensData() {
    const { currentShop, currentBranch } = useBranch();

    const { data: lenses = [], isLoading, mutate } = useSWR(
        currentShop ? `/api/contact-lenses?shopId=${currentShop.id}${currentBranch ? `&branchId=${currentBranch.id}` : ""}` : null,
        fetcher, { dedupingInterval: 60000 }
    );

    const stats = {
        total: lenses.length,
        active: lenses.filter(l => l.active).length,
        stock: lenses.reduce((s, l) => s + (l.stock || 0), 0),
        value: lenses.reduce((s, l) => s + ((l.price || 0) * (l.stock || 0)), 0)
    };

    return { lenses, isLoading, refresh: mutate, stats };
}
