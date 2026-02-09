"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
    const [settings, setSettings] = useState({ businessName: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        setLoading(true);
        try {
            const res = await fetch("/api/super-admin/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch("/api/super-admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                toast.success("Settings updated successfully");
            } else {
                toast.error("Failed to update settings");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage system-wide settings and preferences.
                </p>
            </div>

            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-50">
                        <div className="p-2.5 rounded-xl bg-[#F8FAFC] text-gray-400">
                            <SettingsIcon className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">General Settings</h3>
                            <p className="text-sm text-gray-400">Configure general application parameters.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2 max-w-lg">
                            <Label htmlFor="appName" className="text-sm font-bold text-gray-700">Application Name</Label>
                            <Input
                                id="appName"
                                placeholder="Enter application name"
                                className="h-12 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                value={settings.businessName || ""}
                                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                                disabled={loading}
                            />
                            <p className="text-[11px] text-gray-400 font-medium">This is the global application name.</p>
                        </div>

                        <div className="pt-6">
                            <Button
                                onClick={handleSave}
                                disabled={saving || loading}
                                className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-8 h-12 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
