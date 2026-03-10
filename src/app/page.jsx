"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSettings } from "@/contexts/SettingsContext";
import { useDashboard } from "@/hooks/useDashboard";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { ActivityLogsAlert } from "./components/dashboard/ActivityLogsAlert";
import { NotificationTray } from "./components/dashboard/NotificationTray";
import { DashboardStats } from "./components/dashboard/DashboardStats";
import { DashboardChart } from "./components/dashboard/DashboardChart";
import { RecentOrdersTable } from "./components/dashboard/RecentOrdersTable";
import { QuickLinks } from "./components/dashboard/QuickLinks";

export default function Dashboard() {
  const { settings } = useSettings();
  const d = useDashboard(settings);
  const { handleDismissAlert } = useDashboardAlerts(settings, d.setShowEmailAlert);
  const [dismissed, setDismissed] = React.useState(false);

  // Reset dismissal state when alerts change (e.g. new low stock items appear)
  // This ensures "Dismiss All" only hides what the user has currently seen.
  React.useEffect(() => {
    setDismissed(false);
  }, [d.alerts.length, d.lowStockItems.length, d.pendingPayments.length, d.flaggedFabJobs.length]);

  const visibleAlerts = dismissed ? [] : d.alerts;
  const filteredAlerts = visibleAlerts.filter(a => !a.includes('🔔 Low Stock:') && !a.includes('💰 Outstanding:'));
  const visibleLowStock = dismissed ? [] : d.lowStockItems;
  const visiblePayments = dismissed ? [] : d.pendingPayments;
  const visibleFlaggedJobs = dismissed ? [] : d.flaggedFabJobs;

  const handleDismissAll = () => {
    setDismissed(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between animate-fade-in [animation-fill-mode:forwards]">
        <div><h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1><p className="text-sm text-muted-foreground">Overview of your optical store</p></div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full border-muted-foreground/20 hover:bg-muted/80 transition-all duration-300">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {(() => {
                const visibleAlertsCount = filteredAlerts.length + visibleLowStock.length + visiblePayments.length + visibleFlaggedJobs.length;
                return visibleAlertsCount > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
                    {visibleAlertsCount}
                  </span>
                ) : null;
              })()}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 dashboard-notification-tray border-none shadow-2xl"
            align="end"
            sideOffset={8}
          >
            <NotificationTray
              alerts={visibleAlerts}
              lowStockItems={visibleLowStock}
              pendingPayments={visiblePayments}
              flaggedFabJobs={visibleFlaggedJobs}
              currency={settings.currency}
              onDismissAll={handleDismissAll}
            />
          </PopoverContent>
        </Popover>
      </div>

      <ActivityLogsAlert count={d.newLogsCount} onClear={() => { localStorage.setItem('lastLogCheck', Date.now().toString()); d.setNewLogsCount(0); }} />

      <DashboardStats stats={d.stats} currency={settings.currency} isLoading={d.isLoading} />

      <div className="grid gap-6 lg:grid-cols-5">
        <DashboardChart data={d.chartData} currency={settings.currency} isLoading={d.isLoading} />
        <RecentOrdersTable orders={d.recentOrders} isLoading={d.isLoading} currency={settings.currency} dateFormat={settings?.dateFormat} />
      </div>

      <QuickLinks />
    </div>
  );
}
