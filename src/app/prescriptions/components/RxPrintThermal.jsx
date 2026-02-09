"use client";

import React from "react";
import { formatDate } from "@/lib/utils";

export function RxPrintLayoutThermal({ patient, prescriptions, settings }) {
    if (!patient || !prescriptions[0]) return null;
    const px = prescriptions[0];
    return (
        <div className="w-[80mm] text-black bg-white p-4 font-mono text-[12px] leading-tight">
            <style dangerouslySetInnerHTML={{ __html: "@media print { @page { margin: 0; size: 80mm auto; } body { margin: 0; padding: 0 !important; } }" }} />
            <div className="text-center border-b-2 border-black pb-4 mb-4">
                {settings?.businessLogo && <img src={settings.businessLogo} alt="Logo" className="h-16 w-auto mx-auto mb-2" />}
                <h1 className="text-xl font-black uppercase">{settings?.businessName}</h1>
                <p className="text-[10px]">{settings?.businessAddress}</p>
                <p className="text-[10px] font-bold">TEL: {settings?.businessPhone}</p>
                <div className="bg-black text-white text-[10px] font-black uppercase py-1 mt-2">Prescription Card</div>
            </div>
            <div className="space-y-1 mb-4 font-bold">
                <div className="flex justify-between"><span>PATIENT:</span><span>{patient.firstName}</span></div>
                <div className="flex justify-between"><span>DATE:</span><span>{formatDate(px.date, settings?.dateFormat)}</span></div>
            </div>
            <PrescriptionDetails px={px} />
        </div>
    );
}

function PrescriptionDetails({ px }) {
    return (
        <div className="space-y-4 border-t border-black pt-3">
            <p className="font-black border-b border-black">RIGHT EYE (O.D.)</p>
            <div className="grid grid-cols-3 gap-1"><div>SPH:{px.rightSph}</div><div>CYL:{px.rightCyl}</div><div>AXIS:{px.rightAxis}</div></div>
            <p className="font-black border-b border-black pt-2">LEFT EYE (O.S.)</p>
            <div className="grid grid-cols-3 gap-1"><div>SPH:{px.leftSph}</div><div>CYL:{px.leftCyl}</div><div>AXIS:{px.leftAxis}</div></div>
        </div>
    );
}
