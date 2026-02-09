"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccountExpiryBanner() {
    const [expiryInfo, setExpiryInfo] = React.useState(null);
    const [dismissed, setDismissed] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.expiresAt) {
                        const expiresAt = new Date(data.expiresAt);
                        // Ensure expiration is at the very end of the day (11:59:59 PM)
                        expiresAt.setHours(23, 59, 59, 999);

                        const now = new Date();
                        const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

                        // Show warning if expires within 14 days
                        if (daysLeft <= 14) {
                            setExpiryInfo({
                                expiresAt,
                                daysLeft,
                                isExpired: daysLeft <= 0,
                                validityType: data.validityType
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    React.useEffect(() => {
        if (!expiryInfo || dismissed) return;

        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryInfo, dismissed]);

    const formatCountdown = (expiryDate, currentDate) => {
        const diff = expiryDate - currentDate;
        if (diff <= 0) return "00D 00:00:00";

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const formatExpiryDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading || !expiryInfo || dismissed) {
        return null;
    }

    const { daysLeft, isExpired, expiresAt, validityType } = expiryInfo;
    const isTrial = validityType === '7days' || validityType === '14days';

    return (
        <div
            className={cn(
                "relative flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium print:hidden",
                isExpired
                    ? "bg-red-600 text-white"
                    : daysLeft <= 3
                        ? "bg-amber-500 text-white"
                        : "bg-amber-100 text-amber-900"
            )}
        >
            <AlertTriangle className="size-4 shrink-0" />
            <span>
                {isExpired ? (
                    <>
                        {isTrial
                            ? "Your trial period has ended. Please contact the administrator to upgrade your account."
                            : "Your account has expired. Please contact the administrator to extend your access."
                        }
                    </>
                ) : daysLeft === 1 ? (
                    <>
                        {isTrial
                            ? "Your trial expires tomorrow. Upgrade your account to continue using all features."
                            : "Your account expires tomorrow. Please contact the administrator."
                        }
                    </>
                ) : (
                    <>
                        {isTrial
                            ? `Your trial ends in ${daysLeft} days`
                            : `Your account expires in ${daysLeft} days`
                        } ({formatExpiryDate(expiresAt)}) [<span className="font-mono">{formatCountdown(expiresAt, now)}</span>]. Please contact the administrator to {isTrial ? 'upgrade' : 'extend'}.
                    </>
                )}
            </span>
            {!isExpired && (
                <button
                    onClick={() => setDismissed(true)}
                    className={cn(
                        "absolute right-3 p-1 rounded-full transition-colors",
                        daysLeft <= 3
                            ? "hover:bg-white/20"
                            : "hover:bg-amber-200"
                    )}
                    aria-label="Dismiss"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}
