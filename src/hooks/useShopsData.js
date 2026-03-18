"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Error');
    return res.json();
};

export function useShopsData() {
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    useEffect(() => {
        const handleLogin = () => setToken(localStorage.getItem('token'));
        window.addEventListener('userLogin', handleLogin);
        return () => window.removeEventListener('userLogin', handleLogin);
    }, []);

    const { data: shops = [], isLoading, mutate } = useSWR(token ? "/api/shops" : null, fetcher, {
        revalidateOnFocus: false,
    });

    const filteredShops = (user) => {
        if (user && user.role !== 'super-admin' && user.shopId) {
            return shops.filter(s => String(s.id) === String(user.shopId));
        }
        return shops;
    };

    return { shops, isLoading, refreshShops: mutate, filteredShops };
}
