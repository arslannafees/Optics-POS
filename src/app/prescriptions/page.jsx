"use client";

import React, { useRef, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { RxSearch } from "./components/RxSearch";
import { RxHistory } from "./components/RxHistory";
import { RxPatientDetails } from "./components/RxPatientDetails";
import { RxPrintLayoutLaserjet } from "./components/RxPrintLaserjet";
import { RxPrintLayoutThermal } from "./components/RxPrintThermal";
import { PatientSearchAnimation } from "./components/PatientSearchAnimation";

export default function PrescriptionsPage() {
    const { settings } = useSettings();
    const searchRef = useRef(null);
    const api = usePrescriptions();

    useEffect(() => {
        const handleOut = e => { if (searchRef.current && !searchRef.current.contains(e.target)) api.setCustomerOpen(false); };
        document.addEventListener("mousedown", handleOut);
        return () => document.removeEventListener("mousedown", handleOut);
    }, [api]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 print:p-0 print:bg-white text-black">
            {api.selectedCustomerId && (
                <div className="hidden print:block">
                    {settings?.printerType === "thermal"
                        ? <RxPrintLayoutThermal patient={api.selectedCustomer} prescriptions={api.prescriptions} settings={settings} />
                        : <RxPrintLayoutLaserjet patient={api.selectedCustomer} prescriptions={api.prescriptions} settings={settings} />}
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Prescription</h1>
                <RxSearch {...api} searchRef={searchRef} />
            </div>
            {api.selectedCustomerId ? (
                <div className="grid gap-8 lg:grid-cols-[1fr_300px] print:hidden">
                    <RxHistory isLoading={api.isLoading} prescriptions={api.prescriptions} settings={settings} />
                    <RxPatientDetails patient={api.selectedCustomer} count={api.prescriptions.length} settings={settings} onPrint={() => window.print()} />
                </div>
            ) : (
                <EmptySearchState />
            )}
        </div>
    );
}

function EmptySearchState() {
    return (
        <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-700">
            <PatientSearchAnimation />
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Patient Search</h2>
            <p className="text-muted-foreground text-center max-w-sm mb-10 text-lg leading-relaxed font-medium">
                Select a patient to access their prescription records.
            </p>
        </div>
    );
}
