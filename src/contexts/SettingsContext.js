"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import { useBranch } from "./BranchContext";

const SettingsContext = createContext({
    settings: { businessName: "Optics" },
    loading: true,
    refreshSettings: async () => { },
});

export const useSettings = () => useContext(SettingsContext);

const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Error');
    return res.json();
};

export function SettingsProvider({ children }) {
    const { currentShop } = useBranch();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const { data: rawSettings, error, isLoading, mutate } = useSWR(
        token && currentShop?.id ? `/api/settings?shopId=${currentShop.id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const { data: globalRawSettings } = useSWR('/api/public/settings', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    });

    const settings = React.useMemo(() => {
        const defaults = {
            businessName: currentShop?.name || "Optics",
            currency: "PKR", taxRate: "18", dateFormat: "DD/MM/YYYY",
            discountType: "percentage", taxApplication: "pre-tax",
            roundOffTotal: "false"
        };
        return { ...defaults, ...rawSettings };
    }, [rawSettings, currentShop]);

    const globalAppName = React.useMemo(() => {
        return globalRawSettings?.businessName || "Optics";
    }, [globalRawSettings]);

    return (
        <SettingsContext.Provider value={{ settings, globalAppName, loading: isLoading, refreshSettings: mutate }}>
            {children}
        </SettingsContext.Provider>
    );
}
