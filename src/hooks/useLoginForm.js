"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error("Fill all fields");
        setLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                // Clear stale shop/branch selection from previous session
                localStorage.removeItem("selectedShopId");
                localStorage.removeItem("selectedBranchId");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                // Dispatch event to reset BranchContext
                window.dispatchEvent(new CustomEvent('userLogin', { detail: { userId: data.user.id } }));
                toast.success("Welcome back!");
                router.push(data.user.role === 'super-admin' ? "/super-admin" : "/");
            } else toast.error(data.error || "Login failed");
        } catch (e) { toast.error("Network error"); } finally { setLoading(false); }
    };

    return { email, setEmail, password, setPassword, showPassword, setShowPassword, loading, handleLogin };
}
