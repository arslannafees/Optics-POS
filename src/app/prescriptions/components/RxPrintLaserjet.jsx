"use client";

import React from "react";
import { formatDate } from "@/lib/utils";

export function RxPrintLayoutLaserjet({ patient, prescriptions, settings }) {
    if (!patient || !prescriptions[0]) return null;
    const px = prescriptions[0];
    const fields = ['sph', 'cyl', 'axis', 'add', 'pd', 'prism', 'base', 'dia', 'seg'];

    return (
        <div className="font-sans text-slate-900 p-12 bg-white max-w-[210mm] mx-auto min-h-[290mm] flex flex-col print:fixed print:top-0 print:left-0 print:w-[210mm] print:h-[297mm] print:m-0 print:p-12 print:overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4; margin: 0; }
                    html, body { height: 100%; width: 100%; margin: 0 !important; padding: 0 !important; overflow: hidden; }
                    * { box-sizing: border-box; }
                }
            ` }} />
            <div className="flex flex-col items-center text-center mb-4 relative">
                {settings?.businessLogo && <img src={settings.businessLogo} alt="Logo" className="h-32 w-auto mb-2" />}
                <h1 className="text-2xl font-extrabold uppercase mb-2">{settings?.businessName || "OPTICS"}</h1>
                <p className="text-sm text-slate-600">{settings?.businessAddress}</p>
                <div className="w-full border-t border-slate-200 my-2" />
                <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">TEL: {settings?.businessPhone} | EMAIL: {settings?.businessEmail}</p>
                <div className="mt-4 border-2 border-slate-900 px-6 py-1 font-black uppercase tracking-[0.4em]">Prescription</div>
            </div>
            <div className="bg-slate-100 p-4 mb-6 rounded-lg border flex justify-between">
                <div><span className="text-[9px] uppercase font-bold text-slate-400 block">Patient</span><span className="font-bold">{patient.firstName} {patient.lastName}</span></div>
                <div className="text-right"><span className="text-[9px] uppercase font-bold text-slate-400 block">Date</span><span className="font-bold">{formatDate(px.date, settings?.dateFormat)}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-10">
                <EyeSection eye="RIGHT EYE (O.D.)" color="text-blue-600" fields={fields} px={px} side="right" />
                <EyeSection eye="LEFT EYE (O.S.)" color="text-emerald-600" fields={fields} px={px} side="left" />
            </div>
        </div>
    );
}

function EyeSection({ eye, color, fields, px, side }) {
    return (
        <div className={`space-y-4 ${color} font-bold`}>
            <p className="text-sm">{eye}</p>
            <div className="grid grid-cols-3 gap-2 text-slate-900">
                {fields.map(f => (
                    <div key={f} className="border p-2 rounded text-center">
                        <p className="text-[8px] uppercase">{f}</p>
                        <p>{px[`${side}${f.charAt(0).toUpperCase() + f.slice(1)}`] || '0.00'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
