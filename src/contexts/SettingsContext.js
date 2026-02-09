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

const fetcher = (url) => fetch(url).then(res => res.json());

export function SettingsProvider({ children }) {
    const { currentShop } = useBranch();

    const { data: rawSettings, error, isLoading, mutate } = useSWR(
        currentShop?.id ? `/api/settings?shopId=${currentShop.id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const settings = React.useMemo(() => {
        const defaults = {
            businessName: currentShop?.name || "Optics",
            currency: "PKR", taxRate: "18", dateFormat: "DD/MM/YYYY",
            discountType: "percentage", taxApplication: "pre-tax"
        };
        return { ...defaults, ...rawSettings };
    }, [rawSettings, currentShop]);

    return (
        <SettingsContext.Provider value={{ settings, loading: isLoading, refreshSettings: mutate }}>
            {children}
        </SettingsContext.Provider>
    );
}
