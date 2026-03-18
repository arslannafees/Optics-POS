"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatWhatsAppMessage, getWhatsAppUrl } from "@/lib/notifications/whatsapp";

export function useOrdersActions({ setOrders, setDeleteDialogOpen, setSelectedOrder }) {
    const [whatsappOpen, setWhatsappOpen] = useState(false);
    const [whatsappData, setWhatsappData] = useState(null);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, user: { id: user.id, name: user.name, role: user.role } }),
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                toast.success(`Status updated to ${newStatus}`);
                
                if (newStatus === "Ready" && updatedOrder.customerPhone) {
                    const message = formatWhatsAppMessage(updatedOrder.readyTemplate, updatedOrder);
                    const url = getWhatsAppUrl(updatedOrder.customerPhone, message);
                    if (url) {
                        setWhatsappData({ name: updatedOrder.customer, message, url });
                        setWhatsappOpen(true);
                    }
                }
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

    return { handleStatusUpdate, confirmDelete, whatsappOpen, setWhatsappOpen, whatsappData };
}
