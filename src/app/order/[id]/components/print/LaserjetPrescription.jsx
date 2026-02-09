"use client";

import React from "react";
import { Eye } from "lucide-react";

export function LaserjetPrescription({ px }) {
    if (!px) return null;
    const pd = (s) => px.pdType === 'single' ? px.totalPd : (px[`${s}PupillaryDistance`] || px[`${s}Pd`]);
    const fields = ['Sph', 'Cyl', 'Axis', 'Add', 'Prism'];

    return (
        <div className="mt-8 border-2 border-slate-200 rounded-xl overflow-hidden print:border-slate-800">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-slate-800 uppercase flex items-center gap-2"><Eye className="h-3 w-3" /> Clinical Prescription</h3>
                <span className="text-[9px] font-bold text-slate-600 uppercase">PD Type: {px.pdType}</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-8">
                <EyePrintCol side="Right" px={px} fields={fields} pdVal={pd('right')} />
                <EyePrintCol side="Left" px={px} fields={fields} pdVal={pd('left')} />
            </div>
            {px.remarks && <div className="px-4 py-2 bg-slate-50 border-t font-serif italic text-[10px]">&quot; {px.remarks} &quot;</div>}
        </div>
    );
}

function EyePrintCol({ side, px, fields, pdVal }) {
    const s = side.toLowerCase();
    const color = side === 'Right' ? 'text-blue-700' : 'text-emerald-700';
    return (
        <div className="space-y-3">
            <h4 className={`text-[9px] font-bold ${color} uppercase border-b pb-1`}>{side} Eye ({side === 'Right' ? 'O.D.' : 'O.S.'})</h4>
            <div className="grid grid-cols-3 gap-2">
                {fields.map(f => <Fld key={f} l={f.toUpperCase()} v={px[`${s}${f}`]} />)}
                <Fld l="P.D." v={pdVal} />
            </div>
        </div>
    );
}

const Fld = ({ l, v }) => <div className="border p-2 rounded bg-white"><p className="text-[8px] font-bold text-muted-foreground mb-1 uppercase">{l}</p><p className="text-xs font-black">{v || "0.00"}</p></div>;
