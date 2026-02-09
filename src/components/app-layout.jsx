"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Eye,
  Glasses,
  Tag,
  Truck,
  ShoppingBag,
  FileText,
  PiggyBank,
  CreditCard,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
  MapPin,
  ClipboardList,
  Stethoscope,
  Plus,
} from "lucide-react";
import ContactLensIcon from "./ContactLensIcon";
import { AccountExpiryBanner } from "./AccountExpiryBanner";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSettings } from "@/contexts/SettingsContext";
import { useBranch } from "@/contexts/BranchContext";
import { Store } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Select imports
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const navigation = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Customers",
    url: "/customer",
    icon: Users,
  },
  {
    title: "Orders",
    url: "/order",
    icon: ShoppingCart,
  },
  {
    title: "Eye Checkup",
    url: "/order/new?addItem=eye-checkup",
    icon: Stethoscope,
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: FileText,
  },
  {
    title: "Inventory",
    icon: Package,
    items: [
      { title: "Brands", url: "/brands", icon: Tag },
      { title: "Frames", url: "/frame", icon: Glasses },
      { title: "Spectacle lenses", url: "/spectacle-lenses", icon: Eye },
      { title: "Contact Lenses", url: "/contact-lenses", icon: ContactLensIcon },
      { title: "Accessories", url: "/accessories", icon: Sparkles },
      { title: "Vendors", url: "/vendor", icon: Truck },
      { title: "Purchases", url: "/purchases", icon: ShoppingBag },
      { title: "Stock in Hand", url: "/stock-in-hand", icon: Package },
    ],
  },
  {
    title: "Reports",
    icon: FileText,
    items: [
      { title: "Sales Report", url: "/reports/sales", icon: BarChart3 },
      { title: "Purchases Report", url: "/reports/purchases", icon: ShoppingBag },
      { title: "Collection Report", url: "/reports/collection", icon: PiggyBank },
      { title: "Receivable Report", url: "/reports/receivable", icon: CreditCard },
      { title: "Item Ledger", url: "/reports/item-ledger", icon: FileText },
    ],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },

  {
    title: "Logs",
    url: "/logs",
    icon: ClipboardList,
  },
];

function AppSidebar() {
  return (
    <React.Suspense fallback={<Sidebar collapsible="icon" className="border-r print:hidden" />}>
      <AppSidebarContent />
    </React.Suspense>
  );
}

function AppSidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = React.useState(null);
  const { settings } = useSettings();

  const checkIsActive = (url) => {
    if (!url) return false;

    // For links with search params (like Eye Checkup)
    if (url.includes('?')) {
      const [baseUrl, query] = url.split('?');
      if (pathname !== baseUrl) return false;

      const params = new URLSearchParams(query);
      for (const [key, value] of params.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }

    // For standard links, ensure we don't match if the current URL has relevant search params
    // e.g., don't highlight "New Order" when on "Eye Checkup"
    if (pathname === url) {
      if (url === '/order/new' && searchParams.get('addItem') === 'eye-checkup') {
        return false;
      }
      return true;
    }

    return false;
  };

  React.useEffect(() => {
    const handleUserUpdate = () => {
      const userData = localStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };

    if (typeof window !== "undefined") {
      handleUserUpdate();
      window.addEventListener("storage", handleUserUpdate);
      return () => window.removeEventListener("storage", handleUserUpdate);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedShopId");
    localStorage.removeItem("selectedBranchId");
    window.location.href = "/login";
  };

  const getUserInitial = () => {
    if (user && user.name) return user.name.charAt(0).toUpperCase();
    return "A";
  };

  return (
    <Sidebar collapsible="icon" className="border-r print:hidden">
      <SidebarHeader className={cn(
        "border-b transition-all duration-500 ease-in-out relative overflow-hidden flex items-center shrink-0",
        settings.businessLogo ? "h-auto py-6 group-data-[collapsible=icon]:h-16 group-data-[collapsible=icon]:py-4" : "h-16 p-3"
      )}>
        {/* Background Decorative Element */}
        {settings.businessLogo && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        )}

        <Link href="/" className="flex flex-col items-center justify-center gap-4 group/header relative z-10 outline-none">
          {settings.businessLogo ? (
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Premium Logo Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/header:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center justify-center shrink-0 transition-all duration-500 ease-in-out group-data-[collapsible=icon]:size-10 size-20 relative z-10 group-hover/header:scale-105">
                  <img
                    src={settings.businessLogo}
                    alt={settings.businessName || "Logo"}
                    className="h-[85%] w-[85%] object-contain drop-shadow-sm mix-blend-multiply"
                  />
                </div>
              </div>

              {/* Sophisticated Brand Text */}
              <div className="flex flex-col items-center gap-1.5 group-data-[collapsible=icon]:hidden opacity-100 transition-all duration-500 delay-100">
                <span className="font-extrabold text-base text-center leading-tight tracking-tight text-foreground/90 drop-shadow-sm px-2 uppercase">
                  {settings.businessName || "Optics"}
                </span>
                <div className="h-[1px] w-8 bg-primary/30 rounded-full transition-all duration-500 group-hover/header:w-16" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mt-1">
                  Management
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0 shadow-md transition-transform group-hover/header:rotate-12">
                <Eye className="size-5" />
              </div>
              <div className="flex flex-col gap-1 leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-extrabold text-sm tracking-tight text-foreground/90 uppercase">{settings.businessName || "Optics"}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  Management
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Branch Selector Removed */}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation
                .filter((item) => {
                  if (user?.role === "staff") {
                    return !["Reports", "Analytics", "Settings", "Logs"].includes(item.title);
                  }
                  return true;
                })
                .map((item) =>
                  item.items ? (
                    <Collapsible key={item.title} asChild defaultOpen={item.items.some(sub => pathname.startsWith(sub.url))}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={checkIsActive(subItem.url)}
                                >
                                  <Link href={subItem.url}>
                                    <subItem.icon className="size-3" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={checkIsActive(item.url)}
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-muted text-foreground">
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || "Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="end"
                side="top"
                sideOffset={8}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 size-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                {user?.role !== "staff" && (
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 size-4" />
                      App Settings
                    </Link>
                  </DropdownMenuItem>
                )}
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

function getPageTitle(pathname, searchParams) {
  if (pathname === "/order/new" && searchParams?.get("addItem") === "eye-checkup") {
    return "Eye Checkup";
  }
  const routes = {
    "/": "Dashboard",
    "/customer": "Customers",
    "/order": "Orders",
    "/order/new": "New Order",
    "/brands": "Brands",
    "/brands/create": "Add Brand",
    "/frame": "Frames",
    "/frame/create": "Add Frame",
    "/spectacle-lenses": "Spectacle lenses",
    "/spectacle-lenses/create": "Add Spectacle lens",
    "/contact-lenses": "Contact Lenses",
    "/contact-lenses/create": "Add Contact Lens",
    "/accessories": "Accessories",
    "/vendor": "Vendors",
    "/vendor/create": "Add Vendor",
    "/purchases": "Purchases",
    "/purchases/create": "Add Purchase",
    "/stock-in-hand": "Stock in Hand",
    "/analytics": "Analytics",
    "/settings": "Settings",
    "/prescriptions": "Prescriptions",
    "/reports/sales": "Sales Report",
    "/reports/purchases": "Purchases Report",
    "/reports/collection": "Collection Report",
    "/reports/receivable": "Receivable Report",
    "/reports/item-ledger": "Item Ledger",
  };
  return routes[pathname] || "Page";
}

function getBreadcrumbs(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ title: "Home", url: "/" }];

  let path = "";
  for (const part of parts) {
    path += `/${part}`;
    const title = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    breadcrumbs.push({ title, url: path });
  }

  return breadcrumbs;
}

function AppLayoutEffectHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { settings, refreshSettings } = useSettings();
  const { currentShop } = useBranch();

  // Update browser tab name dynamically and sync settings
  React.useEffect(() => {
    if (pathname === "/login" || pathname === "/signup") return;

    const pageTitle = getPageTitle(pathname, searchParams);
    const businessName = settings.businessName || "Optics";
    const shopName = currentShop ? ` | ${currentShop.name}` : "";
    document.title = `${pageTitle}${shopName} | ${businessName}`;

    // Ensure settings are synced when shop changes
    if (currentShop?.id) {
      refreshSettings();
    }
  }, [pathname, settings.businessName, currentShop, refreshSettings, searchParams]);

  return null;
}

export function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();
  const { currentShop, currentBranch, shops, branches, setCurrentShop, setCurrentBranch, loading: contextLoading } = useBranch();

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const breadcrumbs = getBreadcrumbs(pathname);


  // Check authentication on mount
  React.useEffect(() => {
    // Skip auth check for login/signup pages
    if (pathname === "/login" || pathname === "/signup") {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const userObj = userString ? JSON.parse(userString) : null;
    setUser(userObj);

    if (!token) {
      router.push("/login");
    } else if (userObj?.role === 'super-admin' && !pathname.startsWith("/super-admin")) {
      // Super admin is not allowed on shop dashboard
      router.push("/super-admin");
    } else {
      setIsAuthenticated(true);

      // Restricted access for staff
      const restrictedPaths = ["/reports", "/analytics", "/settings"];
      if (userObj?.role === "staff" && restrictedPaths.some(p => pathname.startsWith(p))) {
        toast.error("You do not have permission to access this page");
        router.push("/");
      }
    }
    setIsLoading(false);
  }, [pathname, router]);

  // Don't show sidebar on login/signup pages or super-admin pages
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/super-admin")) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (isLoading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <React.Suspense fallback={null}>
        <AppLayoutEffectHandler />
      </React.Suspense>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 print:hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.url}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.url}>{crumb.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-4">
            {/* Shop Label (Static) */}
            <div className="flex items-center gap-2">
              <Store className="size-4 text-muted-foreground hidden sm:block" />
              <div className="flex h-9 w-[180px] items-center px-3 text-sm font-medium bg-secondary/50 rounded-lg text-foreground/90">
                {currentShop?.name || "Select Shop"}
              </div>
            </div>

            {/* Branch Selector/Label */}
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground hidden sm:block" />
              {user?.role === 'admin' ? (
                <Select
                  value={currentBranch?.id?.toString() || (branches.length > 0 ? branches[0].id.toString() : "")}
                  onValueChange={(value) => {
                    const branch = branches.find(b => b.id.toString() === value);
                    setCurrentBranch(branch || null);
                  }}
                >
                  <SelectTrigger className="w-[180px] h-9 bg-secondary/50 border-0 focus:ring-0 text-foreground/90 font-medium rounded-lg">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex h-9 w-[180px] items-center px-3 text-sm font-medium bg-secondary/50 rounded-lg text-foreground/90">
                  {currentBranch?.name || "All Branches"}
                </div>
              )}
            </div>
          </div>
        </header>
        <AccountExpiryBanner />
        <main className="flex-1 overflow-auto print:overflow-visible">
          <div className="container py-6 max-w-7xl mx-auto px-4 md:px-6 print:p-0 print:m-0 print:max-w-none">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
