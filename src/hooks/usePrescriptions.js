"use client";

import { useState, useEffect } from "react";
import { useBranch } from "@/contexts/BranchContext";

export function usePrescriptions() {
    const { currentShop } = useBranch();
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [customerOpen, setCustomerOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (currentShop) fetchCustomers(currentShop.id);
    }, [currentShop]);

    const fetchCustomers = async (shopId) => {
        try {
            const res = await fetch(`/api/customers?shopId=${shopId}`);
            if (res.ok) setCustomers(await res.json());
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (selectedCustomerId) fetchPrescriptions(selectedCustomerId);
        else setPrescriptions([]);
    }, [selectedCustomerId]);

    const fetchPrescriptions = async (cid) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/customers/${cid}/prescriptions`);
            if (res.ok) setPrescriptions(await res.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const selectedCustomer = customers.find(c => c.id.toString() === selectedCustomerId);

    return {
        customers, selectedCustomerId, setSelectedCustomerId,
        customerOpen, setCustomerOpen, prescriptions,
        isLoading, searchQuery, setSearchQuery, selectedCustomer
    };
}
