"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useBranch } from "@/contexts/BranchContext";

export function useAccessories() {
    const { currentShop, currentBranch, loading: branchLoading } = useBranch();
    const [accessories, setAccessories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadAccessories = useCallback(async () => {
        if (!currentShop) return;
        setIsLoading(true);
        try {
            let url = `/api/accessories?shopId=${currentShop.id}`;
            if (currentBranch) url += `&branchId=${currentBranch.id}`;
            const response = await fetch(url);
            if (response.ok) setAccessories(await response.json());
            else toast.error("Failed to fetch accessories");
        } catch (error) {
            toast.error("Error connecting to server");
        } finally {
            setIsLoading(false);
        }
    }, [currentShop, currentBranch]);

    const loadBrands = useCallback(async () => {
        if (!currentShop) return;
        try {
            let url = `/api/brands?shopId=${currentShop.id}`;
            if (currentBranch) url += `&branchId=${currentBranch.id}`;
            const response = await fetch(url);
            if (response.ok) setBrands(await response.json());
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    }, [currentShop, currentBranch]);

    useEffect(() => {
        if (!branchLoading && currentShop) {
            loadAccessories();
            loadBrands();
        }
    }, [currentShop, currentBranch, branchLoading, loadAccessories, loadBrands]);

    return { accessories, setAccessories, brands, isLoading, loadAccessories };
}
