"use client";

import useSWR from "swr";
const fetcher = (url) => fetch(url).then(res => res.json());

export function useBranchesData(shopId) {
    const { data: branches = [], isLoading, mutate } = useSWR(
        shopId ? `/api/super-admin/branches?shopId=${shopId}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    const filteredBranches = (user) => {
        if (user && user.role !== 'super-admin' && user.branchId) {
            return branches.filter(b => b.id === user.branchId);
        }
        return branches;
    };

    return { branches, isLoading, refreshBranches: mutate, filteredBranches };
}
