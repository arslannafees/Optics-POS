"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Flag, RefreshCw, ChevronRight, Search } from "lucide-react";

const STATUS_LABELS = {
  queued:   "Queued",
  cutting:  "Cutting",
  mounting: "Mounting",
  qc:       "QC Check",
  done:     "Done",
  flagged:  "Flagged",
};

const STATUS_COLORS = {
  queued:   "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  cutting:  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  mounting: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  qc:       "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  done:     "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  flagged:  "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

export default function JobQueuePage() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  const loadJobs = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const shopId = user.shopId || localStorage.getItem("selectedShopId");
      const res = await fetch(`/api/fabrication?shopId=${shopId}&status=${statusFilter}&limit=500`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter]);

  React.useEffect(() => { loadJobs(); }, [loadJobs]);

  const filtered = jobs.filter(j => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (j.patientName || "").toLowerCase().includes(q) ||
      String(j.orderLocalId || j.orderId).includes(q) ||
      (j.lensInfo && JSON.stringify(j.lensInfo).toLowerCase().includes(q))
    );
  });

  const rushFirst = [...filtered].sort((a, b) => {
    if (a.priority === "rush" && b.priority !== "rush") return -1;
    if (b.priority === "rush" && a.priority !== "rush") return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Queue</h1>
          <p className="text-sm text-muted-foreground">All assigned lens fabrication jobs</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadJobs} disabled={loading}>
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or order #…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Jobs</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="cutting">Cutting</SelectItem>
            <SelectItem value="mounting">Mounting</SelectItem>
            <SelectItem value="qc">QC Check</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
        </div>
      ) : rushFirst.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No jobs found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {rushFirst.map(job => (
            <Link key={job.id} href={`/lens-fabricator/jobs/${job.id}`}>
              <div className="flex items-center gap-4 rounded-lg border bg-background hover:bg-accent/50 px-4 py-3 transition-colors cursor-pointer">
                {/* Order # */}
                <div className="w-16 shrink-0 text-center">
                  <span className="text-xs text-muted-foreground">#{String(job.orderLocalId || job.orderId).padStart(4,"0")}</span>
                </div>

                {/* Patient + lens info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{job.patientName || "—"}</span>
                    {job.priority === "rush" && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                        <Zap className="size-2.5" /> RUSH
                      </span>
                    )}
                    {job.status === "flagged" && (
                      <Flag className="size-3.5 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {job.lensInfo
                      ? (Array.isArray(job.lensInfo) ? job.lensInfo.map(l => l.name).join(", ") : String(job.lensInfo))
                      : "No lens details"}
                    {job.frameInfo && (
                      <> &middot; {Array.isArray(job.frameInfo) ? job.frameInfo.map(f => f.name).join(", ") : String(job.frameInfo)}</>
                    )}
                  </p>
                </div>

                {/* Prescription quick view */}
                {job.prescriptionData && (
                  <div className="hidden md:flex gap-3 text-xs text-muted-foreground shrink-0">
                    <span>R: {job.prescriptionData.rightSph || job.prescriptionData.right_sph || "—"} / {job.prescriptionData.rightCyl || job.prescriptionData.right_cyl || "—"}</span>
                    <span>L: {job.prescriptionData.leftSph || job.prescriptionData.left_sph || "—"} / {job.prescriptionData.leftCyl || job.prescriptionData.left_cyl || "—"}</span>
                  </div>
                )}

                {/* Delivery date */}
                {job.deliveryDate && (
                  <span className="hidden sm:block text-xs text-muted-foreground shrink-0">Due: {job.deliveryDate}</span>
                )}

                {/* Status badge */}
                <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[job.status] || ""}`}>
                  {STATUS_LABELS[job.status] || job.status}
                </span>

                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
