"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Zap,
  Flag,
  CheckCircle2,
  Clock,
  Scissors,
  Layers,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const WORKFLOW = [
  { key: "queued",   label: "Queued",    icon: Clock       },
  { key: "cutting",  label: "Cutting",   icon: Scissors    },
  { key: "mounting", label: "Mounting",  icon: Layers      },
  { key: "qc",       label: "QC Check",  icon: ShieldCheck },
  { key: "done",     label: "Done",      icon: CheckCircle2},
];

const NEXT_STATUS = {
  queued:   "cutting",
  cutting:  "mounting",
  mounting: "qc",
  qc:       "done",
};

const STATUS_COLORS = {
  queued:   "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  cutting:  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  mounting: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  qc:       "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  done:     "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  flagged:  "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
};

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function RxRow({ label, sph, cyl, axis, add }) {
  return (
    <div className="grid grid-cols-5 gap-2 text-sm py-2 border-b last:border-0">
      <span className="font-medium">{label}</span>
      <span className="text-center">{sph || "—"}</span>
      <span className="text-center">{cyl || "—"}</span>
      <span className="text-center">{axis || "—"}</span>
      <span className="text-center">{add || "—"}</span>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [flagOpen, setFlagOpen] = React.useState(false);
  const [flagReason, setFlagReason] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  const loadJob = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fabrication/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setJob(data);
      setNotes(data.fabricatorNotes || "");
    } catch (e) {
      toast.error("Failed to load job");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => { loadJob(); }, [loadJob]);

  const updateStatus = async (newStatus, extra = {}) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/fabrication/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, fabricatorNotes: notes, user, ...extra }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Job moved to: ${newStatus === "done" ? "Done ✓" : newStatus}`);
      await loadJob();
    } catch (e) {
      toast.error("Failed to update job status");
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/fabrication/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fabricatorNotes: notes, user }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Notes saved");
    } catch (e) {
      toast.error("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const submitFlag = async () => {
    if (!flagReason.trim()) { toast.error("Please provide a reason"); return; }
    await updateStatus("flagged", { flagReason });
    setFlagOpen(false);
    setFlagReason("");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    );
  }

  if (!job) return <div className="text-center py-16 text-muted-foreground">Job not found.</div>;

  const rx = job.prescription || job.prescriptionData;
  const nextStatus = NEXT_STATUS[job.status];
  const isDone = job.status === "done";
  const isFlagged = job.status === "flagged";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/lens-fabricator/jobs"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              Job #{String(job.orderLocalId || job.orderId).padStart(4,"0")} — {job.patientName || "Unknown Patient"}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}>
                {job.status?.toUpperCase()}
              </span>
              {job.priority === "rush" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
                  <Zap className="size-2.5" /> RUSH
                </span>
              )}
            </div>
          </div>
        </div>
        {!isDone && !isFlagged && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setFlagOpen(true)}
          >
            <Flag className="mr-2 size-4" /> Flag Issue
          </Button>
        )}
      </div>

      {/* Workflow progress bar */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center">
            {WORKFLOW.map((stage, idx) => {
              const currentIdx = WORKFLOW.findIndex(s => s.key === (isFlagged ? "flagged" : job.status));
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const Icon = stage.icon;
              return (
                <React.Fragment key={stage.key}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`size-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCurrent ? "border-primary bg-primary text-primary-foreground" :
                      isPast ? "border-green-500 bg-green-500 text-white" :
                      "border-muted-foreground/20 bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="size-4" />
                    </div>
                    <span className={`text-[10px] font-medium ${isCurrent ? "text-primary" : isPast ? "text-green-600" : "text-muted-foreground"}`}>
                      {stage.label}
                    </span>
                  </div>
                  {idx < WORKFLOW.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition-colors ${idx < currentIdx ? "bg-green-500" : "bg-muted"}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {isFlagged && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-700 dark:text-red-400">
              <AlertTriangle className="size-4 shrink-0" />
              <span><strong>Flagged:</strong> {job.flagReason || "No reason provided"}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: prescription + items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prescription */}
          {rx && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-muted-foreground pb-2 border-b">
                  <span>Eye</span>
                  <span className="text-center">SPH</span>
                  <span className="text-center">CYL</span>
                  <span className="text-center">AXIS</span>
                  <span className="text-center">ADD</span>
                </div>
                <RxRow
                  label="Right (OD)"
                  sph={rx.right_sph || rx.rightSph}
                  cyl={rx.right_cyl || rx.rightCyl}
                  axis={rx.right_axis || rx.rightAxis}
                  add={rx.right_add || rx.rightAdd}
                />
                <RxRow
                  label="Left (OS)"
                  sph={rx.left_sph || rx.leftSph}
                  cyl={rx.left_cyl || rx.leftCyl}
                  axis={rx.left_axis || rx.leftAxis}
                  add={rx.left_add || rx.leftAdd}
                />
                {(rx.pd_type || rx.pdType || rx.total_pd || rx.totalPd || rx.right_pd || rx.rightPupillaryDistance) && (
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {(rx.right_pd || rx.rightPupillaryDistance) && <span>R PD: {rx.right_pd || rx.rightPupillaryDistance}</span>}
                    {(rx.left_pd || rx.leftPupillaryDistance) && <span>L PD: {rx.left_pd || rx.leftPupillaryDistance}</span>}
                    {(rx.total_pd || rx.totalPd) && <span>Total PD: {rx.total_pd || rx.totalPd}</span>}
                  </div>
                )}
                {(rx.remarks) && (
                  <p className="mt-2 text-xs text-muted-foreground">Remarks: {rx.remarks}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Frame & Lens items — full detail */}
          {job.items && job.items.length > 0 && (
            <div className="space-y-3">
              {job.items.map((item, i) => {
                const isFrame = item.itemType === 'frame';
                const isLens = item.itemType === 'lens' || item.itemType === 'spectacle_lens';
                const d = item.detail;
                return (
                  <Card key={i} className={isFrame ? "border-blue-200 dark:border-blue-800" : isLens ? "border-violet-200 dark:border-violet-800" : ""}>
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isFrame ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            : isLens ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200"
                            : "bg-muted text-muted-foreground"
                          }`}>
                            {item.itemType?.replace(/_/g, " ")}
                          </span>
                          <CardTitle className="text-sm font-semibold">{item.itemName}</CardTitle>
                        </div>
                        <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                      </div>
                    </CardHeader>
                    {d && (
                      <CardContent className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          {d.brand_name && <DetailRow label="Brand" value={d.brand_name} />}
                          {isFrame && d.model    && <DetailRow label="Model"    value={d.model} />}
                          {isFrame && d.color    && <DetailRow label="Color"    value={d.color} />}
                          {isFrame && d.material && <DetailRow label="Material" value={d.material} />}
                          {isFrame && d.shape    && <DetailRow label="Shape"    value={d.shape} />}
                          {isFrame && d.size     && <DetailRow label="Size"     value={d.size} />}
                          {isFrame && d.category && <DetailRow label="Category" value={d.category} />}
                          {isLens  && d.type     && <DetailRow label="Type"     value={d.type} />}
                          {isLens  && d.material && <DetailRow label="Material" value={d.material} />}
                          {isLens  && d.coating  && <DetailRow label="Coating"  value={d.coating} />}
                          {d.remarks && (
                            <div className="col-span-2 mt-1 text-xs text-muted-foreground border-t pt-2">
                              Remarks: {d.remarks}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* Optician Notes */}
          {job.opticianNotes && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-400">Notes from Optician</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{job.opticianNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Fabricator Notes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Your Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add notes about this job (e.g. lens blank used, fitting adjustments…)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                disabled={isDone}
              />
              {!isDone && (
                <Button size="sm" variant="outline" onClick={saveNotes} disabled={saving}>
                  Save Notes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Job Logs */}
          {job.logs && job.logs.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {job.logs.map(log => (
                    <div key={log.id} className="flex gap-3 text-sm">
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full self-start mt-0.5 ${STATUS_COLORS[log.status] || "bg-muted"}`}>
                        {log.status}
                      </span>
                      <div className="flex-1">
                        {log.note && <p className="text-muted-foreground">{log.note}</p>}
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {log.updatedByName ? `${log.updatedByName} · ` : ""}{new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: status control */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Job Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order #</span>
                <span className="font-medium">#{String(job.orderLocalId || job.orderId).padStart(4,"0")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient</span>
                <span className="font-medium">{job.patientName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Type</span>
                <span>{job.orderType || "—"}</span>
              </div>
              {job.deliveryDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Due</span>
                  <span className="font-medium text-amber-600">{job.deliveryDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Received</span>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              {job.completedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-green-600">{new Date(job.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status advancement */}
          {!isDone && !isFlagged && nextStatus && (
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Advance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => updateStatus(nextStatus)}
                  disabled={saving}
                >
                  <ChevronRight className="mr-2 size-4" />
                  Move to: {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                </Button>
                {job.status === "qc" && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">Marking as Done will notify the main shop.</p>
                )}
              </CardContent>
            </Card>
          )}

          {isDone && (
            <Card className="border-green-300 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-5 pb-4 text-center">
                <CheckCircle2 className="size-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-700 dark:text-green-400">Job Completed</p>
                <p className="text-xs text-muted-foreground mt-1">Main shop has been notified.</p>
              </CardContent>
            </Card>
          )}

          {isFlagged && (
            <Card className="border-red-300 bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-5 pb-4 text-center space-y-3">
                <Flag className="size-8 text-red-500 mx-auto" />
                <p className="font-semibold text-red-700 dark:text-red-400">Job Flagged</p>
                <p className="text-xs text-muted-foreground">{job.flagReason}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => updateStatus("queued")} disabled={saving}>
                  Re-queue Job
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Flag Dialog */}
      <Dialog open={flagOpen} onOpenChange={setFlagOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="size-4 text-red-500" /> Flag Issue — Return to Shop
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="flagReason">Reason for flagging</Label>
            <Textarea
              id="flagReason"
              placeholder="e.g. Frame too narrow, wrong lens power received, broken frame…"
              value={flagReason}
              onChange={e => setFlagReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={submitFlag} disabled={saving}>
              <Flag className="mr-2 size-4" /> Flag & Notify Shop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
