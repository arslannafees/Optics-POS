"use client";

import { useState, useEffect, useMemo } from "react";
import { useBranch } from "@/contexts/BranchContext";

export function usePurchasesData() {
    const { currentShop, currentBranch, loading: bl } = useBranch();
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [meta, setMeta] = useState({ f: [], l: [], cl: [], a: [] }); // frames, lenses, contactLenses, accessories

    const fetchPurchases = async () => {
        if (bl) return;
        try {
            setLoading(true);
            const q = new URLSearchParams();
            if (currentShop) q.append('shopId', currentShop.id);
            if (currentBranch) q.append('branchId', currentBranch.id);
            const res = await fetch(`/api/purchases?${q}`);
            setPurchases(res.ok ? await res.json() : []);
        } finally { setLoading(false); }
    };

    const fetchMeta = async () => {
        if (!currentShop) return;
        const q = `shopId=${currentShop.id}`;
        const [fr, lr, clr, ar, vr] = await Promise.all([
            fetch(`/api/frames?${q}`), fetch(`/api/spectacle-lenses?${q}`),
            fetch(`/api/contact-lenses?${q}`), fetch(`/api/accessories?${q}`),
            fetch("/api/vendors")
        ]);
        setMeta({
            f: fr.ok ? await fr.json() : [], l: lr.ok ? await lr.json() : [],
            cl: clr.ok ? await clr.json() : [], a: ar.ok ? await ar.json() : []
        });
        if (vr.ok) setVendors(await vr.json());
    };

    useEffect(() => { fetchPurchases(); fetchMeta(); }, [currentBranch, bl, currentShop]);

    const stats = useMemo(() => ({
        count: purchases.length,
        total: purchases.reduce((s, p) => s + (parseFloat(p.total) || 0), 0),
        paid: purchases.reduce((s, p) => s + (parseFloat(p.paid) || 0), 0),
        balance: purchases.reduce((s, p) => s + (parseFloat(p.balance) || 0), 0),
    }), [purchases]);

    return { purchases, vendors, meta, loading, stats, refresh: fetchPurchases, refreshMeta: fetchMeta };
}
