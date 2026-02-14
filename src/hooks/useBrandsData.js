"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export function useBrandsData(currentShop, currentBranch, typeFilter) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBrands = async () => {
        if (!currentShop?.id) return;
        setLoading(true);
        try {
            let url = `/api/brands?shopId=${currentShop.id}`;
            if (currentBranch?.id) url += `&branchId=${currentBranch.id}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                // Filter by type if provided
                const filtered = typeFilter
                    ? data.filter(b => b.active && (b.type === typeFilter || b.type === "All Categories" || (typeFilter === "Spectacle Lens" && b.type === "Lens")))
                    : data.filter(b => b.active);
                setBrands(filtered);
            } else {
                setBrands([]);
            }
        } catch (e) {
            console.error("Error loading brands:", e);
            toast.error("Error loading brands");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, [currentShop?.id, currentBranch?.id, typeFilter]);

    return { brands, loading, loadBrands };
}
