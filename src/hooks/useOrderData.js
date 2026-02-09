"use client";

import { useState, useEffect, useCallback } from "react";

export function useOrderData(currentShop, currentBranch, setFormData, editId, initialCustomerId) {
    const [lists, setLists] = useState({
        customers: [], frames: [], lenses: [],
        contactLenses: [], accessories: [], branches: []
    });

    const fetchData = useCallback(async () => {
        if (!currentShop) return;
        const q = `shopId=${currentShop.id}`;
        try {
            const [cRes, fRes, lRes, clRes, aRes, bRes] = await Promise.all([
                fetch(`/api/customers?${q}`), fetch(`/api/frames?${q}`),
                fetch(`/api/spectacle-lenses?${q}`), fetch(`/api/contact-lenses?${q}`),
                fetch(`/api/accessories?${q}`), fetch(`/api/branches?shopId=${currentShop.id}`),
            ]);

            const [c, f, l, cl, a, b] = await Promise.all([
                cRes.json(), fRes.json(), lRes.json(), clRes.json(), aRes.json(), bRes.json()
            ]);

            setLists({
                customers: c.map(cust => ({
                    ...cust, name: `${cust.firstName} ${cust.lastName || ""}`.trim(),
                    searchValue: `${cust.firstName} ${cust.lastName || ""} ${cust.mobile || ""} ${cust.phone || ""}`.toLowerCase()
                })),
                frames: f, lenses: l, contactLenses: cl, accessories: a, branches: b
            });

            if (!editId && b.length > 0) {
                const branchId = currentBranch?.id || b[0].id;
                setFormData(prev => ({ ...prev, branchId: branchId.toString() }));
            }
        } catch (e) { console.error(e); }
    }, [currentShop, currentBranch, editId, setFormData]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return lists;
}
