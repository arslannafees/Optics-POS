"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Store, ExternalLink, Trash2, Info, Edit3 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ShopsPage() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [shopName, setShopName] = useState("");

    useEffect(() => {
        fetchShops();
    }, []);


    async function fetchShops() {
        setLoading(true);
        try {
            const res = await fetch("/api/super-admin/shops");
            if (res.ok) {
                const data = await res.json();
                setShops(data);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoading(false);
        }
    }


    async function handleAddShop(e) {
        if (e) e.preventDefault();
        if (!shopName) return toast.error("Shop name is required");

        setSaving(true);
        try {
            const res = await fetch("/api/super-admin/shops", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: shopName }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Shop added successfully");
                setShowAddModal(false);
                setShopName("");
                fetchShops();
            } else {
                toast.error(data.error || "Failed to add shop");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    }


    async function handleUpdateShop(e) {
        if (e) e.preventDefault();
        if (!selectedShop || !shopName) return toast.error("Shop name is required");

        setSaving(true);
        try {
            const res = await fetch(`/api/super-admin/shops/${selectedShop.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: shopName }),
            });

            if (res.ok) {
                toast.success("Shop updated successfully");
                setShowEditModal(false);
                setShopName("");
                fetchShops();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update shop");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleStatus(shop) {
        const newStatus = shop.status === 'Active' ? 0 : 1;
        try {
            const res = await fetch(`/api/super-admin/shops/${shop.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: newStatus }),
            });

            if (res.ok) {
                toast.success(`Shop ${newStatus ? 'activated' : 'deactivated'} successfully`);
                fetchShops();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update shop status");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    }

    async function handleDeleteShop() {
        if (!selectedShop) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/super-admin/shops/${selectedShop.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Shop deleted successfully");
                setShowDeleteModal(false);
                fetchShops();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete shop");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setDeleting(false);
        }
    }

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shops</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your registered shops and their branches.
                    </p>
                </div>

                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-red-200 transition-all active:scale-95">
                            <Plus className="mr-2 h-5 w-5" />
                            Add Shop
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Add New Shop</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddShop} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="shop-name" className="text-sm font-bold text-gray-700">Shop Name</Label>
                                <Input
                                    id="shop-name"
                                    placeholder="e.g. Optics Central"
                                    className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium">This will create a new shop entry in the system.</p>
                            <DialogFooter className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    {saving ? "Adding..." : "Create Shop"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900">All Shops</h3>
                        <p className="text-sm text-gray-400">A list of all shops and their sub-branches.</p>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search shops..."
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
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4">Shop Name</TableHead>
                                    <TableHead className="text-[12px] font-bold text-gray-500 uppercase py-4">Slug</TableHead>
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
                                ) : filteredShops.length > 0 ? (
                                    filteredShops.map((shop) => (
                                        <TableRow key={shop.id} className="hover:bg-[#F8FAFC]/50 transition-colors border-gray-100 group">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center size-9 rounded-lg border border-gray-100 bg-white group-hover:border-gray-200 transition-colors">
                                                        <Store className="size-4 text-gray-400" />
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-900">{shop.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-sm">
                                                <Badge variant="outline" className="font-bold text-[10px] bg-white text-gray-500 uppercase border-gray-200 px-2 py-0.5 rounded-lg">
                                                    {shop.slug}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge className={cn(
                                                    "font-bold text-[10px] uppercase px-2 py-0.5 rounded-lg border-0 shadow-none",
                                                    shop.status === 'Active' ? "bg-[#ECFDF5] text-[#059669]" : "bg-red-50 text-red-600"
                                                )}>
                                                    {shop.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-sm font-medium text-gray-500">
                                                {new Date(shop.createdAt).toLocaleDateString()}
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
                                                                setSelectedShop(shop);
                                                                setShopName(shop.name);
                                                                setShowEditModal(true);
                                                            }}
                                                        >
                                                            <Edit3 className="size-4" />
                                                            Edit Shop
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-gray-50 focus:text-gray-900 flex items-center gap-2"
                                                            onClick={() => handleToggleStatus(shop)}
                                                        >
                                                            <ExternalLink className="size-4" />
                                                            {shop.status === 'Active' ? 'Deactivate Shop' : 'Activate Shop'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg text-[13px] font-medium py-2 px-3 focus:bg-red-50 focus:text-red-600 flex items-center gap-2"
                                                            onClick={() => {
                                                                setSelectedShop(shop);
                                                                setShowDeleteModal(true);
                                                            }}
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Delete Shop
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20">
                                            <NoData message="No shops found" />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>


            {/* Edit Shop Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Edit Shop Settings</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateShop} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-shop-name" className="text-sm font-bold text-gray-700">Shop Name</Label>
                            <Input
                                id="edit-shop-name"
                                className="h-11 border-gray-100 bg-[#F8FAFC] focus:bg-white transition-all rounded-xl shadow-none"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                required
                            />
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
                onConfirm={handleDeleteShop}
                itemName={selectedShop?.name || "this shop"}
                title="Delete Shop"
                loading={deleting}
            />
        </div>
    );
}
