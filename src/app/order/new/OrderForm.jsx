"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBranch } from "@/contexts/BranchContext";
import { useSettings } from "@/contexts/SettingsContext";
import * as hooks from "@/hooks";
import * as api from "@/lib/order-api";
import { NewOrderHeader, CustomerInformation, OrderItems, PrescriptionSection, SummaryDetails, PaymentFields } from "./components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrderForm() {
    const router = useRouter(); const searchParams = useSearchParams();
    const { settings } = useSettings(); const { currentShop, currentBranch } = useBranch();
    const editId = searchParams.get("edit"); const initCustId = searchParams.get("customerId");
    const st = hooks.useOrderFormState(); const btns = hooks.useOrderButtons();
    const lists = hooks.useOrderData(currentShop, currentBranch, st.setFormData, editId, initCustId);
    const actions = hooks.useOrderMutations(st.setFormData, lists);
    hooks.useOrderCalculations(st.formData, st.setFormData, settings);

    useEffect(() => { if (editId) api.fetchOrderForEdit(editId, st.setFormData); }, [editId]);
    useEffect(() => { if (initCustId) st.setFormData(p => ({ ...p, customerId: initCustId })); }, [initCustId]);

    const hasAutoAdded = React.useRef(false);
    useEffect(() => {
        const addItem = searchParams.get("addItem");
        if (!editId && addItem === "eye-checkup" && !hasAutoAdded.current) {
            hasAutoAdded.current = true;
            actions.handleAddItem("eye-checkup", settings.eyeCheckupFee || "0");
        }
    }, [editId, searchParams, settings.eyeCheckupFee, actions]);

    const onSubmit = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        api.submitOrder(st.formData, editId, currentShop, currentBranch?.id, user).then(ok => ok && router.push("/order"));
    };

    const isEC = st.formData.items.length > 0 && st.formData.items.every(i => i.type === "eye-checkup");
    const dActions = { onDragStart: (e, t) => { btns.setDraggedType(t); e.dataTransfer.setData("itemType", t); }, onDragEnd: () => btns.setDraggedType(null), onDragOver: e => e.preventDefault(), onDropToHeader: e => { e.preventDefault(); const t = e.dataTransfer.getData("itemType"); if (t && btns.buttonConfig.hidden.includes(t)) btns.setButtonConfig(p => ({ visible: [...p.visible, t], hidden: p.hidden.filter(x => x !== t) })); }, onDropToDropdown: e => { e.preventDefault(); const t = e.dataTransfer.getData("itemType"); if (t && btns.buttonConfig.visible.includes(t)) btns.setButtonConfig(p => ({ visible: p.visible.filter(x => x !== t), hidden: [...p.hidden, t] })); } };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <NewOrderHeader onBack={() => router.back()} editId={editId} saving={st.saving} />
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <CustomerInformation state={st} lists={lists} settings={settings} isEyeCheckupOnly={isEC} />
                    <OrderItems state={{ ...st, ...btns }} lists={lists} settings={settings} actions={actions} dragActions={dActions} />
                    <PrescriptionSection formData={st.formData} setFormData={st.setFormData} settings={settings} onLoadLatest={() => api.fetchLatestRx(st.formData.customerId, st.setFormData)} />
                </div>
                <Card className="border shadow-none sticky top-4">
                    <CardHeader><CardTitle className="text-base">Checkout</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <SummaryDetails formData={st.formData} settings={settings} onChange={(f, v) => st.setFormData(p => ({ ...p, [f]: v }))} />
                        <PaymentFields formData={st.formData} setFormData={st.setFormData} settings={settings} saving={st.saving} editId={editId} />
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
