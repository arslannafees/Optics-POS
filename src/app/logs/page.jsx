"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon,
    Search,
    Eye,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBranch } from "@/contexts/BranchContext";
import NoData from "@/components/NoData";

const ENTITY_TYPES = [
    { value: "all", label: "All Types" },
    { value: "customer", label: "Customer" },
    { value: "order", label: "Order" },
    { value: "prescription", label: "Prescription" },
    { value: "brand", label: "Brand" },
    { value: "frame", label: "Frame" },
    { value: "lens", label: "Lens" },
    { value: "contact_lens", label: "Contact Lens" },
    { value: "accessory", label: "Accessory" },
    { value: "vendor", label: "Vendor" },
    { value: "purchase", label: "Purchase" },
];

const ACTION_TYPES = [
    { value: "all", label: "All Actions" },
    { value: "create", label: "Created" },
    { value: "update", label: "Updated" },
    { value: "delete", label: "Deleted" },
];

function ActionBadge({ action }) {
    if (action === "create")
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Created</Badge>;
    if (action === "update")
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Updated</Badge>;
    if (action === "delete")
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Deleted</Badge>;
    return <Badge variant="outline">{action}</Badge>;
}

function formatFieldValue(value) {
    if (value === null || value === undefined) return "—";

    // Array of items (e.g. order/purchase items)
    if (Array.isArray(value)) {
        if (value.length === 0) return "None";
        return (
            <div className="space-y-1.5">
                {value.map((item, i) => {
                    if (typeof item === "object" && item !== null) {
                        const type = item.type ?? item.itemType ?? "";
                        const name = item.name || item.itemName || "";
                        const qty = item.quantity ?? item.qty ?? "";
                        const price = item.price ?? "";
                        const total = item.total ?? "";

                        const label = name
                            ? `${name}${type ? ` (${type})` : ""}`
                            : type
                            ? type.charAt(0).toUpperCase() + type.slice(1)
                            : `Item ${i + 1}`;

                        const details = [
                            qty !== "" ? `Qty: ${qty}` : null,
                            price !== "" ? `Price: ${price}` : null,
                            total !== "" ? `Total: ${total}` : null,
                        ]
                            .filter(Boolean)
                            .join("  ·  ");

                        return (
                            <div key={i} className="flex items-start gap-2 bg-white/60 rounded px-2 py-1.5 border border-slate-100">
                                <span className="font-medium text-slate-700 truncate">{label}</span>
                                {details && <span className="text-slate-500 text-xs mt-0.5 shrink-0">{details}</span>}
                            </div>
                        );
                    }
                    return <div key={i}>{String(item)}</div>;
                })}
            </div>
        );
    }

    // Plain object — render as key: value pairs
    if (typeof value === "object") {
        return (
            <div className="space-y-0.5">
                {Object.entries(value).map(([k, v]) => (
                    <div key={k} className="flex gap-1 text-xs">
                        <span className="text-slate-500 capitalize shrink-0">{k.replace(/_/g, " ")}:</span>
                        <span className="text-slate-800">{String(v ?? "—")}</span>
                    </div>
                ))}
            </div>
        );
    }

    return String(value);
}

function ChangesViewer({ log }) {
    const { changes, action } = log;

    if (!changes || (typeof changes === "object" && Object.keys(changes).length === 0)) {
        return (
            <div className="text-center py-8 text-muted-foreground italic bg-muted/20 rounded-lg border border-dashed">
                No additional data recorded for this action.
            </div>
        );
    }

    if (action?.toLowerCase() === "update") {
        const { old, new: newVal } = changes;
        if (old && newVal) {
            const diffs = Object.keys(newVal).filter(
                (k) => JSON.stringify(old[k]) !== JSON.stringify(newVal[k])
            );
            if (diffs.length === 0) {
                return (
                    <div className="text-center py-8 text-muted-foreground italic bg-muted/20 rounded-lg border border-dashed">
                        No tracked field changes found.
                    </div>
                );
            }
            return (
                <div className="space-y-4">
                    {diffs.map((key) => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 pb-4 last:border-0">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-red-600/70 uppercase tracking-wider">
                                    {key.replace(/_/g, " ")} (Old)
                                </span>
                                <div className="text-sm bg-red-50/50 p-2.5 rounded border border-red-100/50 text-red-900">
                                    {formatFieldValue(old[key])}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">
                                    {key.replace(/_/g, " ")} (New)
                                </span>
                                <div className="text-sm bg-emerald-50/50 p-2.5 rounded border border-emerald-100/50 text-emerald-900">
                                    {formatFieldValue(newVal[key])}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(changes).map(([key, value]) => (
                <div key={key} className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {key.replace(/_/g, " ")}
                    </span>
                    <div className="text-sm bg-muted/40 p-2.5 rounded border border-slate-100">
                        {formatFieldValue(value)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ActivityLogsPage() {
    const { currentShop, currentBranch } = useBranch();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });
    const [users, setUsers] = useState([]);

    const [entityType, setEntityType] = useState("all");
    const [action, setAction] = useState("all");
    const [userFilter, setUserFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [page, setPage] = useState(1);
    const [clearDialogOpen, setClearDialogOpen] = useState(false);

    const fetchLogs = useCallback(async () => {
        if (!currentShop) return;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("shopId", currentShop.id);
            if (currentBranch) params.set("branchId", currentBranch.id);
            params.set("page", page.toString());
            params.set("limit", "50");
            if (entityType !== "all") params.set("entityType", entityType);
            if (action !== "all") params.set("action", action);
            if (userFilter !== "all") params.set("userId", userFilter);
            if (search) params.set("search", search);
            if (startDate) params.set("startDate", format(startDate, "yyyy-MM-dd"));
            if (endDate) params.set("endDate", format(endDate, "yyyy-MM-dd"));

            const res = await fetch(`/api/activity-logs?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
                setUsers(data.users || []);
                setMetadata({
                    total: data.total || 0,
                    page: data.page || 1,
                    limit: data.limit || 50,
                    totalPages: data.totalPages || 1,
                });
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLoading(false);
        }
    }, [currentShop, currentBranch, page, entityType, action, userFilter, startDate, endDate, search]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const clearFilters = () => {
        setEntityType("all");
        setAction("all");
        setUserFilter("all");
        setSearch("");
        setStartDate(null);
        setEndDate(null);
        setPage(1);
    };

    const clearAllLogs = async () => {
        if (!currentShop) return;
        try {
            const res = await fetch(`/api/activity-logs?shopId=${currentShop.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setLogs([]);
                setMetadata({ total: 0, page: 1, limit: 50, totalPages: 1 });
                setClearDialogOpen(false);
            }
        } catch (err) {
            console.error("Failed to clear logs:", err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                    <p className="text-muted-foreground">Track changes made by staff users</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear All Logs
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Clear Activity Logs</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <p className="text-sm text-foreground">
                                    Are you sure you want to clear <strong>ALL</strong> activity logs? This cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={clearAllLogs}>
                                    Clear All
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-2 px-6 shadow-sm flex flex-wrap items-center gap-4">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-r border-slate-100 pr-6 py-2">
                    Filters
                </div>

                <Select value={entityType} onValueChange={(v) => { setEntityType(v); setPage(1); }}>
                    <SelectTrigger className="h-10 w-[150px] text-sm border-none shadow-none focus:ring-0">
                        <SelectValue placeholder="Entity Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {ENTITY_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="h-6 w-px bg-slate-100" />

                <Select value={action} onValueChange={(v) => { setAction(v); setPage(1); }}>
                    <SelectTrigger className="h-10 w-[140px] text-sm border-none shadow-none focus:ring-0">
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                        {ACTION_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="h-6 w-px bg-slate-100" />

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-10 justify-start text-left font-normal text-sm min-w-[140px] hover:bg-slate-50",
                                !startDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={startDate} onSelect={(d) => { setStartDate(d); setPage(1); }} initialFocus />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-10 justify-start text-left font-normal text-sm min-w-[140px] hover:bg-slate-50",
                                !endDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(d) => { setEndDate(d); setPage(1); }}
                            initialFocus
                            disabled={(d) => startDate && d < startDate}
                        />
                    </PopoverContent>
                </Popover>

                <div className="h-6 w-px bg-slate-100" />

                <Select value={userFilter} onValueChange={(v) => { setUserFilter(v); setPage(1); }}>
                    <SelectTrigger className="h-10 w-[140px] text-sm border-none shadow-none focus:ring-0">
                        <SelectValue placeholder="User" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        {users.map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="h-6 w-px bg-slate-100" />

                <div className="relative flex-grow min-w-[160px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search user or entity..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="pl-10 h-10 text-sm border-none shadow-none focus-visible:ring-0 w-full"
                    />
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-8">Timestamp</TableHead>
                                <TableHead className="text-center">User</TableHead>
                                <TableHead className="text-center">Shop</TableHead>
                                <TableHead className="text-center">Branch</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                <TableHead className="text-center">Entity</TableHead>
                                <TableHead className="text-right pr-8">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <TableCell key={j}>
                                                <div className="h-4 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-60 text-center">
                                        <NoData message="No activity logs found" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground pl-8">
                                            {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="font-medium text-sm">{log.userName || "Unknown"}</span>
                                                <span className="text-xs text-muted-foreground capitalize">{log.userRole || "-"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-normal text-[10px] py-0">
                                                {log.shopName || "Default Shop"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-normal text-[10px] py-0 border-slate-200 text-muted-foreground">
                                                {log.branchName || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <ActionBadge action={log.action} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <Badge variant="secondary" className="capitalize mb-1">
                                                    {log.entityType?.replace(/_/g, " ")}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                                                    {log.entityName || `ID: ${log.entityId}`}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            {log.changes && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Change Details</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="mt-4">
                                                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground border-b pb-4">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-xs font-semibold uppercase">User</span>
                                                                    <span className="text-foreground">{log.userName}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-xs font-semibold uppercase">Action</span>
                                                                    <span className="capitalize text-foreground">{log.action}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-xs font-semibold uppercase">Entity</span>
                                                                    <span className="capitalize text-foreground">{log.entityType}</span>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-xs font-semibold uppercase">Time</span>
                                                                    <span className="text-foreground">
                                                                        {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <ChangesViewer log={log} />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {metadata.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {page} of {metadata.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(metadata.totalPages, p + 1))}
                        disabled={page === metadata.totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
