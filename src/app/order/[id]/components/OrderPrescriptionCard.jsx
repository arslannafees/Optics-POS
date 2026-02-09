"use client";

import React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderPrescriptionEye } from "./OrderPrescriptionEye";

export function OrderPrescriptionCard({ px }) {
    if (!px) return null;
    return (
        <Card className="border shadow-none overflow-hidden print:hidden">
            <CardHeader className="bg-muted/10 py-4"><CardTitle className="text-base flex items-center gap-2 text-primary"><FileText className="h-5 w-5" /> Clinical Prescription</CardTitle></CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-10">
                    <OrderPrescriptionEye side="Right" px={px} />
                    <OrderPrescriptionEye side="Left" px={px} />
                </div>
                <div className="pt-6 border-t border-dashed grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl border bg-background"><p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">PD TYPE</p><Badge variant="secondary" className="text-xs font-black uppercase">{px.pdType === 'dual' ? "Dual" : (px.pdType || "N/A")}</Badge></div>
                    {px.pdType === 'single' && <div className="p-3 rounded-xl border bg-background"><p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">TOTAL P.D.</p><p className="text-xs font-black">{px.totalPd || "0.00"}</p></div>}
                </div>
                {px.remarks && <div className="pt-6 border-t border-dashed"><p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Notes</p><div className="p-4 bg-muted/30 rounded-xl italic text-sm font-mono">&quot;{px.remarks}&quot;</div></div>}
            </CardContent>
        </Card>
    );
}
