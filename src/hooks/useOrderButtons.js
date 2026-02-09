"use client";

import { useState, useEffect } from "react";

const defaultConfig = {
    visible: ["frame", "lens", "contact-lens", "eye-checkup"],
    hidden: ["accessory"]
};

export function useOrderButtons() {
    const [buttonConfig, setButtonConfig] = useState(() => {
        if (typeof window === "undefined") return defaultConfig;
        const saved = localStorage.getItem("optics_order_button_config");
        try {
            if (!saved) return defaultConfig;
            const config = JSON.parse(saved);
            const all = [...(config.visible || []), ...(config.hidden || [])];
            if (!all.includes("eye-checkup")) {
                return {
                    visible: [...(config.visible || []), "eye-checkup"],
                    hidden: config.hidden || ["accessory"]
                };
            }
            return config;
        } catch (e) { return defaultConfig; }
    });

    useEffect(() => {
        localStorage.setItem("optics_order_button_config", JSON.stringify(buttonConfig));
    }, [buttonConfig]);

    const [draggedType, setDraggedType] = useState(null);

    return { buttonConfig, setButtonConfig, draggedType, setDraggedType };
}
