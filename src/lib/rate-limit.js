import { NextResponse } from "next/server";

/**
 * @file rate-limit.js
 * @description Simple in-memory sliding-window rate limiter.
 *
 * No external dependencies. Suitable for single-instance deployments.
 * For multi-instance, swap for Redis-backed limiter.
 */

const store = new Map();

// Cleanup old entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs) {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
        if (now - entry.windowStart > windowMs * 2) {
            store.delete(key);
        }
    }
}

/**
 * Get the client IP from the request.
 * @param {Request} req
 * @returns {string}
 */
function getClientIp(req) {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

/**
 * Rate limit a request.
 * @param {Request} req - The incoming request
 * @param {object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 min)
 * @param {number} options.max - Max requests per window (default: 5)
 * @param {string} [options.keyPrefix] - Optional prefix to namespace different limiters
 * @returns {{ success: boolean, remaining: number, response?: NextResponse }}
 */
export function rateLimit(req, { windowMs = 15 * 60 * 1000, max = 5, keyPrefix = "" } = {}) {
    cleanup(windowMs);

    const ip = getClientIp(req);
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    let entry = store.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
        // Start a new window
        entry = { windowStart: now, count: 0 };
        store.set(key, entry);
    }

    entry.count++;

    const remaining = Math.max(0, max - entry.count);

    if (entry.count > max) {
        const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
        return {
            success: false,
            remaining: 0,
            response: NextResponse.json(
                { error: "Too many requests. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(retryAfter),
                        "X-RateLimit-Limit": String(max),
                        "X-RateLimit-Remaining": "0",
                    },
                }
            ),
        };
    }

    return { success: true, remaining };
}
