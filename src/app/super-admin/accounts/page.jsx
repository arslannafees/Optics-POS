"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, User, Shield, Info, Trash2, Eye, EyeOff, Edit, ChevronDown, ChevronRight, Building2, GitBranch } from "lucide-react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/components/NoData";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AccountsPage() {
    const [users, setUsers] = useState([]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [branches, setBranches] = useState([]);
    const [expandedShops, setExpandedShops] = useState({});
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "admin", shopId: "", branchId: "", validity: "permanent" });
    const [editFormData, setEditFormData] = useState({ name: "", email: "", password: "", role: "admin", shopId: "", branchId: "", validity: "permanent" });
    const [showExtendModal, setShowExtendModal] = useState(false);
    const [extendFormData, setExtendFormData] = useState({ validity: "30days" });

    useEffect(() => {
        fetchUsers();
        fetchShops();
        fetchBranches();
    }, []);

    async function fetchBranches() {
        try {
            const res = await fetch("/api/super-admin/branches");
            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    }

    async function fetchShops() {
        try {
            const res = await fetch("/api/super-admin/shops");
            if (res.ok) {
                const data = await res.json();
                setShops(data);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    }

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await fetch("/api/super-admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddAccount(e) {
        if (e) e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            return toast.error("Please fill in all required fields");
        }

        if (formData.role !== 'super-admin') {
            if (!formData.shopId) return toast.error("Please select a shop for this user");
            if (!formData.branchId || formData.branchId === "all") return toast.error("Please select a branch for this user");
        }

        setSaving(true);
        try {
            const normalizedData = {
                ...formData,
                branchId: formData.branchId
            };
            const res = await fetch("/api/super-admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(normalizedData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Account created successfully");
                setShowAddModal(false);
                setFormData({ name: "", email: "", password: "", role: "admin", shopId: "", branchId: "", validity: "permanent" });
                fetchUsers();
            } else {
                toast.error(data.error || "Failed to create account");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdateUser(e) {
        if (e) e.preventDefault();
        if (!selectedUser) return;

        if (editFormData.role !== 'super-admin') {
            if (!editFormData.shopId) return toast.error("Please select a shop for this user");
            if (!editFormData.branchId || editFormData.branchId === "all") return toast.error("Please select a branch for this user");
        }

        setSaving(true);
        try {
            const normalizedData = {
                ...editFormData,
                branchId: editFormData.branchId
            };
            const res = await fetch(`/api/super-admin/users/${selectedUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(normalizedData),
            });

            if (res.ok) {
                toast.success("Account updated successfully");
                setShowEditModal(false);
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update account");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteUser() {
        if (!selectedUser) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/super-admin/users/${selectedUser.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("User deleted successfully");
                setShowDeleteModal(false);
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete user");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setDeleting(false);
        }
    }

    async function handleExtendValidity(e) {
        if (e) e.preventDefault();
        if (!selectedUser) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/super-admin/users/${selectedUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    validity: extendFormData.validity,
                    validityMode: 'extend'
                }),
            });

            if (res.ok) {
                toast.success("Validity extended successfully");
                setShowExtendModal(false);
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to extend validity");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleStatus(user) {
        try {
            const newActive = user.active === 1 ? 0 : 1;
            const res = await fetch(`/api/super-admin/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: newActive }),
            });

            if (res.ok) {
                toast.success(`Account ${newActive === 1 ? 'activated' : 'deactivated'} successfully`);
                fetchUsers();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    }

    const isLastSuperAdmin = (targetUser) => {
        if (targetUser.role !== 'super-admin') return false;
        const superAdmins = users.filter(u => u.role === 'super-admin');
        return superAdmins.length <= 1;
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    // Group accounts by shop, then by branch
    const groupedAccounts = React.useMemo(() => {
        const groups = {};

        filteredUsers.forEach(user => {
            if (user.role === 'super-admin') {
                // Super admins go in their own group
                if (!groups['super-admin']) {
                    groups['super-admin'] = { shopName: 'System Administrators', branches: {} };
                }
                if (!groups['super-admin'].branches['all']) {
                    groups['super-admin'].branches['all'] = { branchName: null, users: [] };
                }
                groups['super-admin'].branches['all'].users.push(user);
            } else {
                const shopKey = user.shopId || 'unassigned';
                const branchKey = user.branchId || 'unassigned';

                if (!groups[shopKey]) {
                    groups[shopKey] = {
                        shopName: user.shopName || 'Unassigned',
                        branches: {}
                    };
                }

                if (!groups[shopKey].branches[branchKey]) {
                    groups[shopKey].branches[branchKey] = {
                        branchName: user.branchName || 'No Branch',
                        users: []
                    };
                }

                groups[shopKey].branches[branchKey].users.push(user);
            }
        });

        return groups;
    }, [filteredUsers]);

    // Initialize all shops as expanded when users load
    React.useEffect(() => {
        if (users.length > 0 && Object.keys(expandedShops).length === 0) {
            const initialExpanded = {};
            Object.keys(groupedAccounts).forEach(key => {
                initialExpanded[key] = true;
            });
            setExpandedShops(initialExpanded);
        }
    }, [users, groupedAccounts]);

    const toggleShop = (shopKey) => {
        setExpandedShops(prev => ({
            ...prev,
            [shopKey]: !prev[shopKey]
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Accounts</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage system-wide user accounts and roles.
                    </p>
                </div>

                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-red-200 transition-all active:scale-95">
                            <Plus className="mr-2 h-5 w-5" />
                            Add Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl border-0">
                        <DialogHeader className="p-6 pb-2 border-b bg-white">
                            <DialogTitle className="text-xl font-bold text-gray-900">Create New Account</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddAccount} className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="user-name" className="text-sm font-bold text-gray-700">Full Name</Label>
                                    <Input
                                        id="user-name"
                                        placeholder="e.g. John Doe"
                                        className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="user-email" className="text-sm font-bold text-gray-700">Email Address</Label>
                                    <Input
                                        id="user-email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="user-password" className="text-sm font-bold text-gray-700">Password</Label>
                                    <Input
                                        id="user-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="user-role" className="text-sm font-bold text-gray-700">Role</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                                    >
                                        <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                            <SelectItem value="admin">Owner</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="super-admin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="user-validity" className="text-sm font-bold text-gray-700">Account Validity</Label>
                                    <Select
                                        value={formData.validity}
                                        onValueChange={(value) => setFormData({ ...formData, validity: value })}
                                    >
                                        <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                            <SelectValue placeholder="Select validity" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                            <SelectItem value="permanent">Permanent</SelectItem>
                                            <SelectItem value="7days">Trial (7 Days)</SelectItem>
                                            <SelectItem value="14days">Trial (14 Days)</SelectItem>
                                            <SelectItem value="30days">30 Days</SelectItem>
                                            <SelectItem value="6months">6 Months</SelectItem>
                                            <SelectItem value="12months">12 Months (1 Year)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.role !== 'super-admin' && (
                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="user-shop" className="text-sm font-bold text-gray-700">Assign Shop</Label>
                                            <Select
                                                value={String(formData.shopId || "")}
                                                onValueChange={(value) => setFormData({ ...formData, shopId: value, branchId: "" })}
                                            >
                                                <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                                    <SelectValue placeholder="Select shop" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                                    {shops.map(shop => (
                                                        <SelectItem key={shop.id} value={String(shop.id)}>{shop.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {formData.shopId && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label htmlFor="user-branch" className="text-sm font-bold text-gray-700">Assign Branch</Label>
                                                <Select
                                                    value={String(formData.branchId || "")}
                                                    onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                                                >
                                                    <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                                        {branches
                                                            .filter(b => String(b.shop_id) === String(formData.shopId))
                                                            .map(branch => (
                                                                <SelectItem key={branch.id} value={String(branch.id)}>{branch.name}</SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="pt-4 pb-2">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 shadow-lg shadow-red-100 transition-all active:scale-95 font-bold"
                                    >
                                        {saving ? "Creating..." : "Create Account"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900">All Accounts</h3>
                        <p className="text-sm text-gray-400">A list of all users registered in the system.</p>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-colors rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="space-y-4">
                            {/* Sort to show super-admin group first */}
                            {Object.entries(groupedAccounts)
                                .sort(([keyA], [keyB]) => {
                                    if (keyA === 'super-admin') return -1;
                                    if (keyB === 'super-admin') return 1;
                                    return 0;
                                })
                                .map(([shopKey, shopData]) => {
                                    const totalUsers = Object.values(shopData.branches).reduce(
                                        (sum, branch) => sum + branch.users.length, 0
                                    );
                                    const isExpanded = expandedShops[shopKey];
                                    const isSuperAdmin = shopKey === 'super-admin';

                                    return (
                                        <div
                                            key={shopKey}
                                            className={cn(
                                                "rounded-2xl border overflow-hidden transition-all duration-200",
                                                isSuperAdmin
                                                    ? "border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"
                                                    : "border-gray-100 bg-white"
                                            )}
                                        >
                                            {/* Shop Cluster Header */}
                                            <button
                                                onClick={() => toggleShop(shopKey)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-5 py-4 transition-colors",
                                                    isSuperAdmin
                                                        ? "hover:bg-blue-50/50"
                                                        : "hover:bg-gray-50/50"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "size-10 rounded-xl flex items-center justify-center",
                                                        isSuperAdmin
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-red-50 text-red-500"
                                                    )}>
                                                        <Building2 className="size-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-bold text-gray-900">{shopData.shopName}</h4>
                                                        <p className="text-xs text-gray-400">
                                                            {totalUsers} {totalUsers === 1 ? 'account' : 'accounts'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isExpanded ? (
                                                        <ChevronDown className="size-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronRight className="size-5 text-gray-400" />
                                                    )}
                                                </div>
                                            </button>

                                            {/* Shop Cluster Content (Branches) */}
                                            {isExpanded && (
                                                <div className="border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {Object.entries(shopData.branches).map(([branchKey, branchData]) => (
                                                        <div key={branchKey} className="border-b border-gray-50 last:border-b-0">
                                                            {/* Branch Header - only show if not super-admin and has branch name */}
                                                            {!isSuperAdmin && branchData.branchName && (
                                                                <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50/50">
                                                                    <GitBranch className="size-3.5 text-gray-400" />
                                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                                        {branchData.branchName}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400 ml-1">
                                                                        ({branchData.users.length})
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Users in this branch */}
                                                            <div className="divide-y divide-gray-50">
                                                                {branchData.users.map((user) => (
                                                                    <div
                                                                        key={user.id}
                                                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/30 transition-colors group"
                                                                    >
                                                                        {/* User Info */}
                                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                            <div className="size-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:border-gray-200 transition-all shrink-0">
                                                                                <User className="size-4" />
                                                                            </div>
                                                                            <div className="flex flex-col min-w-0">
                                                                                <span className="font-bold text-sm text-gray-900 truncate">{user.name}</span>
                                                                                <span className="text-[11px] text-gray-400 font-medium truncate">{user.email}</span>
                                                                                {user.expiresAt && (
                                                                                    <span className={cn(
                                                                                        "text-[10px] font-bold mt-0.5",
                                                                                        new Date(user.expiresAt) < new Date() ? "text-red-500" : "text-amber-600"
                                                                                    )}>
                                                                                        {new Date(user.expiresAt) < new Date() ? "Expired: " : "Expires: "}
                                                                                        {new Date(user.expiresAt).toLocaleDateString()}
                                                                                        {new Date(user.expiresAt) > new Date() && (
                                                                                            <span className="ml-1 text-gray-400 font-medium">
                                                                                                ({Math.ceil((new Date(user.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days left)
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Role Badge */}
                                                                        <div className="flex items-center gap-2 px-3 shrink-0">
                                                                            <Shield className={cn("size-3.5",
                                                                                user.role === 'admin' ? "text-red-500" :
                                                                                    user.role === 'staff' ? "text-purple-500" :
                                                                                        "text-blue-500"
                                                                            )} />
                                                                            <span className="text-xs font-bold text-gray-600 capitalize">
                                                                                {user.role === 'admin' ? 'Owner' : user.role}
                                                                            </span>
                                                                        </div>

                                                                        {/* Status Badge */}
                                                                        <div className="px-3 shrink-0">
                                                                            <Badge className={cn(
                                                                                "font-bold text-[10px] uppercase px-2 py-0.5 rounded-lg border-0 shadow-none",
                                                                                user.active === 1
                                                                                    ? "bg-emerald-50 text-emerald-600"
                                                                                    : "bg-gray-100 text-gray-500"
                                                                            )}>
                                                                                {user.active === 1 ? 'Active' : 'Inactive'}
                                                                            </Badge>
                                                                        </div>

                                                                        {/* Joined Date */}
                                                                        <div className="text-xs font-medium text-gray-400 w-24 text-right shrink-0">
                                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                                        </div>

                                                                        {/* Actions */}
                                                                        <div className="pl-3 shrink-0">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-lg">
                                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-gray-100 shadow-xl shadow-gray-100/50">
                                                                                    <DropdownMenuItem
                                                                                        className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-gray-50 focus:text-gray-900 flex items-center gap-2"
                                                                                        onClick={() => {
                                                                                            setSelectedUser(user);
                                                                                            setShowViewModal(true);
                                                                                        }}
                                                                                    >
                                                                                        <Info className="size-4" />
                                                                                        View Details
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-gray-50 focus:text-gray-900 flex items-center gap-2"
                                                                                        onClick={() => {
                                                                                            setSelectedUser(user);
                                                                                            setEditFormData({
                                                                                                name: user.name,
                                                                                                email: user.email,
                                                                                                role: user.role,
                                                                                                shopId: user.shopId ? String(user.shopId) : "",
                                                                                                branchId: user.branchId ? String(user.branchId) : "",
                                                                                                validity: user.validityType || "permanent",
                                                                                                password: ""
                                                                                            });
                                                                                            setShowEditModal(true);
                                                                                        }}
                                                                                    >
                                                                                        <Edit className="size-4" />
                                                                                        Edit Account
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-gray-50 focus:text-gray-900 flex items-center gap-2"
                                                                                        onClick={() => {
                                                                                            setSelectedUser(user);
                                                                                            setExtendFormData({ validity: "30days" });
                                                                                            setShowExtendModal(true);
                                                                                        }}
                                                                                    >
                                                                                        <Building2 className="size-4" />
                                                                                        Extend Validity
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        disabled={isLastSuperAdmin(user)}
                                                                                        className={cn(
                                                                                            "rounded-lg text-[13px] font-medium py-2 px-3 flex items-center gap-2",
                                                                                            user.active === 1
                                                                                                ? "focus:bg-amber-50 focus:text-amber-600"
                                                                                                : "focus:bg-emerald-50 focus:text-emerald-600",
                                                                                            isLastSuperAdmin(user) && "opacity-50 cursor-not-allowed"
                                                                                        )}
                                                                                        onClick={() => !isLastSuperAdmin(user) && handleToggleStatus(user)}
                                                                                        title={isLastSuperAdmin(user) ? "Cannot deactivate the last super admin" : ""}
                                                                                    >
                                                                                        {user.active === 1 ? (
                                                                                            <>
                                                                                                <Shield className="size-4" />
                                                                                                Deactivate Account
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Shield className="size-4" />
                                                                                                Activate Account
                                                                                            </>
                                                                                        )}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        disabled={isLastSuperAdmin(user)}
                                                                                        className={cn(
                                                                                            "rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-red-50 focus:text-red-600 flex items-center gap-2",
                                                                                            isLastSuperAdmin(user) && "opacity-50 cursor-not-allowed"
                                                                                        )}
                                                                                        onClick={() => {
                                                                                            if (!isLastSuperAdmin(user)) {
                                                                                                setSelectedUser(user);
                                                                                                setShowDeleteModal(true);
                                                                                            }
                                                                                        }}
                                                                                        title={isLastSuperAdmin(user) ? "Cannot delete the last super admin" : ""}
                                                                                    >
                                                                                        <Trash2 className="size-4" />
                                                                                        Delete Account
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="py-20">
                            <NoData message="No accounts found" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Details Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="size-16 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                                    <User className="size-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{selectedUser.name}</h3>
                                    <Badge className={cn(
                                        "mt-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded-lg border-0 shadow-none",
                                        selectedUser.role === 'super-admin' ? "bg-blue-50 text-blue-600" :
                                            selectedUser.role === 'staff' ? "bg-purple-50 text-purple-600" :
                                                "bg-red-50 text-red-600"
                                    )}>
                                        {selectedUser.role === 'admin' ? 'Owner' : selectedUser.role}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-4 px-1">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                                    <p className="text-sm font-medium text-gray-700">{selectedUser.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-emerald-500" />
                                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-tight">Active</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Member Since</p>
                                    <p className="text-sm font-medium text-gray-700">{new Date(selectedUser.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                {selectedUser.expiresAt && (
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Expiry</p>
                                        <p className={cn(
                                            "text-sm font-bold",
                                            new Date(selectedUser.expiresAt) < new Date() ? "text-red-600" : "text-amber-600"
                                        )}>
                                            {new Date(selectedUser.expiresAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            {new Date(selectedUser.expiresAt) < new Date() && " (Expired)"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-11 transition-all active:scale-95"
                            onClick={() => setShowViewModal(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Extend Validity Modal */}
            <Dialog open={showExtendModal} onOpenChange={setShowExtendModal}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Extend Validity</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <form onSubmit={handleExtendValidity} className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
                                <p className="font-bold mb-1">Current Expiry:</p>
                                <p>
                                    {selectedUser.expiresAt
                                        ? new Date(selectedUser.expiresAt).toLocaleDateString(undefined, { dateStyle: 'full' })
                                        : "Permanent Account"}
                                </p>
                                <p className="mt-2 text-xs opacity-80">
                                    New validity will be added to the current expiry date.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="extend-validity" className="text-sm font-bold text-gray-700">Add Duration</Label>
                                <Select
                                    value={extendFormData.validity}
                                    onValueChange={(value) => setExtendFormData({ ...extendFormData, validity: value })}
                                >
                                    <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                        <SelectItem value="7days">7 Days</SelectItem>
                                        <SelectItem value="14days">14 Days</SelectItem>
                                        <SelectItem value="30days">30 Days</SelectItem>
                                        <SelectItem value="6months">6 Months</SelectItem>
                                        <SelectItem value="12months">12 Months (1 Year)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowExtendModal(false)}
                                    className="rounded-xl h-11"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 shadow-lg shadow-red-100 transition-all active:scale-95 font-bold"
                                >
                                    {saving ? "Extending..." : "Extend Validity"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Account Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl border-0">
                    <DialogHeader className="p-6 pb-2 border-b bg-white">
                        <DialogTitle className="text-xl font-bold text-gray-900">Edit Account Settings</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <form onSubmit={handleUpdateUser} className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Full Name</Label>
                                    <Input
                                        className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Email Address</Label>
                                    <Input
                                        type="email"
                                        className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">New Password (optional)</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Leave blank to keep current"
                                            className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none pr-10"
                                            value={editFormData.password}
                                            onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Role</Label>
                                    <Select
                                        value={editFormData.role}
                                        onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                                    >
                                        <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                            <SelectItem value="admin">Owner</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                            <SelectItem value="super-admin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Account Validity</Label>
                                    <Select
                                        value={editFormData.validity}
                                        onValueChange={(value) => setEditFormData({ ...editFormData, validity: value })}
                                    >
                                        <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                            <SelectValue placeholder="Select validity" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                            <SelectItem value="permanent">Permanent</SelectItem>
                                            <SelectItem value="7days">Trial (7 Days)</SelectItem>
                                            <SelectItem value="14days">Trial (14 Days)</SelectItem>
                                            <SelectItem value="30days">30 Days</SelectItem>
                                            <SelectItem value="6months">6 Months</SelectItem>
                                            <SelectItem value="12months">12 Months (1 Year)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {selectedUser.expiresAt && (
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            Current Expiry: {new Date(selectedUser.expiresAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                {editFormData.role !== 'super-admin' && (
                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-gray-700">Assigned Shop</Label>
                                            <Select
                                                value={String(editFormData.shopId || "")}
                                                onValueChange={(value) => setEditFormData({ ...editFormData, shopId: value, branchId: "" })}
                                            >
                                                <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                                    <SelectValue placeholder="Select shop" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                                    {shops.map(shop => (
                                                        <SelectItem key={shop.id} value={String(shop.id)}>{shop.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {editFormData.shopId && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label className="text-sm font-bold text-gray-700">Assigned Branch</Label>
                                                <Select
                                                    value={String(editFormData.branchId || "")}
                                                    onValueChange={(value) => setEditFormData({ ...editFormData, branchId: value })}
                                                >
                                                    <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl shadow-gray-100/50">
                                                        {branches
                                                            .filter(b => String(b.shop_id) === String(editFormData.shopId))
                                                            .map(branch => (
                                                                <SelectItem key={branch.id} value={String(branch.id)}>{branch.name}</SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="pt-4 pb-2">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 shadow-lg shadow-red-100 transition-all active:scale-95 font-bold"
                                    >
                                        {saving ? "Saving Changes..." : "Save Account Changes"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteUser}
                itemName={selectedUser?.name || "this user"}
                title="Delete User Account"
                loading={deleting}
                requiredText={selectedUser?.role === 'super-admin' ? "DELETE SUPER ADMIN" : "DELETE"}
            />
        </div>
    );
}
