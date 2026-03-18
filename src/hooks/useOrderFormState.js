"use client";

import { useState } from "react";

export const initialOrderState = {
    customerId: "", customerName: "", branchId: "",
    date: new Date().toISOString().split("T")[0],
    deliveryDate: "", orderType: "Standard", items: [],
    prescription: {
        rightSph: "", rightCyl: "", rightAxis: "", rightAdd: "",
        rightDiameter: "", rightBaseCurve: "", rightSegment: "",
        rightPupillaryDistance: "", rightPrism: "",
        leftSph: "", leftCyl: "", leftAxis: "", leftAdd: "",
        leftDiameter: "", leftBaseCurve: "", leftSegment: "",
        leftPupillaryDistance: "", leftPrism: "",
        pdType: "dual", totalPd: "", remarks: "",
    },
    subtotal: 0, discountPercentage: "", discount: 0, tax: 0,
    total: 0, actualTotal: 0, paid: "", paymentMethod: "", remarks: "",
};

export function useOrderFormState() {
    const [formData, setFormData] = useState(initialOrderState);
    const [saving, setSaving] = useState(false);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [customerSearch, setCustomerSearch] = useState("");
    const [isCustomizing, setIsCustomizing] = useState(false);

    return {
        formData, setFormData, saving, setSaving,
        customerOpen, setCustomerOpen,
        customerSearch, setCustomerSearch,
        isCustomizing, setIsCustomizing
    };
}
