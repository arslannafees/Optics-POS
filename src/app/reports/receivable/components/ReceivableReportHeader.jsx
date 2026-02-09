"use client";

import React from "react";
import { RefreshCw, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ReceivableReportHeader({ onRefresh, refreshing, onExportPDF, onExportExcel }) {
    return (
        <div className="flex flex-col items-center gap-6 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-center">Receivable Report</h1>
            <div className="flex items-center justify-end w-full space-x-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="h-9 px-4 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" className="h-9 px-4 bg-black hover:bg-black/90 text-white font-medium">
                            <Download className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={onExportPDF} className="cursor-pointer">PDF Document</DropdownMenuItem>
                        <DropdownMenuItem onClick={onExportExcel} className="cursor-pointer">Excel Spreadsheet</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
