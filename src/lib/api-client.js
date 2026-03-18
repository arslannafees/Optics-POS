/**
 * @file api-client.js
 * @description Centralized API fetch wrapper that automatically attaches
 * the JWT Bearer token from localStorage to every request.
 *
 * Usage:
 *   import { apiFetch } from "@/lib/api-client";
 *   const res = await apiFetch("/api/frames?shopId=1");
 *   const data = await res.json();
 *
 * For POST/PUT/DELETE with body:
 *   const res = await apiFetch("/api/frames", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 */

export function apiFetch(url, options = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers = new Headers(options.headers || {});

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
        ...options,
        headers,
    });
}
