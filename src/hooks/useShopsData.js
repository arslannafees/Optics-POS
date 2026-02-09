"use client";

import useSWR from "swr";
const fetcher = (url) => fetch(url).then(res => res.json());

export function useShopsData() {
    const { data: shops = [], isLoading, mutate } = useSWR("/api/super-admin/shops", fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    });

    const filteredShops = (user) => {
        if (user && user.role !== 'super-admin' && user.shopId) {
            return shops.filter(s => s.id === user.shopId);
        }
        return shops;
    };

    return { shops, isLoading, refreshShops: mutate, filteredShops };
}
