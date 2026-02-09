"use client";

import { useEffect } from "react";

export function useDashboardAlerts(settings, setShowEmailAlert) {
    useEffect(() => {
        const checkMuteStatus = () => {
            const mutedAt = localStorage.getItem('alertMutedAt');
            const muteDuration = settings?.alertMuteDuration || 'refresh';
            if (!mutedAt || muteDuration === 'session' || muteDuration === 'refresh') {
                setShowEmailAlert(true);
                return;
            }
            const muteExpiry = parseInt(mutedAt, 10) + (parseInt(muteDuration, 10) * 60 * 60 * 1000);
            if (Date.now() < muteExpiry) setShowEmailAlert(false);
            else {
                localStorage.removeItem('alertMutedAt');
                setShowEmailAlert(true);
            }
        };
        checkMuteStatus();
    }, [settings?.alertMuteDuration, setShowEmailAlert]);

    const handleDismissAlert = () => {
        const muteDuration = settings?.alertMuteDuration || 'refresh';
        if (muteDuration !== 'session' && muteDuration !== 'refresh') {
            localStorage.setItem('alertMutedAt', Date.now().toString());
        }
        setShowEmailAlert(false);
    };

    return { handleDismissAlert };
}
