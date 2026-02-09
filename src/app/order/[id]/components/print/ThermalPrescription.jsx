"use client";

import React from "react";

export function ThermalPrescription({ px }) {
    if (!px) return null;
    const pd = (s) => px.pdType === 'single' ? px.totalPd : (px[`${s}PupillaryDistance`] || px[`${s}Pd`]);

    return (
        <div className="space-y-2 mb-4 border-b-2 border-dashed pb-2">
            <div className="text-[10px] font-black border-b border-black uppercase text-center mb-1">Prescription Summary</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <EyeCol side="R (OD)" s="right" px={px} pd={pd('right')} />
                <EyeCol side="L (OS)" s="left" px={px} pd={pd('left')} />
            </div>
            {px.remarks && <div className="text-[9px] italic text-center mt-1 border-t pt-1">&quot;{px.remarks}&quot;</div>}
        </div>
    );
}

function EyeCol({ side, s, px, pd }) {
    return (
        <div className="space-y-0.5">
            <p className="text-[10px] font-black underline">{side}</p>
            <p className="text-[9px] flex justify-between"><span>S/C:</span> <span>{px[`${s}Sph`]} / {px[`${s}Cyl`]}</span></p>
            <p className="text-[9px] flex justify-between"><span>A/D:</span> <span>{px[`${s}Axis`]} / {pd}</span></p>
        </div>
    );
}
