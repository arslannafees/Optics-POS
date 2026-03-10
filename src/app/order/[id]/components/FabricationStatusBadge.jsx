"use client";

import React from "react";
import { Glasses, Clock, Scissors, Layers, ShieldCheck, CheckCircle2, Flag, HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const STAGE_CONFIG = {
  queued:   { label: "Awaiting Fabrication",  Icon: Clock,        cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  cutting:  { label: "Cutting Lens",          Icon: Scissors,     cls: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  mounting: { label: "Mounting",              Icon: Layers,       cls: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  qc:       { label: "In QC Check",           Icon: ShieldCheck,  cls: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  done:     { label: "Fabricated ✓",          Icon: CheckCircle2, cls: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  flagged:  { label: "Issue Flagged",         Icon: Flag,         cls: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export function FabricationStatusBadge({ orderId }) {
  const [job, setJob] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!orderId) return;
    fetch(`/api/fabrication?orderId=${orderId}&limit=1`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setJob(data[0]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [orderId]);

  if (!loaded || !job) return null;

  const cfg = STAGE_CONFIG[job.status] || { label: job.status, Icon: HelpCircle, cls: "bg-muted text-muted-foreground" };
  const { label, Icon, cls } = cfg;

  const badge = (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-default ${cls} ${job.status === "flagged" ? "cursor-pointer" : ""}`}>
      <Glasses className="size-3 shrink-0" />
      <span>Lens Lab: {label}</span>
    </span>
  );

  if (job.status !== "flagged") return badge;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="focus:outline-none">
          {badge}
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-72 p-0">
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 p-2 rounded-lg bg-red-100 text-red-600 shrink-0">
            <Flag className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Issue flagged by fabricator</p>
            <p className="text-sm text-muted-foreground leading-snug">
              {job.flagReason || "No reason provided."}
            </p>
            {job.fabricatorNotes && (
              <p className="text-xs text-muted-foreground/70 mt-1 border-t pt-1">
                Note: {job.fabricatorNotes}
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
