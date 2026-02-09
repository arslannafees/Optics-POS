"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NotificationSettings({ settings, update }) {
    return (
        <Card className="border shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Bell className="h-4 w-4" /> Notification Settings
                </CardTitle>
                <CardDescription>Configure alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Low Stock Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when items are running low</p>
                    </div>
                    <Switch checked={!!settings.lowStockAlert} onCheckedChange={c => update("lowStockAlert", c)} />
                </div>
                <Separator />
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Low Stock Threshold</Label>
                    <Input type="number" value={settings.lowStockThreshold} onChange={e => update("lowStockThreshold", e.target.value)} />
                    <p className="text-xs text-muted-foreground italic">Alert when stock falls below this quantity</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts via message on dashboard</p>
                    </div>
                    <Switch checked={!!settings.emailNotifications} onCheckedChange={c => update("emailNotifications", c)} />
                </div>
                <Separator />
                <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Alert Mute Duration</Label>
                    <Select value={settings.alertMuteDuration || "refresh"} onValueChange={v => update("alertMuteDuration", v)}>
                        <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="refresh">Until page refresh</SelectItem>
                            <SelectItem value="1h">1 hour</SelectItem>
                            <SelectItem value="6h">6 hours</SelectItem>
                            <SelectItem value="24h">24 hours</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground italic">How long to hide alerts after dismissing them</p>
                </div>
            </CardContent>
        </Card>
    );
}
