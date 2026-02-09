"use client";

import { toast } from "sonner";

export function useOrdersActions({ setOrders, setDeleteDialogOpen, setSelectedOrder }) {
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, user: { id: user.id, name: user.name, role: user.role } }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                toast.success(`Status updated to ${newStatus}`);
            } else toast.error((await res.json()).error || "Failed to update");
        } catch (e) { toast.error("Error updating status"); }
    };

    const confirmDelete = async (selectedOrder) => {
        if (!selectedOrder) return;
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`/api/orders/${selectedOrder.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: { id: user.id, name: user.name, role: user.role } }),
            });
            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
                toast.success("Order deleted");
            } else toast.error((await res.json()).error || "Failed to delete");
        } catch (e) { toast.error("Error deleting order"); }
        finally { setDeleteDialogOpen(false); setSelectedOrder(null); }
    };

    return { handleStatusUpdate, confirmDelete };
}
