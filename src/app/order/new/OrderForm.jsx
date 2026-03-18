"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBranch } from "@/contexts/BranchContext";
import { useSettings } from "@/contexts/SettingsContext";
import * as hooks from "@/hooks";
import * as api from "@/lib/order-api";
import { NewOrderHeader, CustomerInformation, OrderItems, PrescriptionSection, SummaryDetails, PaymentFields } from "./components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { formatWhatsAppMessage, getWhatsAppUrl } from "@/lib/notifications/whatsapp";
import { WhatsAppPromptDialog } from "@/components/notifications/WhatsAppPromptDialog";

function playScanSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.08;
        if (type === "success") {
            osc.type = "sine"; osc.frequency.value = 1800;
            osc.start(); osc.stop(ctx.currentTime + 0.08);
        } else if (type === "increment") {
            osc.type = "sine"; osc.frequency.value = 1200;
            osc.start(); osc.stop(ctx.currentTime + 0.06);
        } else {
            osc.type = "sawtooth"; osc.frequency.value = 280;
            osc.start(); osc.stop(ctx.currentTime + 0.2);
        }
    } catch { /* AudioContext unavailable */ }
}

export function OrderForm() {
    const router = useRouter(); const searchParams = useSearchParams();
    const { settings } = useSettings(); const { currentShop, currentBranch } = useBranch();
    const editId = searchParams.get("edit"); const initCustId = searchParams.get("customerId");
    const st = hooks.useOrderFormState(); const btns = hooks.useOrderButtons();
    const lists = hooks.useOrderData(currentShop, currentBranch, st.setFormData, editId, initCustId);
    const actions = hooks.useOrderMutations(st.setFormData, lists);
    hooks.useOrderCalculations(st.formData, st.setFormData, settings);

    const handleBarcodeScan = useCallback((barcode) => {
        const allItems = [
            ...lists.frames.map(p => ({ ...p, _type: "frame" })),
            ...lists.lenses.map(p => ({ ...p, _type: "lens" })),
            ...lists.contactLenses.map(p => ({ ...p, _type: "contact-lens" })),
            ...lists.accessories.map(p => ({ ...p, _type: "accessory" })),
        ];
        const found = allItems.find(p => p.barcode && p.barcode === barcode);
        if (!found) {
            playScanSound("error");
            toast.error(`No product found for barcode: ${barcode}`);
            return;
        }

        const { _type, ...product } = found;
        const productId = product.id.toString();
        const alreadyInOrder = st.formData.items.find(i => i.type === _type && i.itemId === productId);
        actions.handleAddScannedItem(_type, product);

        if (alreadyInOrder) {
            playScanSound("increment");
            toast.success(`Qty updated: ${found.name || found.brand || barcode}`);
        } else {
            playScanSound("success");
            const label = found.name || `${found.brand || ""} ${found.model || ""}`.trim() || barcode;
            if ((found.stock ?? 1) <= 0) {
                toast.warning(`Added (out of stock): ${label}`);
            } else {
                toast.success(`Added: ${label}`);
            }
        }
    }, [lists, actions, st.formData.items]);

    hooks.useBarcodeScanner(handleBarcodeScan);

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

    const [whatsappOpen, setWhatsappOpen] = React.useState(false);
    const [whatsappData, setWhatsappData] = React.useState({ name: "", message: "", url: "" });

    const onSubmit = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        api.submitOrder(st.formData, editId, currentShop, currentBranch?.id, user).then(order => {
            if (order) {
                if (order.customerPhone && !editId) {
                    const message = formatWhatsAppMessage(order.welcomeTemplate, order);
                    const url = getWhatsAppUrl(order.customerPhone, message);
                    if (url) {
                        setWhatsappData({ name: order.customer, message, url });
                        setWhatsappOpen(true);
                        return; // Wait for dialog, don't redirect yet? Actually, redirecting to list is fine, but dialog might get lost.
                        // Let's redirect after they close or click send.
                    }
                }
                router.push("/order");
            }
        });
    };

    const isEC = st.formData.items.length > 0 && st.formData.items.every(i => i.type === "eye-checkup");
    const dActions = { onDragStart: (e, t) => { btns.setDraggedType(t); e.dataTransfer.setData("itemType", t); }, onDragEnd: () => btns.setDraggedType(null), onDragOver: e => e.preventDefault(), onDropToHeader: e => { e.preventDefault(); const t = e.dataTransfer.getData("itemType"); if (t && btns.buttonConfig.hidden.includes(t)) btns.setButtonConfig(p => ({ visible: [...p.visible, t], hidden: p.hidden.filter(x => x !== t) })); }, onDropToDropdown: e => { e.preventDefault(); const t = e.dataTransfer.getData("itemType"); if (t && btns.buttonConfig.visible.includes(t)) btns.setButtonConfig(p => ({ visible: p.visible.filter(x => x !== t), hidden: [...p.hidden, t] })); } };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <NewOrderHeader onBack={() => router.back()} editId={editId} saving={st.saving} />
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <CustomerInformation state={st} lists={lists} settings={settings} isEyeCheckupOnly={isEC} />
                    <OrderItems state={{ ...st, ...btns }} lists={lists} settings={settings} actions={actions} dragActions={dActions} onBarcodeScan={handleBarcodeScan} />
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
            <WhatsAppPromptDialog 
                open={whatsappOpen} 
                onOpenChange={(open) => { if(!open) { setWhatsappOpen(false); router.push("/order"); } }} 
                customerName={whatsappData.name}
                message={whatsappData.message}
                onConfirm={() => { window.open(whatsappData.url, "_blank"); setWhatsappOpen(false); router.push("/order"); }}
            />
        </form>
    );
}
