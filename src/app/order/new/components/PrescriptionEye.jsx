"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { PrescriptionField } from "./PrescriptionField";
import { BaseSelector } from "./BaseSelector"; // To be created
import * as opt from "../constants/prescriptionOptions";

export function PrescriptionEye({ side, data, settings, onChange, pdInput }) {
    const s = side.toLowerCase();
    const inputType = settings?.prescriptionInputType;
    const upd = (f, v) => onChange(`${s}${f}`, v);

    return (
        <div className="space-y-4">
            <Label className="text-base font-medium">{side} Eye ({side === 'Right' ? 'OD' : 'OS'})</Label>
            <div className="grid grid-cols-4 gap-4">
                <PrescriptionField label="SPH" value={data[`${s}Sph`]} options={opt.SPH_OPTIONS} inputType={inputType} onChange={v => upd('Sph', v)} />
                <PrescriptionField label="CYL" value={data[`${s}Cyl`]} options={opt.CYL_OPTIONS} inputType={inputType} onChange={v => upd('Cyl', v)} />
                <PrescriptionField label="AXIS" value={data[`${s}Axis`]} options={opt.AXIS_OPTIONS} inputType={inputType} disabled={!data[`${s}Cyl`] || data[`${s}Cyl`] === "0.00"} onChange={v => upd('Axis', v)} />
                <PrescriptionField label="ADD" value={data[`${s}Add`]} options={opt.ADD_OPTIONS} inputType={inputType} onChange={v => { upd('Add', v); if (s === 'right') onChange('leftAdd', v); }} />
                <PrescriptionField label="PRISM" value={data[`${s}Prism`]} options={opt.PRISM_OPTIONS} inputType={inputType} onChange={v => upd('Prism', v)} />
                <BaseSelector value={data[`${s}BaseCurve`]} onChange={v => upd('BaseCurve', v)} />
                <PrescriptionField label="SEG" value={data[`${s}Segment`]} options={opt.SEG_OPTIONS} inputType={inputType} onChange={v => upd('Segment', v)} />
                <PrescriptionField label="DIA" value={data[`${s}Diameter`]} options={opt.DIA_OPTIONS} inputType={inputType} onChange={v => upd('Diameter', v)} />
                {pdInput}
            </div>
        </div>
    );
}
