"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useShopsData, useBranchesData, useUserSync } from "@/hooks";

const BranchContext = createContext({
    currentShop: null, currentBranch: null, shops: [], branches: [], loading: true,
    setCurrentShop: () => { }, setCurrentBranch: () => { }, refreshShops: async () => { }, refreshBranches: () => { },
});

export const useBranch = () => useContext(BranchContext);

export function BranchProvider({ children }) {
    const [currentShop, setCurrentShop] = useState(null);
    const [currentBranch, setCurrentBranch] = useState(null);
    const { shops, refreshShops, filteredShops, isLoading: sLoad } = useShopsData();
    const { branches, refreshBranches, filteredBranches, isLoading: bLoad } = useBranchesData(currentShop?.id);
    const syncUser = useUserSync(refreshShops);

    useEffect(() => { syncUser(); }, [syncUser]);

    // Listen for login events to reset shop/branch state
    useEffect(() => {
        const handleLogin = () => {
            setCurrentShop(null);
            setCurrentBranch(null);
            refreshShops(); // Invalidate SWR cache so new/changed shops are fetched fresh
        };
        window.addEventListener('userLogin', handleLogin);
        return () => window.removeEventListener('userLogin', handleLogin);
    }, [refreshShops]);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        const s = filteredShops(u);
        if (s.length > 0 && !currentShop) {
            const id = localStorage.getItem('selectedShopId');
            setCurrentShop(s.find(x => x.id.toString() === id) || s[0]);
        }
    }, [shops, currentShop, filteredShops]);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        const b = filteredBranches(u);
        if (b.length > 0 && !currentBranch) {
            const id = localStorage.getItem('selectedBranchId');
            setCurrentBranch(b.find(x => x.id.toString() === id) || b[0]);
        }
    }, [branches, currentBranch, filteredBranches]);

    const handleSetShop = (s) => { setCurrentShop(s); localStorage.setItem('selectedShopId', s.id.toString()); localStorage.removeItem('selectedBranchId'); setCurrentBranch(null); };
    const handleSetBranch = (b) => { setCurrentBranch(b); if (b) localStorage.setItem('selectedBranchId', b.id.toString()); };

    const getUser = () => {
        if (typeof window === 'undefined') return {};
        try { return JSON.parse(localStorage.getItem('user') || '{}'); }
        catch { return {}; }
    };

    return (
        <BranchContext.Provider value={{
            currentShop, currentBranch, shops: filteredShops(getUser()),
            branches: filteredBranches(getUser()), loading: sLoad || bLoad,
            setCurrentShop: handleSetShop, setCurrentBranch: handleSetBranch, refreshShops, refreshBranches
        }}>
            {children}
        </BranchContext.Provider>
    );
}
