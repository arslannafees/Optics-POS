"use client";

import { useState } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function useReceivableActions(currentShop, fetchReceivables) {
    const [refreshing, setRefreshing] = useState(false);
    const [orders, setOrders] = useState({ data: [], loading: false, open: false, customer: null });

    const refresh = () => { setRefreshing(true); fetchReceivables().finally(() => setRefreshing(false)); };

    const viewOrders = async (c) => {
        setOrders({ data: [], loading: true, open: true, customer: c });
        try {
            const q = currentShop?.id ? `&shopId=${currentShop.id}` : '';
            const res = await fetch(`/api/orders?customerId=${c.id}${q}`);
            if (res.ok) {
                const d = await res.json();
                setOrders(p => ({ ...p, data: d.filter(o => o.balance > 0), loading: false }));
            }
        } catch (e) { toast.error("Failed to load orders"); setOrders(p => ({ ...p, loading: false })); }
    };

    const exportPDF = (recs) => {
        const doc = new jsPDF();
        const cols = ["First Name", "Last Name", "Mobile", "Phone", "Balance", "Total", "Deposit", "Reference"];
        const rows = recs.map(i => [i.firstName, i.lastName, i.mobile, i.phone, i.balance, i.total, i.deposit, i.reference]);
        autoTable(doc, { head: [cols], body: rows, startY: 20 });
        doc.text("Receivable Report", 14, 15);
        doc.save("receivable_report.pdf");
    };

    const exportExcel = (recs) => {
        const ws = XLSX.utils.json_to_sheet(recs);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Receivables");
        XLSX.writeFile(wb, "receivable_report.xlsx");
    };

    return { refreshing, refresh, orders, setOrders, viewOrders, exportPDF, exportExcel };
}
