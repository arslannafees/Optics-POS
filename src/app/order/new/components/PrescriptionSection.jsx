"use client";

import React, { useCallback } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PrescriptionEye } from "./PrescriptionEye";
import { PdTypeToggle } from "./PdTypeToggle";
import { PdInput } from "./PdInput";

// Isolated Notes component — only re-renders when `remarks` string actually changes
const PrescriptionNotes = React.memo(function PrescriptionNotes({ remarks, setFormData }) {
    const [local, setLocal] = React.useState(remarks ?? '');

    // Sync from parent (e.g. on Load Latest RX)
    React.useEffect(() => {
        setLocal(remarks ?? '');
    }, [remarks]);

    // Debounced sync to parent
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (local !== (remarks ?? '')) {
                setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, remarks: local } }));
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [local]);

    return (
        <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={local} onChange={e => setLocal(e.target.value)} />
        </div>
    );
});

export const PrescriptionSection = React.memo(function PrescriptionSection({ formData, setFormData, settings, onLoadLatest }) {
    const px = formData.prescription;
    const onChange = useCallback((f, v) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, [f]: v } })), [setFormData]);

    return (
        <Card className="border shadow-none">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1.5"><CardTitle className="text-base">Prescription Details</CardTitle>
                    <CardDescription>Enter customer&apos;s prescription (optional)</CardDescription></div>
                <div className="flex flex-col items-end gap-10">
                    <Button type="button" variant="outline" size="sm" onClick={onLoadLatest} disabled={!formData.customerId} className="gap-1.5 h-8 px-3 text-[10px] font-bold uppercase border-primary/20 text-primary">
                        <History className="h-3.5 w-3.5" /><span className="hidden sm:inline">Load Latest RX</span>
                    </Button>
                    <PdTypeToggle value={px.pdType} settings={settings} onChange={v => onChange('pdType', v)} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <PrescriptionEye
                    side="Right"
                    data={px}
                    settings={settings}
                    onChange={onChange}
                    pdInput={<PdInput side="Right" data={px} inputType={settings?.prescriptionInputType} onChange={onChange} />}
                />
                <Separator />
                <PrescriptionEye
                    side="Left"
                    data={px}
                    settings={settings}
                    onChange={onChange}
                    pdInput={<PdInput side="Left" data={px} inputType={settings?.prescriptionInputType} onChange={onChange} />}
                />
                <PrescriptionNotes remarks={px.remarks} setFormData={setFormData} />
            </CardContent>
        </Card>
    );
});
