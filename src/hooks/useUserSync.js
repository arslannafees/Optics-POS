"use client";

import { useCallback } from "react";

export function useUserSync(refreshShops) {
    return useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch("/api/profile", { headers: { "Authorization": `Bearer ${token}` } });
            if (res.ok) {
                const updatedUser = await res.json();
                const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
                const hasChanged = cachedUser.shopId !== updatedUser.shopId || cachedUser.branchId !== updatedUser.branchId || cachedUser.role !== updatedUser.role;
                if (hasChanged) {
                    const newUser = { ...cachedUser, shopId: updatedUser.shopId, branchId: updatedUser.branchId, role: updatedUser.role };
                    localStorage.setItem("user", JSON.stringify(newUser));
                    refreshShops();
                }
            }
        } catch (e) { console.error("User sync error:", e); }
    }, [refreshShops]);
}
