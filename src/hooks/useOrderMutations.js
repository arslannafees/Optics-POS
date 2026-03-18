"use client";

import { useCallback } from "react";

export function useOrderMutations(setFormData, lists) {
    const handleAddItem = useCallback((type, fee = "0") => {
        setFormData(prev => {
            if (type === "eye-checkup") {
                const existing = prev.items.find(i => i.type === "eye-checkup");
                if (existing) {
                    return {
                        ...prev,
                        items: prev.items.map(i =>
                            i.id === existing.id
                                ? { ...i, quantity: String((parseInt(i.quantity) || 1) + 1) }
                                : i
                        )
                    };
                }
            }
            return {
                ...prev,
                items: [...prev.items, {
                    id: Date.now(), type, itemId: type === "eye-checkup" ? null : "",
                    name: type === "eye-checkup" ? "Eye Checkup" : "",
                    price: type === "eye-checkup" ? fee : "", quantity: "1",
                }]
            };
        });
    }, [setFormData]);

    const handleRemoveItem = useCallback((id) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    }, [setFormData]);

    const handleItemChange = useCallback((itemId, field, value) => {
        setFormData(prev => {
            if (field !== "itemId") {
                return {
                    ...prev,
                    items: prev.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
                };
            }

            // Find current item and selected product
            const currentItem = prev.items.find(i => i.id === itemId);
            if (!currentItem) return prev;

            const source = lists[currentItem.type === 'frame' ? 'frames' : currentItem.type === 'lens' ? 'lenses' : currentItem.type === 'contact-lens' ? 'contactLenses' : 'accessories'] || [];
            const selected = source.find(i => i.id.toString() === value);

            // Check if this item is already in the order (excluding the current row)
            const existing = prev.items.find(i => i.id !== itemId && i.type === currentItem.type && i.itemId === value);

            if (existing) {
                // If it exists, increment the quantity of the existing row and remove this one
                return {
                    ...prev,
                    items: prev.items.filter(i => i.id !== itemId).map(i =>
                        i.id === existing.id
                            ? { ...i, quantity: String((parseInt(i.quantity) || 1) + 1) }
                            : i
                    )
                };
            }

            // If it doesn't exist, update the current row with new item details
            return {
                ...prev,
                items: prev.items.map(item => {
                    if (item.id !== itemId) return item;
                    return {
                        ...item,
                        itemId: value,
                        name: selected?.name || "",
                        brand: selected?.brand || "",
                        color: selected?.color || "",
                        price: selected?.price || "",
                        quantity: "1",
                    };
                })
            };
        });
    }, [setFormData, lists]);

    const handleAddScannedItem = useCallback((type, product) => {
        setFormData(prev => {
            const productId = product.id.toString();
            const existing = prev.items.find(i => i.type === type && i.itemId === productId);
            if (existing) {
                // Already in order — bump quantity
                return {
                    ...prev,
                    items: prev.items.map(i =>
                        i.id === existing.id
                            ? { ...i, quantity: String((parseInt(i.quantity) || 1) + 1) }
                            : i
                    )
                };
            }
            return {
                ...prev,
                items: [...prev.items, {
                    id: Date.now(),
                    type,
                    itemId: productId,
                    name: product.name || `${product.brand || ""} ${product.model || ""}`.trim(),
                    brand: product.brand || "",
                    color: product.color || "",
                    price: product.price || "",
                    quantity: "1",
                }]
            };
        });
    }, [setFormData]);

    return { handleAddItem, handleRemoveItem, handleItemChange, handleAddScannedItem };
}
