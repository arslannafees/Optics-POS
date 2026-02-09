"use client";

import React from "react";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SettingsHeader: Renders the action bar for Settings.
 */
export function SettingsHeader({ onSave, saving }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your application preferences</p>
            </div>
            <Button
                size="sm"
                onClick={onSave}
                disabled={saving}
                className="bg-[#05664F] hover:bg-[#045240] text-white px-4 h-9 gap-2 transition-colors"
            >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
            </Button>
        </div>
    );
}
