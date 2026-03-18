"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function useOrderDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cashierName, setCashierName] = useState("Admin");

    const loadOrder = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                if (data.cashierName) {
                    setCashierName(data.cashierName);
                }
            }
            else { toast.error("Failed to load order"); router.push("/order"); }
        } catch (e) { toast.error("Error loading order"); }
        finally { setIsLoading(false); }
    }, [id, router]);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) setCashierName(JSON.parse(userData).name || "Admin");
        if (id) loadOrder();
    }, [id, loadOrder]);

    const handlePrint = () => window.print();

    return { order, isLoading, cashierName, handlePrint, id };
}
