"use client";

import { useCallback } from "react";

export function useOrderMutations(setFormData, lists) {
    const handleAddItem = useCallback((type, fee = "0") => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                id: Date.now(), type, itemId: type === "eye-checkup" ? null : "",
                name: type === "eye-checkup" ? "Eye Checkup" : "",
                price: type === "eye-checkup" ? fee : "", quantity: "1",
            }]
        }));
    }, [setFormData]);

    const handleRemoveItem = useCallback((id) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    }, [setFormData]);

    const handleItemChange = useCallback((itemId, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id !== itemId) return item;
                if (field === "itemId") {
                    const source = lists[item.type === 'frame' ? 'frames' : item.type === 'lens' ? 'lenses' : item.type === 'contact-lens' ? 'contactLenses' : 'accessories'] || [];
                    const selected = source.find(i => i.id.toString() === value);
                    return {
                        ...item,
                        itemId: value,
                        name: selected?.name || "",
                        brand: selected?.brand || "",
                        color: selected?.color || "",
                        price: selected?.price || "",
                        quantity: "1",
                    };
                }
                return { ...item, [field]: value };
            })
        }));
    }, [setFormData, lists]);

    return { handleAddItem, handleRemoveItem, handleItemChange };
}
