"use client";

import { useEffect } from "react";

export function useOrderCalculations(formData, setFormData, settings) {
    useEffect(() => {
        const subtotal = formData.items.reduce((sum, item) =>
            sum + ((parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0)), 0
        );

        const discountInput = parseFloat(formData.discountPercentage) || 0;
        const discount = settings?.discountType === "amount" ? discountInput : (subtotal * discountInput) / 100;
        const taxRate = parseFloat(settings?.taxRate) || 0;

        let tax = (settings?.taxApplication === "post-tax")
            ? (subtotal * (taxRate / 100))
            : ((subtotal - discount) * (taxRate / 100));

        const rawTotal = subtotal - discount + tax;
        const total = settings?.roundOffTotal === "true" ? Math.ceil(rawTotal) : rawTotal;

        setFormData(prev => {
            if (prev.subtotal === subtotal && prev.discount === discount && prev.tax === tax && prev.total === total && prev.actualTotal === rawTotal) {
                return prev; // No change — skip re-render
            }
            return { ...prev, subtotal, discount, tax, total, actualTotal: rawTotal };
        });
    }, [formData.items, formData.discountPercentage, settings, setFormData]);
}
