"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Store,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck,
    Menu,
    X,
    MapPin,
    PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { AccountExpiryBanner } from "@/components/AccountExpiryBanner";
import { useSettings } from "@/contexts/SettingsContext";

const navigation = [
    { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
    { name: "Accounts", href: "/super-admin/accounts", icon: Users },
    { name: "Shops", href: "/super-admin/shops", icon: Store },
    { name: "Branches", href: "/super-admin/branches", icon: MapPin },
    { name: "Settings", href: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role !== 'super-admin') {
                router.push("/");
            } else {
                setUser(parsedUser);
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const { globalAppName } = useSettings();

    useEffect(() => {
        document.title = globalAppName;
    }, [pathname, globalAppName]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    if (!user) return null;

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r transition-all duration-300 ease-in-out lg:static",
                    sidebarOpen ? "w-64" : "w-20 -translate-x-full lg:translate-x-0"
                )}
            >
                <Link
                    href="/super-admin"
                    className={cn(
                        "flex items-center gap-3 p-6 transition-all duration-300 cursor-pointer perspective-1000 block outline-none",
                        !sidebarOpen && "justify-center px-2"
                    )}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        perspective: "1000px"
                    }}
                >
                    <div
                        className={cn("flex items-center transition-transform duration-200 ease-out preserve-3d", sidebarOpen ? "gap-3" : "justify-center")}
                        style={{
                            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x !== 0 || tilt.y !== 0 ? 1.05 : 1})`,
                            transformStyle: "preserve-3d"
                        }}
                    >
                        <div className="flex items-center justify-center size-10 rounded-xl bg-red-600 shadow-lg shadow-red-200 shrink-0 transform-gpu"
                            style={{ transform: "translateZ(20px)" }}>
                            <ShieldCheck className="size-6 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300 transform-gpu"
                                style={{ transform: "translateZ(10px)" }}>
                                <span className="font-bold text-sm tracking-tight text-gray-900 uppercase">SUPER ADMIN</span>
                                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">CONTROL PANEL</span>
                            </div>
                        )}
                    </div>
                </Link>

                <nav className="flex-1 px-4 mt-6 space-y-1">
                    <p className={cn("px-2 mb-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider", !sidebarOpen && "text-center")}>
                        Main Menu
                    </p>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-[#ECFDF5] text-[#059669]"
                                        : "text-gray-600 hover:bg-gray-50",
                                    !sidebarOpen && "justify-center px-0"
                                )}
                                title={!sidebarOpen ? item.name : ""}
                            >
                                <item.icon className={cn("size-5 shrink-0", isActive ? "text-[#059669]" : "group-hover:text-gray-900")} />
                                {sidebarOpen && <span className="text-[13px] font-medium animate-in fade-in slide-in-from-left-2 duration-300">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t">
                    <div className={cn("flex items-center gap-3 p-2 rounded-xl transition-all duration-300", sidebarOpen ? "bg-gray-50 px-3" : "justify-center px-0")}>
                        <Avatar className="size-9 ring-2 ring-white shadow-sm shrink-0">
                            <AvatarFallback className="bg-red-600 text-white text-xs font-bold">
                                {user.name?.charAt(0) || "A"}
                            </AvatarFallback>
                        </Avatar>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                <p className="text-[13px] font-bold text-gray-900 truncate">{user.name}</p>
                                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button
                                onClick={handleLogout}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="size-4" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="flex items-center h-16 px-6 bg-white border-b">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
                        title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                    >
                        <PanelLeft className={cn("size-5 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-[1px] h-6 bg-gray-200 mx-2" />
                        <h2 className="text-sm font-semibold text-gray-900">Super Admin Console</h2>
                    </div>
                </header>
                <AccountExpiryBanner />
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
