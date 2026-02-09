"use client";

import { useState, useEffect, useMemo } from "react";

export function useLensesData(currentShop, currentBranch, branchLoading) {
    const [lenses, setLenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLenses = async () => {
        if (!currentShop || branchLoading) return;
        try {
            setLoading(true);
            let url = `/api/spectacle-lenses?shopId=${currentShop.id}`;
            if (currentBranch) url += `&branchId=${currentBranch.id}`;
            const res = await fetch(url);
            setLenses(res.ok ? await res.json() : []);
        } catch (e) { setLenses([]) }
        finally { setLoading(false) }
    };

    useEffect(() => { fetchLenses() }, [currentShop, currentBranch, branchLoading]);

    const stats = useMemo(() => ({
        totalLenses: lenses.length,
        activeLenses: lenses.filter(l => l.active).length,
        totalStock: lenses.reduce((s, l) => s + (l.stock || 0), 0),
        totalValue: lenses.reduce((s, l) => s + ((l.price || 0) * (l.stock || 0)), 0)
    }), [lenses]);

    return { lenses, loading, fetchLenses, stats };
}
