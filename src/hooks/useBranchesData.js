"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Error');
    return res.json();
};

export function useBranchesData(shopId) {
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    useEffect(() => {
        const handleLogin = () => setToken(localStorage.getItem('token'));
        window.addEventListener('userLogin', handleLogin);
        return () => window.removeEventListener('userLogin', handleLogin);
    }, []);

    const { data: branches = [], isLoading, mutate } = useSWR(
        token && shopId ? `/api/branches?shopId=${shopId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    const filteredBranches = (user) => {
        if (user && user.role !== 'super-admin' && user.branchId) {
            return branches.filter(b => String(b.id) === String(user.branchId));
        }
        return branches;
    };

    return { branches, isLoading, refreshBranches: mutate, filteredBranches };
}
