"use client";

export function useOrderMutations(setFormData, lists) {
    const handleAddItem = (type, fee = "0") => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                id: Date.now(), type, itemId: type === "eye-checkup" ? null : "",
                name: type === "eye-checkup" ? "Eye Checkup" : "",
                price: type === "eye-checkup" ? fee : "", quantity: "1",
            }]
        }));
    };

    const handleRemoveItem = (id) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
    };

    const handleItemChange = (itemId, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id !== itemId) return item;
                if (field === "itemId") {
                    const source = lists[item.type === 'frame' ? 'frames' : item.type === 'lens' ? 'lenses' : item.type === 'contact-lens' ? 'contactLenses' : 'accessories'] || [];
                    const selected = source.find(i => i.id.toString() === value);
                    return { ...item, itemId: value, name: selected?.name || "", price: selected?.price || "", quantity: "1" };
                }
                return { ...item, [field]: value };
            })
        }));
    };

    return { handleAddItem, handleRemoveItem, handleItemChange };
}
