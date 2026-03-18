"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  Scissors,
  Layers,
  ShieldCheck,
  Flag,
  Zap,
  ListChecks,
  RefreshCw,
} from "lucide-react";

const STAGES = [
  { key: "queued",   label: "Queued",   icon: Clock,       color: "bg-slate-100 dark:bg-slate-800",   badge: "secondary" },
  { key: "cutting",  label: "Cutting",  icon: Scissors,    color: "bg-blue-50 dark:bg-blue-950",      badge: "default"   },
  { key: "mounting", label: "Mounting", icon: Layers,      color: "bg-amber-50 dark:bg-amber-950",    badge: "warning"   },
  { key: "qc",       label: "QC Check", icon: ShieldCheck, color: "bg-purple-50 dark:bg-purple-950", badge: "secondary" },
  { key: "done",     label: "Done",     icon: CheckCircle2,color: "bg-green-50 dark:bg-green-950",    badge: "success"   },
];

const STATUS_COLOR = {
  queued:   "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  cutting:  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  mounting: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  qc:       "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  done:     "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  flagged:  "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

function PriorityBadge({ priority }) {
  if (priority !== "rush") return null;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
      <Zap className="size-2.5" /> RUSH
    </span>
  );
}

function JobCard({ job }) {
  const rx = job.prescriptionData;
  return (
    <Link href={`/lens-fabricator/jobs/${job.id}`}>
      <div className="rounded-lg border bg-background hover:bg-accent/50 p-3 space-y-2 cursor-pointer transition-colors shadow-sm">
        <div className="flex items-start justify-between gap-1">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">#{String(job.orderLocalId || job.orderId).padStart(4,"0")}</span>
            <span className="font-semibold text-sm leading-tight">{job.patientName || "—"}</span>
          </div>
          <PriorityBadge priority={job.priority} />
        </div>
        {job.lensInfo && (
          <p className="text-xs text-muted-foreground truncate">
            {Array.isArray(job.lensInfo) ? job.lensInfo.map(l => l.name).join(", ") : String(job.lensInfo)}
          </p>
        )}
        {rx && (
          <div className="grid grid-cols-2 gap-x-2 text-[11px] bg-muted/40 rounded p-1.5">
            <span className="text-muted-foreground">R: {rx.rightSph || rx.right_sph || "—"} / {rx.rightCyl || rx.right_cyl || "—"}</span>
            <span className="text-muted-foreground">L: {rx.leftSph || rx.left_sph || "—"} / {rx.leftCyl || rx.left_cyl || "—"}</span>
          </div>
        )}
        {job.deliveryDate && (
          <p className="text-[10px] text-muted-foreground">Due: {job.deliveryDate}</p>
        )}
      </div>
    </Link>
  );
}

export default function FabricatorDashboard() {
  const [jobs, setJobs] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  const loadData = React.useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    try {
      const shopId = user.shopId || localStorage.getItem("selectedShopId");
      const [jobsRes, statsRes] = await Promise.all([
        fetch(`/api/fabrication?shopId=${shopId}&status=active&limit=200`),
        fetch(`/api/fabrication/stats?shopId=${shopId}`),
      ]);
      const jobsData = await jobsRes.json();
      const statsData = await statsRes.json();
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [loadData]);

  const jobsByStage = (stageKey) => jobs.filter(j => j.status === stageKey);

  const flaggedJobs = jobs.filter(j => j.status === "flagged");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lens Fabricator Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage lens cutting, mounting and quality control jobs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link href="/lens-fabricator/jobs"><ListChecks className="mr-2 size-4" /> All Jobs</Link>
          </Button>
        </div>
      </div>

      {/* Daily Stats */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed Today</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-bold text-green-600">{stats.completedToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-bold">{stats.totalActive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rush Orders</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-bold text-red-500">{stats.rushActive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Flagged</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-bold text-amber-500">{stats.flagged}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Flagged Jobs Alert */}
      {flaggedJobs.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
              <Flag className="size-4" /> {flaggedJobs.length} Flagged Job{flaggedJobs.length > 1 ? "s" : ""} — Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 flex flex-wrap gap-2">
            {flaggedJobs.map(j => (
              <Link key={j.id} href={`/lens-fabricator/jobs/${j.id}`}>
                <Badge variant="destructive" className="cursor-pointer">
                  #{String(j.orderLocalId || j.orderId).padStart(4,"0")} {j.patientName}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Job Tray — Active Workflow</h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.filter(s => s.key !== "done").map(stage => {
              const stageJobs = jobsByStage(stage.key);
              const Icon = stage.icon;
              return (
                <div key={stage.key} className={`rounded-xl border p-3 space-y-2 min-h-[200px] ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">{stage.label}</span>
                    </div>
                    <span className="text-xs bg-background rounded-full px-2 py-0.5 font-medium">
                      {stageJobs.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {stageJobs.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No jobs</p>
                    ) : (
                      stageJobs.map(job => <JobCard key={job.id} job={job} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
