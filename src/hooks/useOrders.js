"use client";

import { useState } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { useOrdersData } from "./useOrdersData";
import { useOrdersActions } from "./useOrdersActions";

export function useOrders() {
    const { currentBranch, loading: brLoading } = useBranch();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { orders, setOrders, isLoading, loadOrders, stats } = useOrdersData(currentBranch, brLoading);
    const actions = useOrdersActions({ setOrders, setDeleteDialogOpen, setSelectedOrder });

    return {
        orders, isLoading, deleteDialogOpen, setDeleteDialogOpen, selectedOrder, setSelectedOrder,
        loadOrders, ...actions, stats
    };
}
