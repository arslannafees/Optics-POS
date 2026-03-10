"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Clock,
  LogOut,
  ChevronDown,
  Glasses,
  History,
  Zap,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSettings } from "@/contexts/SettingsContext";
import { useBranch } from "@/contexts/BranchContext";
import { Store, MapPin } from "lucide-react";

const fabricatorNav = [
  { title: "Dashboard", url: "/lens-fabricator", icon: LayoutDashboard },
  { title: "Job Queue", url: "/lens-fabricator/jobs", icon: ListChecks },
  { title: "History", url: "/lens-fabricator/history", icon: History },
];

function FabricatorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const { settings } = useSettings();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedShopId");
    localStorage.removeItem("selectedBranchId");
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" className="border-r print:hidden">
      <SidebarHeader className={cn(
        "border-b transition-all duration-500 ease-in-out relative overflow-hidden flex items-center shrink-0",
        settings.businessLogo ? "h-auto py-6 group-data-[collapsible=icon]:h-16 group-data-[collapsible=icon]:py-4" : "h-16 p-3"
      )}>
        {settings.businessLogo && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        )}
        <Link href="/lens-fabricator" className="flex flex-col items-center justify-center gap-4 group/header relative z-10 outline-none">
          {settings.businessLogo ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/header:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center justify-center shrink-0 transition-all duration-500 ease-in-out group-data-[collapsible=icon]:size-10 size-20 relative z-10">
                  <img
                    src={settings.businessLogo}
                    alt={settings.businessName || "Logo"}
                    className="h-[85%] w-[85%] object-contain drop-shadow-sm mix-blend-multiply"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5 group-data-[collapsible=icon]:hidden">
                <span className="font-extrabold text-base text-center leading-tight tracking-tight text-foreground/90 px-2 uppercase">
                  {settings.businessName || "Optics"}
                </span>
                <div className="h-[1px] w-8 bg-primary/30 rounded-full" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                  Lens Fabricator
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0 shadow-md">
                <Glasses className="size-5" />
              </div>
              <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
                <span className="font-extrabold text-sm tracking-tight uppercase">{settings.businessName || "Lens Lab"}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Fabricator Portal</span>
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Fabrication</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fabricatorNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-muted text-foreground">
                      {user?.name?.charAt(0)?.toUpperCase() || "L"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "Fabricator"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email || ""}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="top" sideOffset={8}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                  <span className="text-muted-foreground">Dark Mode</span>
                  <ThemeToggle />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function LensFabricatorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentShop, currentBranch } = useBranch();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token) {
      router.push("/login");
      return;
    }
    if (user?.role !== "lens-fabricator") {
      router.push("/");
      return;
    }
    setIsReady(true);
  }, [pathname, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <FabricatorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur px-4 print:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-semibold text-sm text-muted-foreground">Lens Fabricator Portal</span>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-muted-foreground hidden sm:block" />
              <div className="flex h-9 w-[180px] items-center px-3 text-sm font-medium bg-secondary/50 rounded-lg text-foreground/90">
                {currentShop?.name || "Select Shop"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground hidden sm:block" />
              <div className="flex h-9 w-[180px] items-center px-3 text-sm font-medium bg-secondary/50 rounded-lg text-foreground/90">
                {currentBranch?.name || "All Branches"}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 max-w-7xl mx-auto px-4 md:px-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
