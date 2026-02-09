"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export function useFramesData(currentShop, currentBranch, hl) {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFrames = async () => {
        if (!currentShop || hl) return;
        setLoading(true);
        try {
            let url = `/api/frames?shopId=${currentShop.id}`;
            if (currentBranch) url += `&branchId=${currentBranch.id}`;
            const res = await fetch(url);
            setFrames(res.ok ? await res.json() : []);
        } catch (e) { toast.error("Error loading frames"); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadFrames() }, [currentShop, currentBranch, hl]);

    const stats = useMemo(() => ({
        totalFrames: frames.length,
        totalStock: frames.reduce((s, f) => s + (parseInt(f.stock) || 0), 0),
        totalValue: frames.reduce((s, f) => s + ((parseFloat(f.cost) || 0) * (parseInt(f.stock) || 0)), 0),
        activeCount: frames.filter(f => f.active).length
    }), [frames]);

    return { frames, setFrames, loading, loadFrames, stats };
}
