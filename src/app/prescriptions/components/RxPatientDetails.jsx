"use client";

import React from "react";
import { Activity, Calendar, User, Printer, Edit3 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { DetailItem } from "./RxFields";

export function RxPatientDetails({ patient, count, settings, onPrint }) {
    const customerId = patient?.id?.toString();
    return (
        <Card className="border shadow-lg sticky top-24 ring-1 ring-primary/5">
            <PatientHeader letter={patient?.firstName?.charAt(0)} />
            <CardContent className="pt-12 text-center pb-8 px-6">
                <h2 className="text-xl font-bold">{patient?.firstName} {patient?.lastName}</h2>
                <p className="text-sm text-muted-foreground mt-1">ID: #{String(patient?.id).padStart(4, '0')}</p>
                <Separator className="my-6 opacity-30" />
                <PatientStats patient={patient} count={count} settings={settings} />
                <Separator className="my-6 opacity-30" />
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={onPrint}><Printer className="h-4 w-4 mr-2" /> Print</Button>
                    <Button className="w-full text-xs" asChild><Link href={`/order/new?customerId=${customerId}`}><Edit3 className="h-4 w-4 mr-2" /> New</Link></Button>
                </div>
            </CardContent>
        </Card>
    );
}

function PatientHeader({ letter }) {
    return (
        <div className="bg-primary h-24 p-6 flex items-end justify-center relative overflow-hidden">
            <div className="h-16 w-16 bg-background rounded-full border-4 border-background flex items-center justify-center shadow-xl z-10 translate-y-8">
                <span className="text-2xl font-black text-primary uppercase">{letter}</span>
            </div>
        </div>
    );
}

function PatientStats({ patient, count, settings }) {
    return (
        <div className="space-y-4 text-left">
            <DetailItem icon={<Activity className="h-4 w-4 text-rose-500" />} label="Status" value={<Badge variant="secondary">Active</Badge>} />
            <DetailItem icon={<Calendar className="h-4 w-4 text-amber-500" />} label="First Visit" value={formatDate(patient?.createdAt, settings?.dateFormat)} />
            <DetailItem icon={<User className="h-4 w-4 text-emerald-500" />} label="Records" value={count} />
        </div>
    );
}
