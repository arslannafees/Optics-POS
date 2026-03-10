"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronRight, CheckCircle2, RefreshCw, Download } from "lucide-react";

export default function FabricationHistoryPage() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  const loadHistory = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const shopId = user.shopId || localStorage.getItem("selectedShopId");
      let url = `/api/fabrication?shopId=${shopId}&status=done&limit=500`;
      if (fromDate) url += `&fromDate=${fromDate}`;
      if (toDate) url += `&toDate=${toDate}`;
      const res = await fetch(url);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, fromDate, toDate]);

  React.useEffect(() => { loadHistory(); }, [loadHistory]);

  const filtered = jobs.filter(j => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (j.patientName || "").toLowerCase().includes(q) ||
      String(j.orderLocalId || j.orderId).includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Completed Jobs</h1>
          <p className="text-sm text-muted-foreground">History of all fabricated lens orders</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadHistory} disabled={loading}>
          <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or order #…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Input type="date" className="w-[160px]" value={fromDate} onChange={e => setFromDate(e.target.value)} placeholder="From date" />
        <Input type="date" className="w-[160px]" value={toDate} onChange={e => setToDate(e.target.value)} placeholder="To date" />
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <CheckCircle2 className="size-4 text-green-500" />
        <span>{filtered.length} completed job{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No completed jobs found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(job => (
            <Link key={job.id} href={`/lens-fabricator/jobs/${job.id}`}>
              <div className="flex items-center gap-4 rounded-lg border bg-background hover:bg-accent/50 px-4 py-3 transition-colors cursor-pointer">
                <CheckCircle2 className="size-5 text-green-500 shrink-0" />
                <div className="w-16 shrink-0 text-center">
                  <span className="text-xs text-muted-foreground">#{String(job.orderLocalId || job.orderId).padStart(4,"0")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{job.patientName || "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {job.lensInfo
                      ? (Array.isArray(job.lensInfo) ? job.lensInfo.map(l => l.name).join(", ") : String(job.lensInfo))
                      : "No lens details"}
                  </p>
                </div>
                {job.completedAt && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    Completed: {new Date(job.completedAt).toLocaleDateString()}
                  </span>
                )}
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full shrink-0">
                  Done
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
