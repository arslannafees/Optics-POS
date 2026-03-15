"use client";

import { useEffect, useRef } from "react";

/**
 * Detects input from a physical USB/Bluetooth barcode scanner.
 * Scanners send characters very rapidly (< 50ms apart) then press Enter.
 * This hook distinguishes scanner input from normal keyboard typing.
 *
 * @param {(barcode: string) => void} onScan - called when a barcode is detected
 * @param {{ enabled?: boolean, minLength?: number, maxGap?: number }} options
 */
export function useBarcodeScanner(onScan, { enabled = true, minLength = 4, maxGap = 100 } = {}) {
    const buffer = useRef("");
    const lastKeyTime = useRef(0);
    const onScanRef = useRef(onScan);

    // Keep ref fresh without re-running effect
    useEffect(() => { onScanRef.current = onScan; }, [onScan]);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e) => {
            // Don't intercept when user is typing in a real input field
            const tag = document.activeElement?.tagName?.toUpperCase();
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

            const now = Date.now();
            const gap = now - lastKeyTime.current;

            // If too much time passed since last key, this is a new sequence — reset
            if (gap > maxGap && buffer.current.length > 0) {
                buffer.current = "";
            }
            lastKeyTime.current = now;

            if (e.key === "Enter") {
                const code = buffer.current.trim();
                buffer.current = "";
                if (code.length >= minLength) {
                    onScanRef.current(code);
                }
                return;
            }

            // Only accumulate printable single characters
            if (e.key.length === 1) {
                buffer.current += e.key;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enabled, minLength, maxGap]);
}
