"use client";

import React from "react";
import { Building2, Receipt, Bell, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBranch } from "@/contexts/BranchContext";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { SettingsHeader, BusinessSettings, InvoiceSettings, NotificationSettings, SystemSettings } from "./components";
import { motion } from "framer-motion";

export function SettingsPageView() {
    const { currentShop } = useBranch();
    const s = useSettingsForm(currentShop?.id); // s = settings hook
    const [activeTab, setActiveTab] = React.useState("business");

    if (s.loading) return <div className="p-12 text-center animate-pulse">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <SettingsHeader onSave={s.save} saving={s.saving} />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="flex w-full max-w-2xl mx-auto relative h-11">
                    <STab v="business" i={<Building2 />} l="Business" active={activeTab === "business"} />
                    <STab v="invoice" i={<Receipt />} l="Invoice" active={activeTab === "invoice"} />
                    <STab v="notifications" i={<Bell />} l="Alerts" active={activeTab === "notifications"} />
                    <STab v="system" i={<Database />} l="System" active={activeTab === "system"} />
                </TabsList>
                <TabsContent value="business"><BusinessSettings settings={s.settings} update={s.update} /></TabsContent>
                <TabsContent value="invoice"><InvoiceSettings settings={s.settings} update={s.update} /></TabsContent>
                <TabsContent value="notifications"><NotificationSettings settings={s.settings} update={s.update} /></TabsContent>
                <TabsContent value="system"><SystemSettings settings={s.settings} update={s.update} /></TabsContent>
            </Tabs>
        </div>
    );
}

const STab = ({ v, i, l, active }) => (
    <TabsTrigger
        value={v}
        className="relative gap-2 px-4 py-2 z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
    >
        {active && (
            <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white rounded-lg shadow-sm z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
        {React.cloneElement(i, { className: "size-4" })}
        <span className="font-medium">{l}</span>
    </TabsTrigger>
);
