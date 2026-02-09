"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, MapPin, ExternalLink, Phone, Trash2, Info, Edit3 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BranchesPage() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [shops, setShops] = useState([]);
    const [formData, setFormData] = useState({ name: "", address: "", phone: "", shopId: "" });

    useEffect(() => {
        fetchBranches();
        fetchShops();
    }, []);

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

    async function fetchBranches() {
        setLoading(true);
        try {
            const res = await fetch("/api/super-admin/branches");
            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddBranch(e) {
        if (e) e.preventDefault();
        if (!formData.name) return toast.error("Branch name is required");
        if (!formData.shopId) return toast.error("Shop selection is required");

        setSaving(true);
        try {
            const res = await fetch("/api/super-admin/branches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Branch added successfully");
                setShowAddModal(false);
                setFormData({ name: "", address: "", phone: "", shopId: "" });
                fetchBranches();
            } else {
                toast.error(data.error || "Failed to add branch");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdateBranch(e) {
        if (e) e.preventDefault();
        if (!selectedBranch) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/super-admin/branches/${selectedBranch.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Branch updated successfully");
                setShowEditModal(false);
                fetchBranches();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update branch");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleStatus(branch) {
        const newStatus = branch.status === 'Active' ? 0 : 1;
        try {
            const res = await fetch(`/api/super-admin/branches/${branch.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: newStatus }),
            });

            if (res.ok) {
                toast.success(`Branch ${newStatus ? 'activated' : 'deactivated'} successfully`);
                fetchBranches();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update branch status");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    }

    async function handleDeleteBranch() {
        if (!selectedBranch) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/super-admin/branches/${selectedBranch.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Branch deleted successfully");
                setShowDeleteModal(false);
                fetchBranches();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete branch");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setDeleting(false);
        }
    }

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(search.toLowerCase()) ||
        (branch.address && branch.address.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Branches</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your physical outlet locations and branches.
                    </p>
                </div>

                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-red-200 transition-all active:scale-95">
                            <Plus className="mr-2 h-5 w-5" />
                            Add Branch
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Add New Branch</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddBranch} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold text-gray-700">Branch Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Downtown Branch"
                                    className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-sm font-bold text-gray-700">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Street, City, Country"
                                    className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-bold text-gray-700">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+1 234 567 890"
                                    className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Select Shop</Label>
                                <Select
                                    value={formData.shopId}
                                    onValueChange={(value) => setFormData({ ...formData, shopId: value })}
                                >
                                    <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                        <SelectValue placeholder="Select a shop" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100">
                                        {shops.map((shop) => (
                                            <SelectItem key={shop.id} value={shop.id.toString()} className="rounded-lg">
                                                {shop.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    {saving ? "Adding..." : "Create Branch"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900">All Branches</h3>
                        <p className="text-sm text-gray-400">A detailed list of all branch locations.</p>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or address..."
                                className="pl-10 h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-colors rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#F8FAFC]">
                                <TableRow className="hover:bg-transparent border-gray-100">
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4">Branch Name</TableHead>
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4">Shop</TableHead>
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4">Contact Info</TableHead>
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4">Status</TableHead>
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4">Created At</TableHead>
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4 text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <TableRow key={i} className="border-gray-100">
                                            <TableCell colSpan={5} className="py-6"><Skeleton className="h-6 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredBranches.length > 0 ? (
                                    filteredBranches.map((branch) => (
                                        <TableRow key={branch.id} className="hover:bg-[#F8FAFC]/50 transition-colors border-gray-100 group">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center size-9 rounded-lg border border-gray-100 bg-white group-hover:border-gray-200 transition-colors">
                                                        <MapPin className="size-4 text-gray-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-gray-900">{branch.name}</span>
                                                        <span className="text-[11px] text-gray-400 truncate max-w-[200px]">{branch.address || "No address"}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="font-bold text-[10px] bg-white text-gray-500 uppercase border-gray-200 px-2 py-0.5 rounded-lg">
                                                    {branch.shopName || "N/A"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Phone className="size-3" />
                                                        {branch.phone || "N/A"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge className={cn(
                                                    "font-bold text-[10px] uppercase px-2 py-0.5 rounded-lg border-0 shadow-none",
                                                    branch.status === 'Active' ? "bg-[#ECFDF5] text-[#059669]" : "bg-red-50 text-red-600"
                                                )}>
                                                    {branch.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-sm font-medium text-gray-500">
                                                {new Date(branch.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="py-4 text-right pr-6 text-gray-400">
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
                                                                setSelectedBranch(branch);
                                                                setShowViewModal(true);
                                                            }}
                                                        >
                                                            <Info className="size-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-gray-50 focus:text-gray-900 flex items-center gap-2"
                                                            onClick={() => {
                                                                setSelectedBranch(branch);
                                                                setFormData({
                                                                    name: branch.name,
                                                                    address: branch.address || "",
                                                                    phone: branch.phone || "",
                                                                    shopId: branch.shopId?.toString() || ""
                                                                });
                                                                setShowEditModal(true);
                                                            }}
                                                        >
                                                            <Edit3 className="size-4" />
                                                            Edit Settings
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-gray-50 focus:text-gray-900 flex items-center gap-2"
                                                            onClick={() => handleToggleStatus(branch)}
                                                        >
                                                            <ExternalLink className="size-4" />
                                                            {branch.status === 'Active' ? 'Deactivate Branch' : 'Activate Branch'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-red-50 focus:text-red-600 flex items-center gap-2"
                                                            onClick={() => {
                                                                setSelectedBranch(branch);
                                                                setShowDeleteModal(true);
                                                            }}
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Delete Branch
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20">
                                            <NoData message="No branches found" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* View Details Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Branch Details</DialogTitle>
                    </DialogHeader>
                    {selectedBranch && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="size-16 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                                    <MapPin className="size-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{selectedBranch.name}</h3>
                                    <Badge className={cn(
                                        "mt-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded-lg border-0 shadow-none",
                                        selectedBranch.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {selectedBranch.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-4 px-1">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                                    <p className="text-sm font-medium text-gray-700">{selectedBranch.address || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-700">{selectedBranch.phone || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Created At</p>
                                    <p className="text-sm font-medium text-gray-700">{new Date(selectedBranch.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
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

            {/* Edit Branch Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Edit Branch Settings</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateBranch} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-sm font-bold text-gray-700">Branch Name</Label>
                            <Input
                                id="edit-name"
                                className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-address" className="text-sm font-bold text-gray-700">Address</Label>
                            <Input
                                id="edit-address"
                                className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone" className="text-sm font-bold text-gray-700">Phone Number</Label>
                            <Input
                                id="edit-phone"
                                className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-700">Select Shop</Label>
                            <Select
                                value={formData.shopId}
                                onValueChange={(value) => setFormData({ ...formData, shopId: value })}
                            >
                                <SelectTrigger className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none">
                                    <SelectValue placeholder="Select a shop" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100">
                                    {shops.map((shop) => (
                                        <SelectItem key={shop.id} value={shop.id.toString()} className="rounded-lg">
                                            {shop.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="pt-4">

                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 shadow-lg shadow-red-100 transition-all active:scale-95"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteBranch}
                itemName={selectedBranch?.name || "this branch"}
                title="Delete Branch"
                loading={deleting}
            />
        </div >
    );
}
