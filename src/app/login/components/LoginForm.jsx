"use client";

import React from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function LoginForm({ email, setEmail, password, setPassword, rememberMe, setRememberMe, showPassword, setShowPassword, loading, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Switch id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                    <Label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">Remember me</Label>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign in"}
            </Button>
        </form>
    );
}
