"use client";

import { useEffect } from "react";

/**
 * AuthFetchProvider
 * 
 * Installs a global fetch interceptor that automatically attaches
 * the JWT Bearer token from localStorage to every same-origin API request.
 * 
 * This avoids modifying 50+ individual fetch() calls across the frontend.
 * Only patches requests to /api/* paths (same-origin API routes).
 */
// Patch fetch synchronously outside of React lifecycle so we intercept initial SWR fetches
if (typeof window !== "undefined") {
    if (!window._fetchPatched) {
        const originalFetch = window.fetch;
        let isRefreshing = false;
        let failedQueue = [];

        const processQueue = (error, token = null) => {
            failedQueue.forEach((prom) => {
                if (error) prom.reject(error);
                else prom.resolve(token);
            });
            failedQueue = [];
        };

        window.fetch = async function patchedFetch(input, init = {}) {
            const url = typeof input === "string" ? input : input?.url || "";
            const isApiCall = url.startsWith("/api/") && url !== "/api/login" && url !== "/api/auth/refresh";

            const attachToken = (options, token) => {
                if (!token) return options;
                const headers = new Headers(options.headers || {});
                if (!headers.has("Authorization")) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                return { ...options, headers };
            };

            if (isApiCall) {
                const token = localStorage.getItem("token");
                init = attachToken(init, token);
            }

            try {
                const response = await originalFetch.call(this, input, init);

                if (response.status === 401 && isApiCall) {
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then((token) => originalFetch.call(this, input, attachToken(init, token)))
                            .catch((err) => Promise.reject(err));
                    }

                    isRefreshing = true;

                    try {
                        const refreshRes = await originalFetch("/api/auth/refresh", { method: "POST" });
                        if (refreshRes.ok) {
                            const { token: newToken } = await refreshRes.json();
                            localStorage.setItem("token", newToken);
                            processQueue(null, newToken);
                            return originalFetch.call(this, input, attachToken(init, newToken));
                        } else {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            processQueue(new Error("Refresh failed"), null);
                            window.location.href = "/login";
                            return response;
                        }
                    } catch (refreshErr) {
                        processQueue(refreshErr, null);
                        throw refreshErr;
                    } finally {
                        isRefreshing = false;
                    }
                }

                return response;
            } catch (error) {
                throw error;
            }
        };
        window._fetchPatched = true;
    }
}

export function AuthFetchProvider({ children }) {
    return children;
}
