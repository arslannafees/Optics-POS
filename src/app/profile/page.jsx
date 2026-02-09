"use client";

import { useState, useEffect } from "react";
import { User, RefreshCw, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function ProfilePage() {
    const [userProfile, setUserProfile] = useState({
        name: "",
        email: "",
        role: "admin",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setUserProfile(prev => ({
                    ...prev,
                    name: data.name || "",
                    email: data.email || "",
                    role: data.role || "admin",
                }));
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: userProfile.name,
                    email: userProfile.email,
                }),
            });

            if (res.ok) {
                toast.success("Profile updated successfully");

                // Update local storage user data
                const userData = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({ ...userData, name: userProfile.name, email: userProfile.email }));

                // Trigger a refresh event for components listening to storage
                window.dispatchEvent(new Event('storage'));
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!userProfile.currentPassword || !userProfile.newPassword || !userProfile.confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (userProfile.newPassword !== userProfile.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (userProfile.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: userProfile.name,
                    email: userProfile.email,
                    currentPassword: userProfile.currentPassword,
                    newPassword: userProfile.newPassword,
                }),
            });

            if (res.ok) {
                toast.success("Password updated successfully");
                setUserProfile(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                }));
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Profile Settings</h1>
                <p className="text-sm text-muted-foreground">
                    View and update your personal information
                </p>
            </div>

            <Card className="border shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Your profile details and account role
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Full Name</Label>
                            <Input
                                id="userName"
                                placeholder="Enter your name"
                                value={userProfile.name}
                                onChange={(e) =>
                                    setUserProfile((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userEmail">Email Address</Label>
                            <Input
                                id="userEmail"
                                type="email"
                                placeholder="Enter your email"
                                value={userProfile.email}
                                onChange={(e) =>
                                    setUserProfile((prev) => ({ ...prev, email: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="userRole">Account Role</Label>
                            <Input
                                id="userRole"
                                value={userProfile.role}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground uppercase">
                                Roles are managed by system administrators.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleProfileSave} disabled={saving}>
                            {saving ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Update Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Shield className="h-4 w-4" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Update your account password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                value={userProfile.currentPassword}
                                onChange={(e) =>
                                    setUserProfile((prev) => ({ ...prev, currentPassword: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="••••••••"
                                value={userProfile.newPassword}
                                onChange={(e) =>
                                    setUserProfile((prev) => ({ ...prev, newPassword: e.target.value }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={userProfile.confirmPassword}
                                onChange={(e) =>
                                    setUserProfile((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={handlePasswordUpdate} disabled={saving}>
                            {saving ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="mr-2 h-4 w-4" />
                            )}
                            Update Password
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
